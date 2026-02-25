import { useState, useRef, useCallback, useEffect } from 'react';
import { Persona, EmotionState } from '../types';
import { Language, translations } from '../i18n/translations';
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { pcmProcessorCode, base64ToArrayBuffer, arrayBufferToBase64 } from '../utils/audio';

interface GeminiAudioState {
  isConnected: boolean;
  isConnecting: boolean;
  isSpeaking: boolean;
  emotion: EmotionState;
  error: string | null;
  transcript: string[];
}

export function useGeminiAudio(apiKey: string, language: Language) {
  const [state, setState] = useState<GeminiAudioState>({
    isConnected: false,
    isConnecting: false,
    isSpeaking: false,
    emotion: 'neutral',
    error: null,
    transcript: [],
  });

  const aiRef = useRef<GoogleGenAI | null>(null);
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const workletNodeRef = useRef<AudioWorkletNode | null>(null);
  const nextPlayTimeRef = useRef<number>(0);

  const cleanup = useCallback(() => {
    setState(prev => ({ ...prev, isConnecting: false, isConnected: false, isSpeaking: false }));

    if (workletNodeRef.current) {
      workletNodeRef.current.port.onmessage = null;
      workletNodeRef.current.disconnect();
      workletNodeRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current) {
      if (audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => { });
      }
      audioContextRef.current = null;
    }
    if (sessionPromiseRef.current) {
      const p = sessionPromiseRef.current;
      sessionPromiseRef.current = null; // Clear immediately
      p.then(session => {
        if (session && typeof session.close === 'function') {
          try { session.close(); } catch (e) { }
        }
      }).catch(() => { });
    }
    nextPlayTimeRef.current = 0;
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const playAudio = useCallback((base64Audio: string) => {
    if (!audioContextRef.current) return;
    const ctx = audioContextRef.current;

    try {
      const arrayBuffer = base64ToArrayBuffer(base64Audio);
      const int16Array = new Int16Array(arrayBuffer);
      const float32Array = new Float32Array(int16Array.length);
      for (let i = 0; i < int16Array.length; i++) {
        float32Array[i] = int16Array[i] / 32768.0;
      }

      const audioBuffer = ctx.createBuffer(1, float32Array.length, 24000);
      audioBuffer.copyToChannel(float32Array, 0);

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);

      const startTime = Math.max(nextPlayTimeRef.current, ctx.currentTime);
      source.start(startTime);
      nextPlayTimeRef.current = startTime + audioBuffer.duration;

      setState(prev => ({ ...prev, isSpeaking: true }));
      source.onended = () => {
        setState(prev => ({ ...prev, isSpeaking: false }));
      };

    } catch (err) {
      console.error("Error playing audio:", err);
    }
  }, []);

  const connect = useCallback(async (persona: Persona) => {
    if (!apiKey) {
      setState(prev => ({
        ...prev,
        error: language === 'ko'
          ? 'API 키를 입력해주세요.'
          : 'Please enter your Gemini API key.',
        isConnecting: false,
      }));
      return;
    }

    cleanup();
    setState(prev => ({ ...prev, isConnecting: true, error: null, transcript: [] }));

    try {
      const langInstruction = translations[language].promptLangInstruction;
      const fullSystemPrompt = `${persona.systemPrompt}${langInstruction}

IMPORTANT BEHAVIORAL RULES:
- You are ${persona.name}. Stay in character at all times.
- Respond naturally and emotionally, as a real person would.
- Use natural speech patterns: pauses, laughs, sighs, gasps when appropriate.
- Keep responses conversational - not too long, not too short.
- React to the caller's emotions and energy.
- YOU start the conversation first with a greeting that fits your character.
- Be engaging and make the caller want to keep talking.`;

      const ai = new GoogleGenAI({ apiKey });
      aiRef.current = ai;

      const audioContext = new AudioContext({ sampleRate: 16000 });
      audioContextRef.current = audioContext;
      nextPlayTimeRef.current = audioContext.currentTime;

      // Load processor
      const blob = new Blob([pcmProcessorCode], { type: 'application/javascript' });
      const url = URL.createObjectURL(blob);
      await audioContext.audioWorklet.addModule(url);

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        }
      });
      mediaStreamRef.current = stream;

      const source = audioContext.createMediaStreamSource(stream);
      const workletNode = new AudioWorkletNode(audioContext, 'pcm-processor');
      workletNodeRef.current = workletNode;

      // Connect session
      const sessionPromise = ai.live.connect({
        model: "gemini-2.5-flash-native-audio-preview-09-2025",
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: (persona.voice || "Kore") as any },
            },
          },
          systemInstruction: {
            parts: [{ text: fullSystemPrompt }]
          },
        },
        callbacks: {
          onopen: () => {
            setState(prev => ({ ...prev, isConnected: true, isConnecting: false }));

            // Start sending audio
            workletNode.port.onmessage = (e) => {
              if (sessionPromiseRef.current) {
                const base64Data = arrayBufferToBase64(e.data);
                sessionPromiseRef.current.then((session) => {
                  session.sendRealtimeInput({
                    media: {
                      mimeType: 'audio/pcm;rate=16000',
                      data: base64Data
                    }
                  });
                }).catch(err => console.error("Error sending audio", err));
              }
            };
            source.connect(workletNode);
            workletNode.connect(audioContext.destination);

            // Trigger greeting
            const triggerText = language === 'ko'
              ? '[통화가 연결되었습니다. 캐릭터에 맞게 한국어로 인사하세요.]'
              : '[Call connected. Greet the caller in character.]';

            sessionPromiseRef.current?.then((session) => {
              // We send client Content to kick off the dialogue
              session.sendClientContent({
                turns: [{
                  role: "user",
                  parts: [{ text: triggerText }]
                }],
                turnComplete: true
              });
            });
          },
          onmessage: (message: LiveServerMessage) => {
            // Handle audio output
            const parts = message.serverContent?.modelTurn?.parts || [];
            for (const part of parts) {
              if (part.inlineData?.data) {
                playAudio(part.inlineData.data);
              }
              if (part.text) {
                setState(prev => ({
                  ...prev,
                  transcript: [...prev.transcript, part.text!],
                }));
              }
            }

            // Handle interruption
            if (message.serverContent?.interrupted) {
              if (audioContextRef.current) {
                nextPlayTimeRef.current = audioContextRef.current.currentTime;
              }
            }
          },
          onclose: () => {
            // Only run cleanup if we are still tracking this promise, otherwise it's an old connection closing
            if (sessionPromiseRef.current === sessionPromise) {
              cleanup();
            }
          },
          onerror: (err: any) => {
            console.error("Gemini session error:", err);
            // Only show error if we are the active session
            if (sessionPromiseRef.current === sessionPromise) {
              setState(prev => ({
                ...prev,
                error: language === 'ko'
                  ? '연결 오류. API 키를 확인하고 다시 시도하세요.'
                  : 'Connection error. Check your API key and try again.',
                isConnecting: false,
                isConnected: false,
              }));
              cleanup();
            }
          }
        }
      });

      sessionPromiseRef.current = sessionPromise;

    } catch (err: any) {
      console.error("Connection failed:", err);
      const message = err.message || 'Failed to connect';
      setState(prev => ({
        ...prev,
        error: message.includes('Permission denied')
          ? (language === 'ko'
            ? '마이크 접근이 필요합니다. 마이크 접근을 허용한 후 다시 시도하세요.'
            : 'Microphone access is required. Please allow microphone access and try again.')
          : message,
        isConnecting: false,
      }));
      cleanup();
    }
  }, [apiKey, language, cleanup, playAudio]);

  const disconnect = useCallback(() => {
    cleanup();
    setState({
      isConnected: false,
      isConnecting: false,
      isSpeaking: false,
      emotion: 'neutral',
      error: null,
      transcript: [],
    });
  }, [cleanup]);

  const toggleMute = useCallback(() => {
    if (mediaStreamRef.current) {
      const track = mediaStreamRef.current.getAudioTracks()[0];
      if (track) {
        track.enabled = !track.enabled;
      }
    }
  }, []);

  return {
    ...state,
    connect,
    disconnect,
    toggleMute,
    hasApiKey: !!apiKey,
  };
}
