import { useState, useEffect, useCallback } from 'react';
import { PhoneOff, Mic, MicOff, Heart, MessageSquare, Volume2, VolumeX } from 'lucide-react';
import { Persona, EmotionState } from '../types';
import { useI18n } from '../i18n/context';

interface CallScreenProps {
  persona: Persona;
  isConnected: boolean;
  isSpeaking: boolean;
  emotion: EmotionState;
  error: string | null;
  onEndCall: () => void;
  onToggleMute: () => void;
  transcript: string[];
}

export function CallScreen({
  persona,
  isConnected,
  isSpeaking,
  emotion: _emotion,
  error,
  onEndCall,
  onToggleMute,
  transcript,
}: CallScreenProps) {
  const { t } = useI18n();
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [waveformHeights, setWaveformHeights] = useState<number[]>(Array(30).fill(4));
  const [bgPulse, setBgPulse] = useState(false);
  const [isSpeakerOff, setIsSpeakerOff] = useState(false);

  useEffect(() => {
    if (!isConnected) return;
    const interval = setInterval(() => setDuration(d => d + 1), 1000);
    return () => clearInterval(interval);
  }, [isConnected]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isSpeaking) {
        setWaveformHeights(Array(30).fill(0).map(() => 4 + Math.random() * 28));
      } else {
        setWaveformHeights(prev => prev.map(h => Math.max(4, h * 0.8 + (Math.random() * 4))));
      }
    }, 100);
    return () => clearInterval(interval);
  }, [isSpeaking]);

  useEffect(() => {
    setBgPulse(isSpeaking);
  }, [isSpeaking]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const handleMute = useCallback(() => {
    setIsMuted(!isMuted);
    onToggleMute();
  }, [isMuted, onToggleMute]);

  const getCategoryName = () => {
    return t.categories[persona.category]?.name || persona.category;
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-dark-900 z-50">
      <div
        className="absolute inset-0 transition-all duration-1000"
        style={{
          background: `radial-gradient(circle at 50% 40%, ${persona.color}${bgPulse ? '25' : '10'} 0%, transparent 60%)`,
        }}
      />
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at 50% 60%, ${persona.color}08 0%, transparent 40%)`,
          opacity: bgPulse ? 1 : 0.3,
        }}
      />

      {/* Top info bar */}
      <div className="relative z-10 flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-neon-green' : 'bg-red-500'} animate-pulse`} />
          <span className="text-xs text-gray-400 font-body">
            {isConnected ? t.connectedLabel : t.connectingLabel}
          </span>
        </div>
        <div className="text-sm font-display text-white tracking-wider">
          {formatTime(duration)}
        </div>
        <button
          onClick={() => setIsFavorited(!isFavorited)}
          className="p-2 rounded-full hover:bg-white/5 transition-colors"
        >
          <Heart
            size={18}
            className={isFavorited ? 'fill-neon-pink text-neon-pink' : 'text-gray-500'}
          />
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-4">
        <div className="relative mb-6">
          <div
            className="absolute inset-[-20px] rounded-full transition-all duration-500"
            style={{
              background: `radial-gradient(circle, ${persona.color}20, transparent)`,
              transform: isSpeaking ? 'scale(1.3)' : 'scale(1)',
            }}
          />
          <div
            className="absolute inset-[-10px] rounded-full border transition-all duration-300"
            style={{
              borderColor: `${persona.color}${isSpeaking ? '60' : '20'}`,
              boxShadow: isSpeaking ? `0 0 30px ${persona.color}30` : 'none',
            }}
          />

          <div
            className={`w-36 h-36 md:w-44 md:h-44 rounded-full flex items-center justify-center text-7xl md:text-8xl
              ${isSpeaking ? 'animate-avatar-breathe' : ''}`}
            style={{
              background: `radial-gradient(circle at 30% 30%, ${persona.color}30, ${persona.color}10)`,
              boxShadow: `0 0 ${isSpeaking ? 60 : 20}px ${persona.color}${isSpeaking ? '40' : '15'}`,
            }}
          >
            {persona.avatar}
          </div>

          {isSpeaking && (
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-0.5">
              {[0, 1, 2, 3, 4].map(i => (
                <div
                  key={i}
                  className="w-1 rounded-full"
                  style={{
                    backgroundColor: persona.color,
                    animation: `waveform ${0.3 + i * 0.1}s ease-in-out infinite`,
                    height: '12px',
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-1">{persona.name}</h2>
        <p className="text-gray-400 text-sm mb-2">{persona.tagline}</p>
        <div
          className="px-3 py-1 rounded-full text-xs font-body"
          style={{
            backgroundColor: `${persona.color}20`,
            color: persona.color,
            border: `1px solid ${persona.color}30`,
          }}
        >
          {getCategoryName()}
        </div>

        {error && (
          <div className="mt-4 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center max-w-sm">
            {error}
          </div>
        )}

        <div className="mt-8 flex items-center justify-center gap-0.5 h-12">
          {waveformHeights.map((h, i) => (
            <div
              key={i}
              className="w-1 rounded-full transition-all duration-100"
              style={{
                height: `${h}px`,
                backgroundColor: persona.color,
                opacity: 0.3 + (h / 32) * 0.7,
              }}
            />
          ))}
        </div>

        {showTranscript && transcript.length > 0 && (
          <div className="mt-4 w-full max-w-sm max-h-32 overflow-y-auto scrollbar-hide">
            <div className="glass rounded-xl p-3">
              {transcript.map((txt, i) => (
                <p key={i} className="text-xs text-gray-300 mb-1 animate-fade-in">{txt}</p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom controls */}
      <div className="relative z-10 pb-8 pt-4 px-4">
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={handleMute}
            className="w-14 h-14 rounded-full glass flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            style={{
              borderColor: isMuted ? '#ef4444' : 'rgba(255,255,255,0.1)',
            }}
          >
            {isMuted ? <MicOff size={22} className="text-red-500" /> : <Mic size={22} className="text-white" />}
          </button>

          <button
            onClick={onEndCall}
            className="w-18 h-18 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 p-5"
            style={{
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              boxShadow: '0 0 30px rgba(239,68,68,0.4)',
            }}
          >
            <PhoneOff size={28} className="text-white" />
          </button>

          <button
            onClick={() => setIsSpeakerOff(!isSpeakerOff)}
            className="w-14 h-14 rounded-full glass flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          >
            {isSpeakerOff ? <VolumeX size={22} className="text-red-500" /> : <Volume2 size={22} className="text-white" />}
          </button>

          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className="w-14 h-14 rounded-full glass flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            style={{
              borderColor: showTranscript ? `${persona.color}60` : 'rgba(255,255,255,0.1)',
            }}
          >
            <MessageSquare size={22} className={showTranscript ? 'text-neon-blue' : 'text-white'} />
          </button>
        </div>
      </div>
    </div>
  );
}
