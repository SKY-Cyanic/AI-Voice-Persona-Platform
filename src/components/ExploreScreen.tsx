import { useState } from 'react';
import { ArrowLeft, Search, Phone, Lock, Star } from 'lucide-react';
import { Persona } from '../types';
import { personas, categoryInfo, getRarityColor } from '../data/personas';
import { useI18n } from '../i18n/context';

interface ExploreScreenProps {
  onBack: () => void;
  onSelectPersona: (persona: Persona) => void;
  userLevel: number;
}

export function ExploreScreen({ onBack, onSelectPersona, userLevel }: ExploreScreenProps) {
  const { t } = useI18n();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');

  const categories = Object.entries(categoryInfo);

  const getCategoryName = (key: string) => {
    return t.categories[key]?.name || categoryInfo[key]?.name || key;
  };

  const filtered = personas.filter(p => {
    const catName = getCategoryName(p.category).toLowerCase();
    const matchesSearch = !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase())) ||
      catName.includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesRarity = selectedRarity === 'all' || p.rarity === selectedRarity;
    return matchesSearch && matchesCategory && matchesRarity;
  });

  const isLocked = (p: Persona) => {
    if (p.rarity === 'legendary' && userLevel < 10) return true;
    if (p.rarity === 'epic' && userLevel < 5) return true;
    return false;
  };

  const getLevelReq = (p: Persona) => {
    const level = p.rarity === 'legendary' ? 10 : 5;
    return t.levelRequired.replace('{level}', String(level));
  };

  return (
    <div className="min-h-screen bg-dark-900 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-20 glass px-4 py-3">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={onBack} className="p-1.5 rounded-full hover:bg-white/5 transition-colors">
            <ArrowLeft size={20} className="text-gray-400" />
          </button>
          <h1 className="font-display text-lg font-bold text-white">{t.exploreTitle}</h1>
          <span className="text-xs text-gray-500 ml-auto">{personas.length} {t.personasLabel}</span>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-neon-blue/50 transition-colors"
          />
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs transition-all ${
              selectedCategory === 'all'
                ? 'bg-white/10 text-white border border-white/20'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {t.all}
          </button>
          {categories.map(([key, info]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs transition-all flex items-center gap-1 ${
                selectedCategory === key
                  ? 'text-white border'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
              style={selectedCategory === key ? {
                backgroundColor: `${info.color}15`,
                borderColor: `${info.color}40`,
                color: info.color,
              } : {}}
            >
              <span>{info.emoji}</span>
              <span>{getCategoryName(key)}</span>
            </button>
          ))}
        </div>

        {/* Rarity filter */}
        <div className="flex gap-2 mt-2">
          {['all', 'common', 'rare', 'epic', 'legendary'].map(r => (
            <button
              key={r}
              onClick={() => setSelectedRarity(r)}
              className={`px-2.5 py-1 rounded-full text-xs transition-all ${
                selectedRarity === r
                  ? 'text-white'
                  : 'text-gray-600 hover:text-gray-400'
              }`}
              style={selectedRarity === r && r !== 'all' ? {
                backgroundColor: `${getRarityColor(r)}20`,
                color: getRarityColor(r),
                border: `1px solid ${getRarityColor(r)}30`,
              } : selectedRarity === r ? {
                backgroundColor: 'rgba(255,255,255,0.1)',
              } : {}}
            >
              {r === 'all' ? t.all : r.charAt(0).toUpperCase() + r.slice(1)}
              {r === 'legendary' && ' ✨'}
              {r === 'epic' && ' 💎'}
            </button>
          ))}
        </div>
      </div>

      {/* Persona grid */}
      <div className="px-4 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((persona) => {
          const locked = isLocked(persona);
          return (
            <button
              key={persona.id}
              onClick={() => !locked && onSelectPersona(persona)}
              disabled={locked}
              className={`relative glass rounded-2xl p-4 text-left transition-all group ${
                locked ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98] cursor-pointer'
              }`}
              style={{
                borderColor: `${persona.color}15`,
              }}
            >
              {locked && (
                <div className="absolute inset-0 rounded-2xl flex items-center justify-center bg-black/40 z-10">
                  <div className="text-center">
                    <Lock size={20} className="text-gray-400 mx-auto mb-1" />
                    <span className="text-xs text-gray-400">
                      {getLevelReq(persona)}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shrink-0"
                  style={{
                    background: `radial-gradient(circle, ${persona.color}25, ${persona.color}08)`,
                  }}
                >
                  {persona.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-display text-sm font-bold text-white truncate">{persona.name}</h3>
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded-full shrink-0"
                      style={{
                        color: getRarityColor(persona.rarity),
                        backgroundColor: `${getRarityColor(persona.rarity)}15`,
                      }}
                    >
                      {persona.rarity === 'legendary' ? '★' : persona.rarity === 'epic' ? '◆' : persona.rarity === 'rare' ? '●' : '○'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-2">{persona.description}</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="text-[10px] text-gray-500 px-1.5 py-0.5 rounded-full bg-white/5">
                      {categoryInfo[persona.category]?.emoji} {getCategoryName(persona.category)}
                    </span>
                    {persona.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="text-[10px] text-gray-600 px-1.5 py-0.5 rounded-full bg-white/5">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {!locked && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${persona.color}60, ${persona.color}30)`,
                    }}
                  >
                    <Phone size={16} className="text-white" />
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <Star size={40} className="text-gray-700 mb-3" />
          <p className="text-gray-500 text-sm">{t.noPersonasFound}</p>
          <p className="text-gray-600 text-xs">{t.tryDifferent}</p>
        </div>
      )}
    </div>
  );
}
