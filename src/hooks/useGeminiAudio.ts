import { useState, useRef, useCallback, useEffect } from 'react';
import { Persona, EmotionState } from '../types';
import { Language, translations } from '../i18n/translations';

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

  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const playQueueRef = useRef<ArrayBuffer[]>([]);
  const isPlayingRef = useRef(false);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  const cleanup = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (sourceNodeRef.current) {
      try { sourceNodeRef.current.stop(); } catch { }
      sourceNodeRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    playQueueRef.current = [];
    isPlayingRef.current = false;
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const floatTo16BitPCM = (float32Array: Float32Array): ArrayBuffer => {
    const buffer = new ArrayBuffer(float32Array.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    return buffer;
  };

  const base64Encode = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const base64Decode = (base64: string): ArrayBuffer => {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  };

  const playAudioChunk = useCallback(async (audioData: ArrayBuffer) => {
    if (!audioContextRef.current) return;
    const ctx = audioContextRef.current;

    const int16Array = new Int16Array(audioData);
    const float32Array = new Float32Array(int16Array.length);
    for (let i = 0; i < int16Array.length; i++) {
      float32Array[i] = int16Array[i] / 32768;
    }

    const audioBuffer = ctx.createBuffer(1, float32Array.length, 24000);
    audioBuffer.getChannelData(0).set(float32Array);

    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);
    source.start();

    setState(prev => ({ ...prev, isSpeaking: true }));

    source.onended = () => {
      setState(prev => ({ ...prev, isSpeaking: false }));
      if (playQueueRef.current.length > 0) {
        const next = playQueueRef.current.shift()!;
        playAudioChunk(next);
      } else {
        isPlayingRef.current = false;
      }
    };
  }, []);

  const queueAudio = useCallback((audioData: ArrayBuffer) => {
    if (isPlayingRef.current) {
      playQueueRef.current.push(audioData);
    } else {
      isPlayingRef.current = true;
      playAudioChunk(audioData);
    }
  }, [playAudioChunk]);

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
      const audioContext = new AudioContext({ sampleRate: 16000 });
      audioContextRef.current = audioContext;

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        }
      });
      mediaStreamRef.current = stream;

      // Build language-aware system prompt
      const langInstruction = translations[language].promptLangInstruction;
      const triggerText = language === 'ko'
        ? '[통화가 연결되었습니다. 캐릭터에 맞게 한국어로 인사하세요.]'
        : '[Call connected. Greet the caller in character.]';

      const fullSystemPrompt = `${persona.systemPrompt}${langInstruction}\n\nIMPORTANT BEHAVIORAL RULES:\n- You are ${persona.name}. Stay in character at all times.\n- Respond naturally and emotionally, as a real person would.\n- Use natural speech patterns: pauses, laughs, sighs, gasps when appropriate.\n- Keep responses conversational - not too long, not too short.\n- React to the caller's emotions and energy.\n- YOU start the conversation first with a greeting that fits your character.\n- Be engaging and make the caller want to keep talking.`;

      const wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${apiKey}`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        const setupMessage = {
          setup: {
            model: 'models/gemini-live-2.5-flash-native-audio',
            generationConfig: {
              responseModalities: ['AUDIO'],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: {
                    voiceName: persona.voice || 'Kore',
                  }
                }
              }
            },
            systemInstruction: {
              parts: [{ text: fullSystemPrompt }]
            }
          }
        };
        ws.send(JSON.stringify(setupMessage));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.setupComplete) {
            setState(prev => ({
              ...prev,
              isConnected: true,
              isConnecting: false,
            }));

            // Start capturing and sending audio
            const source = audioContext.createMediaStreamSource(stream);
            const processor = audioContext.createScriptProcessor(4096, 1, 1);
            processorRef.current = processor;

            processor.onaudioprocess = (e) => {
              if (ws.readyState === WebSocket.OPEN) {
                const inputData = e.inputBuffer.getChannelData(0);
                const pcmData = floatTo16BitPCM(inputData);
                const base64 = base64Encode(pcmData);

                const audioMessage = {
                  realtimeInput: {
                    mediaChunks: [{
                      mimeType: 'audio/pcm;rate=16000',
                      data: base64,
                    }]
                  }
                };
                ws.send(JSON.stringify(audioMessage));
              }
            };

            source.connect(processor);
            processor.connect(audioContext.destination);

            // Trigger AI to speak first
            const triggerMessage = {
              clientContent: {
                turns: [{
                  role: 'user',
                  parts: [{ text: triggerText }]
                }],
                turnComplete: true,
              }
            };
            ws.send(JSON.stringify(triggerMessage));
          }

          if (data.serverContent) {
            const parts = data.serverContent.modelTurn?.parts || [];
            for (const part of parts) {
              if (part.inlineData?.mimeType?.startsWith('audio/')) {
                const audioData = base64Decode(part.inlineData.data);
                queueAudio(audioData);
              }
              if (part.text) {
                setState(prev => ({
                  ...prev,
                  transcript: [...prev.transcript, part.text],
                }));
              }
            }
          }
        } catch {
          // Ignore parse errors for binary frames
        }
      };

      ws.onerror = () => {
        setState(prev => ({
          ...prev,
          error: language === 'ko'
            ? '연결 오류. API 키를 확인하고 다시 시도하세요.'
            : 'Connection error. Check your API key and try again.',
          isConnecting: false,
          isConnected: false,
        }));
      };

      ws.onclose = () => {
        setState(prev => ({
          ...prev,
          isConnected: false,
          isConnecting: false,
        }));
      };

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to connect';
      setState(prev => ({
        ...prev,
        error: message.includes('Permission denied')
          ? (language === 'ko'
            ? '마이크 접근이 필요합니다. 마이크 접근을 허용한 후 다시 시도하세요.'
            : 'Microphone access is required. Please allow microphone access and try again.')
          : message,
        isConnecting: false,
      }));
    }
  }, [apiKey, language, cleanup, queueAudio]);

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
