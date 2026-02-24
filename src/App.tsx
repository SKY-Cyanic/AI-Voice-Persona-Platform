import { useState, useCallback, useRef, useEffect } from 'react';
import { AppScreen, Persona, PersonaCategory, UserProfile } from './types';
import { getRandomPersona } from './data/personas';
import { useGeminiAudio } from './hooks/useGeminiAudio';
import { useI18n } from './i18n/context';
import { I18nProvider } from './i18n/context';
import { ParticleBackground } from './components/ParticleBackground';
import { ApiKeyScreen } from './components/ApiKeyScreen';
import { HomeScreen } from './components/HomeScreen';
import { ConnectingScreen } from './components/ConnectingScreen';
import { CallScreen } from './components/CallScreen';
import { PostCallScreen } from './components/PostCallScreen';
import { ExploreScreen } from './components/ExploreScreen';
import { ProfileScreen } from './components/ProfileScreen';

function loadProfile(): UserProfile {
  try {
    const saved = localStorage.getItem('livepersona_profile');
    if (saved) return JSON.parse(saved);
  } catch {}
  return {
    nickname: `User${Math.floor(Math.random() * 9999)}`,
    avatar: '🎭',
    level: 1,
    xp: 0,
    totalCalls: 0,
    totalMinutes: 0,
    favorites: [],
    unlockedPersonas: [],
    achievements: [],
  };
}

function saveProfile(profile: UserProfile) {
  try {
    localStorage.setItem('livepersona_profile', JSON.stringify(profile));
  } catch {}
}

function loadApiKey(): string {
  try {
    const saved = localStorage.getItem('livepersona_api_key');
    if (saved) return saved;
  } catch {}
  // Fallback to env variable
  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (envKey) return envKey;
  return '';
}

function saveApiKey(key: string) {
  try {
    localStorage.setItem('livepersona_api_key', key);
  } catch {}
}

function AppContent() {
  const { lang } = useI18n();
  const [screen, setScreen] = useState<AppScreen>('home');
  const [currentPersona, setCurrentPersona] = useState<Persona | null>(null);
  const [profile, setProfile] = useState<UserProfile>(loadProfile);
  const [callDuration, setCallDuration] = useState(0);
  const [apiKey, setApiKey] = useState<string>(loadApiKey);
  const [showApiKeyScreen, setShowApiKeyScreen] = useState(!loadApiKey());
  const callStartRef = useRef<number>(0);
  const durationIntervalRef = useRef<ReturnType<typeof setInterval>>(undefined);

  const gemini = useGeminiAudio(apiKey, lang);

  // Save profile on change
  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  // Track call duration
  useEffect(() => {
    if (screen === 'call' && gemini.isConnected) {
      callStartRef.current = Date.now();
      durationIntervalRef.current = setInterval(() => {
        setCallDuration(Math.floor((Date.now() - callStartRef.current) / 1000));
      }, 1000);
    }
    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    };
  }, [screen, gemini.isConnected]);

  const handleApiKeySubmit = useCallback((key: string) => {
    setApiKey(key);
    saveApiKey(key);
    setShowApiKeyScreen(false);
  }, []);

  const handleChangeApiKey = useCallback(() => {
    setShowApiKeyScreen(true);
  }, []);

  const startCall = useCallback((category?: PersonaCategory) => {
    const persona = getRandomPersona(category);
    setCurrentPersona(persona);
    setCallDuration(0);
    setScreen('connecting');
    gemini.connect(persona);
  }, [gemini]);

  const startCallWithPersona = useCallback((persona: Persona) => {
    setCurrentPersona(persona);
    setCallDuration(0);
    setScreen('connecting');
    gemini.connect(persona);
  }, [gemini]);

  const onConnected = useCallback(() => {
    setScreen('call');
  }, []);

  const endCall = useCallback(() => {
    gemini.disconnect();
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
    }
    const finalDuration = Math.floor((Date.now() - callStartRef.current) / 1000);
    setCallDuration(finalDuration);

    setProfile(prev => ({
      ...prev,
      totalCalls: prev.totalCalls + 1,
      totalMinutes: prev.totalMinutes + Math.floor(finalDuration / 60),
      xp: prev.xp + Math.floor(finalDuration / 10) + 5,
      level: Math.floor((prev.xp + Math.floor(finalDuration / 10) + 5) / 100) + 1,
    }));

    setScreen('postCall');
  }, [gemini]);

  const callAgain = useCallback(() => {
    if (currentPersona) {
      startCallWithPersona(currentPersona);
    }
  }, [currentPersona, startCallWithPersona]);

  const newCall = useCallback(() => {
    startCall();
  }, [startCall]);

  const goHome = useCallback(() => {
    gemini.disconnect();
    setScreen('home');
    setCurrentPersona(null);
  }, [gemini]);

  // Show API key screen if no key
  if (showApiKeyScreen) {
    return (
      <div className="min-h-screen bg-dark-900 text-white font-body relative overflow-hidden">
        <ParticleBackground />
        <ApiKeyScreen onSubmit={handleApiKeySubmit} initialKey={apiKey} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 text-white font-body relative overflow-hidden">
      <ParticleBackground />

      {/* Grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,212,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Vignette */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 40%, rgba(10,10,15,0.8) 100%)',
        }}
      />

      <div className="relative z-10">
        {screen === 'home' && (
          <HomeScreen
            onStartCall={startCall}
            onExplore={() => setScreen('explore')}
            onProfile={() => setScreen('profile')}
            totalCalls={profile.totalCalls}
            onChangeApiKey={handleChangeApiKey}
          />
        )}

        {screen === 'connecting' && currentPersona && (
          <ConnectingScreen
            persona={currentPersona}
            onConnected={onConnected}
          />
        )}

        {screen === 'call' && currentPersona && (
          <CallScreen
            persona={currentPersona}
            isConnected={gemini.isConnected}
            isSpeaking={gemini.isSpeaking}
            emotion={gemini.emotion}
            error={gemini.error}
            onEndCall={endCall}
            onToggleMute={gemini.toggleMute}
            transcript={gemini.transcript}
          />
        )}

        {screen === 'postCall' && currentPersona && (
          <PostCallScreen
            persona={currentPersona}
            duration={callDuration}
            onCallAgain={callAgain}
            onNewCall={newCall}
            onGoHome={goHome}
          />
        )}

        {screen === 'explore' && (
          <ExploreScreen
            onBack={goHome}
            onSelectPersona={startCallWithPersona}
            userLevel={profile.level}
          />
        )}

        {screen === 'profile' && (
          <ProfileScreen
            profile={profile}
            onBack={goHome}
          />
        )}
      </div>
    </div>
  );
}

export function App() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
}
