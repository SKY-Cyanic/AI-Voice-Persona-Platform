import { useState, useEffect } from 'react';
import { Phone, Sparkles, Users, Clock, Zap, ChevronDown, Globe, Settings, Crown } from 'lucide-react';
import { PersonaCategory } from '../types';
import { categoryInfo } from '../data/personas';
import { useI18n } from '../i18n/context';
import { AdBanner } from './AdBanner';

interface HomeScreenProps {
  onStartCall: (category?: PersonaCategory) => void;
  onExplore: () => void;
  onPremium: () => void;
  onProfile: () => void;
  totalCalls: number;
  onChangeApiKey: () => void;
}

export function HomeScreen({ onStartCall, onExplore, onPremium, onProfile, totalCalls, onChangeApiKey }: HomeScreenProps) {
  const { t, lang, setLang } = useI18n();
  const [onlineCount, setOnlineCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCategories, setShowCategories] = useState(false);
  const [pulseScale, setPulseScale] = useState(1);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    setOnlineCount(Math.floor(Math.random() * 50000) + 23000);
    const interval = setInterval(() => {
      setOnlineCount(prev => prev + Math.floor(Math.random() * 20) - 8);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseScale(1.05);
      setTimeout(() => setPulseScale(1), 200);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const categories = Object.entries(categoryInfo);

  const getCategoryName = (key: string) => {
    return t.categories[key]?.name || categoryInfo[key]?.name || key;
  };

  const getCategoryDesc = (key: string) => {
    return t.categories[key]?.description || categoryInfo[key]?.description || '';
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen px-4 py-8">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 z-10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
          <span className="text-xs text-gray-400 font-body">
            <span className="text-neon-green font-semibold">{onlineCount.toLocaleString()}</span> {t.talkingNow}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Language toggle */}
          <button
            onClick={() => setLang(lang === 'en' ? 'ko' : 'en')}
            className="glass rounded-full px-2.5 py-1.5 text-xs text-gray-300 hover:text-white transition-colors flex items-center gap-1"
          >
            <Globe size={12} />
            <span>{lang === 'en' ? '한국어' : 'EN'}</span>
          </button>
          <button
            onClick={onExplore}
            className="glass rounded-full px-3 py-1.5 text-xs text-gray-300 hover:text-white transition-colors flex items-center gap-1"
          >
            <Sparkles size={12} />
            {t.explore}
          </button>
          {/* Premium button */}
          <button
            onClick={onPremium}
            className="glass rounded-full px-3 py-1.5 text-xs font-bold transition-all flex items-center gap-1 shadow-[0_0_15px_rgba(255,45,120,0.4)] hover:shadow-[0_0_20px_rgba(255,45,120,0.6)] hover:scale-105"
            style={{
              background: 'linear-gradient(45deg, rgba(255,45,120,0.2), rgba(177,78,255,0.2))',
              border: '1px solid rgba(255,45,120,0.5)',
              color: '#fff'
            }}
          >
            <Crown size={12} className="text-neon-yellow" />
            Premium
          </button>
          <button
            onClick={onProfile}
            className="glass rounded-full px-3 py-1.5 text-xs text-gray-300 hover:text-white transition-colors flex items-center gap-1"
          >
            <Users size={12} />
            {t.profile}
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="glass rounded-full p-1.5 text-gray-300 hover:text-white transition-colors"
          >
            <Settings size={14} />
          </button>
        </div>
      </div>

      {/* Settings dropdown */}
      {showSettings && (
        <div className="absolute top-14 right-4 z-20 glass rounded-2xl p-3 min-w-[200px] animate-fade-in">
          <button
            onClick={() => { onChangeApiKey(); setShowSettings(false); }}
            className="w-full text-left px-3 py-2 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all"
          >
            🔑 {t.apiKeyChangeKey}
          </button>
          <div className="border-t border-white/5 my-1" />
          <button
            onClick={() => { setLang(lang === 'en' ? 'ko' : 'en'); setShowSettings(false); }}
            className="w-full text-left px-3 py-2 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all"
          >
            🌐 {t.languageLabel}: {lang === 'en' ? '한국어로 변경' : 'Switch to English'}
          </button>
        </div>
      )}

      {/* Logo */}
      <div className="mb-6 animate-slide-up">
        <h1 className="font-display text-4xl md:text-6xl font-black tracking-wider text-gradient mb-2 text-center">
          {t.appTitle}
        </h1>
        <p className="text-gray-400 text-sm md:text-base text-center font-body">
          {t.appSubtitle}
        </p>
      </div>

      {/* Stats */}
      <div className="flex gap-6 mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Phone size={12} className="text-neon-pink" />
          <span>{(totalCalls || 0).toLocaleString()} {t.callsMade}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Clock size={12} className="text-neon-blue" />
          <span>{t.avgTime}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Zap size={12} className="text-neon-yellow" />
          <span>{t.connectTime}</span>
        </div>
      </div>

      {/* Category selector */}
      <div className="mb-8 w-full max-w-sm animate-slide-up" style={{ animationDelay: '0.15s' }}>
        <button
          onClick={() => setShowCategories(!showCategories)}
          className="w-full glass rounded-2xl px-4 py-3 flex items-center justify-between text-sm text-gray-300 hover:text-white transition-all"
        >
          <span className="flex items-center gap-2">
            {selectedCategory === 'all' ? (
              <>🎲 {t.randomAll}</>
            ) : (
              <>{categoryInfo[selectedCategory]?.emoji} {getCategoryName(selectedCategory)}</>
            )}
          </span>
          <ChevronDown size={16} className={`transition-transform ${showCategories ? 'rotate-180' : ''}`} />
        </button>

        {showCategories && (
          <div className="mt-2 glass rounded-2xl p-3 max-h-64 overflow-y-auto scrollbar-hide animate-fade-in">
            <button
              onClick={() => { setSelectedCategory('all'); setShowCategories(false); }}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all ${selectedCategory === 'all' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
              🎲 {t.randomAll}
            </button>
            {categories.map(([key, info]) => (
              <button
                key={key}
                onClick={() => { setSelectedCategory(key); setShowCategories(false); }}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all ${selectedCategory === key ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                {info.emoji} {getCategoryName(key)}
                <span className="text-xs text-gray-600 ml-2">{getCategoryDesc(key)}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Call Button */}
      <div className="relative mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="absolute inset-0 rounded-full animate-pulse-neon" style={{ transform: 'scale(1.3)' }} />
        <div className="absolute inset-0 rounded-full" style={{
          background: 'radial-gradient(circle, rgba(255,45,120,0.15) 0%, transparent 70%)',
          transform: 'scale(2)',
          animation: 'ripple 3s ease-out infinite',
        }} />
        <div className="absolute inset-0 rounded-full" style={{
          background: 'radial-gradient(circle, rgba(177,78,255,0.1) 0%, transparent 70%)',
          transform: 'scale(2)',
          animation: 'ripple 3s ease-out infinite 1s',
        }} />

        <button
          onClick={() => onStartCall(selectedCategory === 'all' ? undefined : selectedCategory as PersonaCategory)}
          className="relative w-40 h-40 md:w-48 md:h-48 rounded-full font-display font-bold text-white text-lg md:text-xl
            transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer z-10"
          style={{
            background: 'linear-gradient(135deg, #ff2d78, #b14eff, #00d4ff)',
            boxShadow: '0 0 40px rgba(255,45,120,0.4), 0 0 80px rgba(177,78,255,0.2), inset 0 0 40px rgba(255,255,255,0.1)',
            transform: `scale(${pulseScale})`,
          }}
        >
          <div className="flex flex-col items-center gap-2">
            <Phone size={36} className="animate-heartbeat" />
            <span className="tracking-widest text-sm">{t.callNow}</span>
          </div>
        </button>
      </div>

      {/* Description */}
      <p className="text-gray-500 text-xs text-center max-w-xs animate-slide-up" style={{ animationDelay: '0.3s' }}>
        {t.pressToConnect}
        <br />
        {t.anonymous}
      </p>

      {/* Quick category pills */}
      <div className="flex flex-wrap gap-2 justify-center mt-8 max-w-lg animate-slide-up" style={{ animationDelay: '0.4s' }}>
        {categories.slice(0, 8).map(([key, info]) => (
          <button
            key={key}
            onClick={() => onStartCall(key as PersonaCategory)}
            className="glass rounded-full px-3 py-1.5 text-xs text-gray-400 hover:text-white transition-all hover:scale-105 active:scale-95 flex items-center gap-1"
            style={{
              borderColor: `${info.color}30`,
              boxShadow: `0 0 10px ${info.color}10`,
            }}
          >
            <span>{info.emoji}</span>
            <span>{getCategoryName(key)}</span>
          </button>
        ))}
      </div>

      <div className="mt-auto w-full max-w-lg mb-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
        <AdBanner dataAdSlot="home-bottom-ad" />
      </div>
    </div>
  );
}
