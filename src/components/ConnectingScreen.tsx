import { useEffect, useState } from 'react';
import { Persona } from '../types';
import { useI18n } from '../i18n/context';

interface ConnectingScreenProps {
  persona: Persona;
  onConnected: () => void;
}

export function ConnectingScreen({ persona, onConnected }: ConnectingScreenProps) {
  const { t } = useI18n();
  const [stage, setStage] = useState(0);
  const [showAvatar, setShowAvatar] = useState(false);

  const stages = [
    t.findingMatch,
    t.connectingPersona,
    `${persona.name} ${t.pickingUp}`,
    t.connectedExclaim,
  ];

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 300),
      setTimeout(() => setStage(2), 600),
      setTimeout(() => { setStage(3); setShowAvatar(true); }, 900),
      setTimeout(() => onConnected(), 1400),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onConnected]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-dark-900 z-50">
      {/* Scanning effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0" style={{
          background: `radial-gradient(circle at 50% 50%, ${persona.color}15 0%, transparent 60%)`,
        }} />
        <div
          className="absolute w-full h-1 opacity-30"
          style={{
            background: `linear-gradient(90deg, transparent, ${persona.color}, transparent)`,
            animation: 'scanline 1.5s linear infinite',
          }}
        />
      </div>

      {/* Avatar reveal */}
      <div className={`relative mb-8 transition-all duration-500 ${showAvatar ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
        <div
          className="w-32 h-32 rounded-full flex items-center justify-center text-6xl"
          style={{
            background: `radial-gradient(circle, ${persona.color}40, ${persona.color}10)`,
            boxShadow: `0 0 40px ${persona.color}40, 0 0 80px ${persona.color}20`,
          }}
        >
          {persona.avatar}
        </div>
        <div
          className="absolute inset-[-8px] rounded-full border-2 border-transparent animate-spin-slow"
          style={{
            borderTopColor: persona.color,
            borderRightColor: `${persona.color}50`,
          }}
        />
      </div>

      {/* Persona name */}
      <div className={`mb-4 transition-all duration-500 delay-200 ${showAvatar ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <h2 className="font-display text-2xl font-bold text-white text-center">{persona.name}</h2>
        <p className="text-gray-400 text-sm text-center mt-1">{persona.tagline}</p>
      </div>

      {/* Connection status */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex gap-1">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: persona.color,
                animation: `connecting-dots 1.2s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
        <span className="text-gray-400 text-sm font-body">{stages[stage]}</span>
      </div>

      {/* Heartbeat line */}
      <div className="w-64 h-8 flex items-center justify-center gap-0.5">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="w-1 rounded-full"
            style={{
              backgroundColor: persona.color,
              opacity: 0.3 + Math.random() * 0.5,
              height: `${4 + Math.random() * 20}px`,
              animation: `waveform ${0.5 + Math.random() * 0.5}s ease-in-out ${Math.random() * 0.5}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
