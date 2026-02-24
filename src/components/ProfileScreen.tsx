import { ArrowLeft, Phone, Clock, Zap, Trophy, Heart, Star } from 'lucide-react';
import { UserProfile } from '../types';
import { useI18n } from '../i18n/context';

interface ProfileScreenProps {
  profile: UserProfile;
  onBack: () => void;
}

export function ProfileScreen({ profile, onBack }: ProfileScreenProps) {
  const { t } = useI18n();
  const levelProgress = (profile.xp % 100) / 100;
  const nextLevel = Math.floor(profile.xp / 100) + 1;

  const achievements = [
    { id: 'first_call', name: t.achFirstContact, description: t.achFirstContactDesc, icon: '📞', unlocked: profile.totalCalls >= 1 },
    { id: 'ten_calls', name: t.achRegularCaller, description: t.achRegularCallerDesc, icon: '🔥', unlocked: profile.totalCalls >= 10 },
    { id: 'fifty_calls', name: t.achCallAddict, description: t.achCallAddictDesc, icon: '💎', unlocked: profile.totalCalls >= 50 },
    { id: 'hour_talk', name: t.achChatterbox, description: t.achChatterboxDesc, icon: '🗣️', unlocked: profile.totalMinutes >= 60 },
    { id: 'five_hours', name: t.achMarathonCaller, description: t.achMarathonCallerDesc, icon: '🏆', unlocked: profile.totalMinutes >= 300 },
    { id: 'night_owl', name: t.achNightOwl, description: t.achNightOwlDesc, icon: '🦉', unlocked: profile.totalCalls >= 3 },
    { id: 'collector', name: t.achCollector, description: t.achCollectorDesc, icon: '⭐', unlocked: profile.favorites.length >= 5 },
    { id: 'explorer', name: t.achExplorer, description: t.achExplorerDesc, icon: '🗺️', unlocked: profile.totalCalls >= 15 },
    { id: 'legendary', name: t.achLegend, description: t.achLegendDesc, icon: '👑', unlocked: profile.level >= 10 },
  ];

  return (
    <div className="min-h-screen bg-dark-900 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-20 glass px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="p-1.5 rounded-full hover:bg-white/5 transition-colors">
          <ArrowLeft size={20} className="text-gray-400" />
        </button>
        <h1 className="font-display text-lg font-bold text-white">{t.profileTitle}</h1>
      </div>

      <div className="px-4 py-6 max-w-lg mx-auto">
        {/* Profile card */}
        <div className="glass rounded-3xl p-6 mb-6 text-center animate-slide-up">
          <div className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center text-4xl"
            style={{
              background: 'linear-gradient(135deg, #ff2d7830, #b14eff30, #00d4ff30)',
              boxShadow: '0 0 30px rgba(177,78,255,0.2)',
            }}
          >
            {profile.avatar}
          </div>
          <h2 className="font-display text-xl font-bold text-white">{profile.nickname}</h2>
          <p className="text-gray-400 text-sm mt-1">{t.levelCaller.replace('{level}', String(profile.level))}</p>

          {/* Level progress */}
          <div className="mt-4 px-4">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-500">Lv.{profile.level}</span>
              <span className="text-neon-green">{profile.xp % 100}/100 XP</span>
              <span className="text-gray-500">Lv.{nextLevel}</span>
            </div>
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${levelProgress * 100}%`,
                  background: 'linear-gradient(90deg, #ff2d78, #b14eff, #00d4ff)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="glass rounded-2xl p-4 text-center">
            <Phone size={20} className="text-neon-pink mx-auto mb-2" />
            <div className="font-display text-2xl font-bold text-white">{profile.totalCalls}</div>
            <div className="text-xs text-gray-500">{t.totalCalls}</div>
          </div>
          <div className="glass rounded-2xl p-4 text-center">
            <Clock size={20} className="text-neon-blue mx-auto mb-2" />
            <div className="font-display text-2xl font-bold text-white">{profile.totalMinutes}</div>
            <div className="text-xs text-gray-500">{t.minutesTalked}</div>
          </div>
          <div className="glass rounded-2xl p-4 text-center">
            <Heart size={20} className="text-neon-pink mx-auto mb-2" />
            <div className="font-display text-2xl font-bold text-white">{profile.favorites.length}</div>
            <div className="text-xs text-gray-500">{t.favorites}</div>
          </div>
          <div className="glass rounded-2xl p-4 text-center">
            <Zap size={20} className="text-neon-yellow mx-auto mb-2" />
            <div className="font-display text-2xl font-bold text-white">{profile.xp}</div>
            <div className="text-xs text-gray-500">{t.totalXP}</div>
          </div>
        </div>

        {/* Achievements */}
        <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-2 mb-3">
            <Trophy size={18} className="text-neon-yellow" />
            <h3 className="font-display text-sm font-bold text-white">{t.achievementsTitle}</h3>
            <span className="text-xs text-gray-500 ml-auto">
              {achievements.filter(a => a.unlocked).length}/{achievements.length}
            </span>
          </div>
          <div className="space-y-2">
            {achievements.map(a => (
              <div
                key={a.id}
                className={`glass rounded-xl p-3 flex items-center gap-3 transition-all ${
                  a.unlocked ? '' : 'opacity-40'
                }`}
              >
                <span className="text-2xl">{a.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">{a.name}</span>
                    {a.unlocked && <Star size={12} className="text-neon-yellow fill-neon-yellow" />}
                  </div>
                  <span className="text-xs text-gray-400">{a.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
