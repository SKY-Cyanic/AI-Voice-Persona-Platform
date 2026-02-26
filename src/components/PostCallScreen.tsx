import { useState } from 'react';
import { Phone, RefreshCw, Heart, Share2, Download, Star, ArrowLeft } from 'lucide-react';
import { Persona } from '../types';
import { getRarityColor } from '../data/personas';
import { useI18n } from '../i18n/context';
import { AdBanner } from './AdBanner';

interface PostCallScreenProps {
  personas: Persona[];
  duration: number;
  transcript: string[];
  onSaveMemory: (transcriptToSave: string[]) => void;
  onCallAgain: () => void;
  onNewCall: () => void;
  onGoHome: () => void;
}

export function PostCallScreen({ personas, duration, transcript, onSaveMemory, onCallAgain, onNewCall, onGoHome }: PostCallScreenProps) {
  const { t } = useI18n();
  const primaryPersona = personas[0] || {};
  const [rating, setRating] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [isShared, setIsShared] = useState(false);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}m ${sec}s`;
  };

  const getEmoji = () => {
    if (duration > 600) return '🔥';
    if (duration > 300) return '💫';
    if (duration > 120) return '✨';
    return '👋';
  };

  const getXP = () => Math.floor(duration / 10) + 5;

  const getCategoryName = () => {
    if (personas.length > 1) return 'Group Call';
    return t.categories[primaryPersona.category]?.name || primaryPersona.category;
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-dark-900 z-50 px-4">
      <div className="absolute inset-0" style={{
        background: `radial-gradient(circle at 50% 30%, ${primaryPersona.color}10 0%, transparent 50%)`,
      }} />

      <button
        onClick={onGoHome}
        className="absolute top-4 left-4 z-10 glass rounded-full p-2 text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft size={20} />
      </button>

      <div className="relative z-10 w-full max-w-sm">
        <div className="text-center mb-6 animate-slide-up">
          <span className="text-4xl">{getEmoji()}</span>
          <h2 className="font-display text-xl font-bold text-white mt-2">{t.callEnded}</h2>
          <p className="text-gray-400 text-sm">{formatTime(duration)} {t.withPerson} {personas.map(p => p.name).join(' & ')}</p>
        </div>

        <div className="glass rounded-3xl p-6 mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-4 mb-4">
            {personas.length === 1 ? (
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-3xl shrink-0 overflow-hidden"
                style={{
                  background: `radial-gradient(circle, ${primaryPersona.color}30, ${primaryPersona.color}10)`,
                  boxShadow: `0 0 20px ${primaryPersona.color}20`,
                }}
              >
                {primaryPersona.imageUrl ? <img src={primaryPersona.imageUrl} className="w-full h-full object-cover" alt={primaryPersona.name} /> : primaryPersona.avatar}
              </div>
            ) : (
              <div className="flex items-center shrink-0">
                {personas.map((p, idx) => (
                  <div
                    key={idx}
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl border-2 border-dark-900 overflow-hidden"
                    style={{
                      background: `radial-gradient(circle, ${p.color}30, ${p.color}10)`,
                      marginLeft: idx > 0 ? '-12px' : '0',
                      zIndex: 10 - idx
                    }}
                  >
                    {p.imageUrl ? <img src={p.imageUrl} className="w-full h-full object-cover" alt={p.name} /> : p.avatar}
                  </div>
                ))}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h3 className="font-display text-lg font-bold text-white truncate">{personas.map(p => p.name).join(' & ')}</h3>
              <p className="text-gray-400 text-xs truncate">
                {personas.length === 1 ? primaryPersona.description : 'Group Conversation'}
              </p>
              <div className="flex items-center flex-wrap gap-2 mt-1">
                {personas.length === 1 && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      color: getRarityColor(primaryPersona.rarity),
                      backgroundColor: `${getRarityColor(primaryPersona.rarity)}15`,
                      border: `1px solid ${getRarityColor(primaryPersona.rarity)}30`,
                    }}
                  >
                    {primaryPersona.rarity.toUpperCase()}
                  </span>
                )}
                <span className="text-xs text-gray-500">{getCategoryName()}</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-3 mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400">{t.xpEarned}</span>
              <span className="text-sm font-display text-neon-green">+{getXP()} XP</span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full gradient-shift"
                style={{
                  width: `${Math.min((getXP() / 50) * 100, 100)}%`,
                  background: 'linear-gradient(90deg, #39ff14, #00d4ff)',
                }}
              />
            </div>
          </div>

          <div className="text-center mb-4">
            <p className="text-xs text-gray-400 mb-2">{t.rateConversation}</p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map(i => (
                <button
                  key={i}
                  onClick={() => setRating(i)}
                  className="transition-all hover:scale-125"
                >
                  <Star
                    size={28}
                    className={i <= rating ? 'fill-neon-yellow text-neon-yellow' : 'text-gray-600'}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                if (!isSaved) {
                  setIsSaved(true);
                  onSaveMemory(transcript);
                }
              }}
              className={`flex-1 py-2 rounded-xl text-xs flex items-center justify-center gap-1 transition-all
                ${isSaved ? 'bg-neon-pink/20 text-neon-pink border border-neon-pink/30' : 'glass text-gray-400 hover:text-white'}`}
            >
              <Heart size={14} className={isSaved ? 'fill-neon-pink' : ''} />
              {isSaved ? t.saved : t.save}
            </button>
            <button
              onClick={() => setIsShared(true)}
              className={`flex-1 py-2 rounded-xl text-xs flex items-center justify-center gap-1 transition-all
                ${isShared ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/30' : 'glass text-gray-400 hover:text-white'}`}
            >
              <Share2 size={14} />
              {isShared ? t.shared : t.share}
            </button>
            <button
              className="flex-1 py-2 rounded-xl text-xs flex items-center justify-center gap-1 glass text-gray-400 hover:text-white transition-all"
            >
              <Download size={14} />
              {t.exportLabel}
            </button>
          </div>
        </div>

        <div className="flex gap-3 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <button
            onClick={onCallAgain}
            className="flex-1 py-4 rounded-2xl font-display text-sm font-bold flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
            style={{
              background: `linear-gradient(135deg, ${primaryPersona.color}40, ${primaryPersona.color}20)`,
              border: `1px solid ${primaryPersona.color}40`,
              color: primaryPersona.color,
            }}
          >
            <Phone size={18} />
            {t.callAgain}
          </button>
          <button
            onClick={onNewCall}
            className="flex-1 py-4 rounded-2xl font-display text-sm font-bold flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #ff2d7840, #b14eff20)',
              border: '1px solid rgba(255,45,120,0.3)',
              color: '#ff2d78',
            }}
          >
            <RefreshCw size={18} />
            {t.newMatch}
          </button>
        </div>

        <div className="mt-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <AdBanner dataAdSlot="postcall-bottom-ad" />
        </div>
      </div>
    </div>
  );
}
