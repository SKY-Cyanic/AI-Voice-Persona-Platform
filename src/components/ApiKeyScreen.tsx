import { useState, useEffect } from 'react';
import { Key, ExternalLink, Shield, Globe } from 'lucide-react';
import { useI18n } from '../i18n/context';

interface ApiKeyScreenProps {
  onSubmit: (key: string) => void;
  initialKey?: string;
}

export function ApiKeyScreen({ onSubmit, initialKey }: ApiKeyScreenProps) {
  const { t, lang, setLang } = useI18n();
  const [key, setKey] = useState(initialKey || '');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPulse, setShowPulse] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowPulse(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = () => {
    const trimmed = key.trim();
    if (!trimmed || trimmed.length < 10) {
      setError(t.apiKeyInvalid);
      return;
    }
    setError('');
    setIsSubmitting(true);
    setTimeout(() => onSubmit(trimmed), 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className={`fixed inset-0 flex flex-col items-center justify-center bg-dark-900 z-50 px-4 transition-opacity duration-500 ${isSubmitting ? 'opacity-0' : 'opacity-100'}`}>
      {/* Background effects */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(circle at 50% 30%, rgba(177,78,255,0.08) 0%, transparent 50%), radial-gradient(circle at 30% 70%, rgba(255,45,120,0.05) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(0,212,255,0.05) 0%, transparent 50%)',
      }} />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,212,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Language toggle - top right */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => setLang(lang === 'en' ? 'ko' : 'en')}
          className="glass rounded-full px-3 py-1.5 text-xs text-gray-300 hover:text-white transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95"
        >
          <Globe size={12} />
          <span>{lang === 'en' ? '한국어' : 'English'}</span>
        </button>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8 animate-slide-up">
          <div className="mb-4 relative inline-block">
            <div
              className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center transition-all duration-1000 ${showPulse ? 'scale-110' : 'scale-100'}`}
              style={{
                background: 'linear-gradient(135deg, rgba(255,45,120,0.2), rgba(177,78,255,0.2), rgba(0,212,255,0.2))',
                boxShadow: `0 0 ${showPulse ? 60 : 30}px rgba(177,78,255,${showPulse ? 0.3 : 0.15})`,
              }}
            >
              <Key size={32} className="text-neon-purple" />
            </div>
            {/* Rotating ring */}
            <div
              className="absolute inset-[-6px] rounded-full border-2 border-transparent animate-spin-slow"
              style={{
                borderTopColor: '#b14eff',
                borderRightColor: '#b14eff30',
              }}
            />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-black tracking-wider text-gradient mb-2">
            {t.appTitle}
          </h1>
          <p className="text-gray-400 text-sm md:text-base font-body">
            {t.apiKeySubtitle}
          </p>
        </div>

        {/* Input card */}
        <div className="glass rounded-3xl p-6 mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="mb-4">
            <label className="text-xs text-gray-400 font-body mb-2 block flex items-center gap-1.5">
              <Key size={12} className="text-neon-blue" />
              Gemini API Key
            </label>
            <input
              type="password"
              placeholder={t.apiKeyPlaceholder}
              value={key}
              onChange={e => { setKey(e.target.value); setError(''); }}
              onKeyDown={handleKeyDown}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-neon-purple/50 focus:ring-1 focus:ring-neon-purple/20 transition-all font-mono"
              autoFocus
            />
            {error && (
              <p className="text-red-400 text-xs mt-2 animate-fade-in">{error}</p>
            )}
          </div>

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl font-display text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: 'linear-gradient(135deg, #ff2d78, #b14eff, #00d4ff)',
              boxShadow: '0 0 30px rgba(177,78,255,0.3)',
            }}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {lang === 'ko' ? '연결 중...' : 'Connecting...'}
              </span>
            ) : (
              t.apiKeyButton
            )}
          </button>
        </div>

        {/* Info */}
        <div className="space-y-3 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="glass rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <ExternalLink size={16} className="text-neon-blue shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {lang === 'ko' ? (
                    <>
                      <a
                        href="https://aistudio.google.com/apikey"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neon-blue underline hover:text-neon-blue/80 transition-colors font-semibold"
                      >
                        {t.apiKeyGetKeyLink}
                      </a>
                      {t.apiKeyGetKey}
                    </>
                  ) : (
                    <>
                      {t.apiKeyGetKey}{' '}
                      <a
                        href="https://aistudio.google.com/apikey"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neon-blue underline hover:text-neon-blue/80 transition-colors font-semibold"
                      >
                        {t.apiKeyGetKeyLink}
                      </a>
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <Shield size={16} className="text-neon-green shrink-0 mt-0.5" />
              <p className="text-xs text-gray-400 leading-relaxed">
                {t.apiKeyNote}
              </p>
            </div>
          </div>
        </div>

        {/* Feature highlights */}
        <div className="mt-8 flex justify-center gap-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          {[
            { emoji: '🎭', label: lang === 'ko' ? '120+ 페르소나' : '120+ Personas' },
            { emoji: '⚡', label: lang === 'ko' ? '초저지연' : 'Ultra-low latency' },
            { emoji: '🎙️', label: lang === 'ko' ? '실시간 음성' : 'Real-time voice' },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <span className="text-xl">{item.emoji}</span>
              <p className="text-[10px] text-gray-500 mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
