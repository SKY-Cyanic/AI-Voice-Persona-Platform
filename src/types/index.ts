export interface Persona {
  id: string;
  name: string;
  category: PersonaCategory;
  avatar: string;
  description: string;
  tagline: string;
  voice: string;
  personality: string;
  systemPrompt: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  tags: string[];
  mood: string;
  color: string;
  emoji: string;
}

export type PersonaCategory =
  | 'healing'
  | 'romance'
  | 'comedy'
  | 'horror'
  | 'idol'
  | 'intellectual'
  | 'adventure'
  | 'mystic'
  | 'asmr'
  | 'motivation'
  | 'language'
  | 'scifi'
  | 'fantasy'
  | 'villain'
  | 'historical'
  | 'chaos';

export type AppScreen = 'home' | 'connecting' | 'call' | 'postCall' | 'explore' | 'profile' | 'studio' | 'settings';

export interface CallState {
  persona: Persona | null;
  duration: number;
  isActive: boolean;
  isMuted: boolean;
  emotion: EmotionState;
}

export type EmotionState = 'neutral' | 'happy' | 'sad' | 'excited' | 'angry' | 'romantic' | 'scared' | 'calm';

export interface UserProfile {
  nickname: string;
  avatar: string;
  level: number;
  xp: number;
  totalCalls: number;
  totalMinutes: number;
  favorites: string[];
  unlockedPersonas: string[];
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

export interface CallHistory {
  id: string;
  persona: Persona;
  duration: number;
  date: Date;
  emotion: EmotionState;
  saved: boolean;
}
