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
import { PremiumScreen } from './components/PremiumScreen';
import { StudioScreen } from './components/StudioScreen';

function loadProfile(): UserProfile {
  try {
    const saved = localStorage.getItem('livepersona_profile');
    if (saved) return JSON.parse(saved);
  } catch { }
  return {
    nickname: `User${Math.floor(Math.random() * 9999)}`,
    avatar: '🎭',
    level: 1,
    xp: 0,
    totalCalls: 0,
    totalMinutes: 0,
    favorites: [],
    unlockedPersonas: [],
    customPersonas: [],
    achievements: [],
    savedCalls: [],
  };
}

function saveProfile(profile: UserProfile) {
  try {
    localStorage.setItem('livepersona_profile', JSON.stringify(profile));
  } catch { }
}

function loadApiKey(): string {
  try {
    const saved = localStorage.getItem('livepersona_api_key');
    if (saved) return saved;
  } catch { }
  // Fallback to env variable
  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (envKey) return envKey;
  return '';
}

function saveApiKey(key: string) {
  try {
    localStorage.setItem('livepersona_api_key', key);
  } catch { }
}

function AppContent() {
  const { lang } = useI18n();
  const [screen, setScreen] = useState<AppScreen>('home');
  const [currentPersonas, setCurrentPersonas] = useState<Persona[] | null>(null);
  const [profile, setProfile] = useState<UserProfile>(loadProfile);
  const [callDuration, setCallDuration] = useState(0);
  const [apiKey, setApiKey] = useState<string>(loadApiKey);
  const [showApiKeyScreen, setShowApiKeyScreen] = useState(!loadApiKey());
  const [lastTranscript, setLastTranscript] = useState<string[]>([]);
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
    if (!apiKey) {
      setShowApiKeyScreen(true);
      return;
    }
    const persona = getRandomPersona(category);
    setCurrentPersonas([persona]);
    setCallDuration(0);
    setLastTranscript([]);
    setScreen('connecting');
    gemini.connect(persona);
  }, [gemini, apiKey]);

  const startGroupCall = useCallback(() => {
    if (!apiKey) {
      setShowApiKeyScreen(true);
      return;
    }
    const p1 = getRandomPersona('chaos'); // mix it up
    let p2 = getRandomPersona('romance');
    while (p1.id === p2.id) {
      p2 = getRandomPersona();
    }
    const group = [p1, p2];
    setCurrentPersonas(group);
    setCallDuration(0);
    setLastTranscript([]);
    setScreen('connecting');
    gemini.connect(group);
  }, [gemini, apiKey]);

  const startCallWithPersona = useCallback((persona: Persona) => {
    if (!apiKey) {
      setShowApiKeyScreen(true);
      return;
    }
    setCurrentPersonas([persona]);
    setCallDuration(0);
    setLastTranscript([]);
    setScreen('connecting');
    gemini.connect(persona);
  }, [gemini, apiKey]);

  const onConnected = useCallback(() => {
    setScreen('call');
  }, []);

  const endCall = useCallback(() => {
    setLastTranscript(gemini.transcript);
    gemini.disconnect();
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
    }

    let finalDuration = 0;
    if (callStartRef.current > 0) {
      finalDuration = Math.floor((Date.now() - callStartRef.current) / 1000);
    }

    setCallDuration(finalDuration);

    setProfile(prev => ({
      ...prev,
      totalCalls: prev.totalCalls + 1,
      totalMinutes: prev.totalMinutes + Math.floor(finalDuration / 60),
      xp: prev.xp + Math.floor(finalDuration / 10) + 5,
      level: Math.floor((prev.xp + Math.floor(finalDuration / 10) + 5) / 100) + 1,
    }));

    callStartRef.current = 0;
    setScreen('postCall');
  }, [gemini]);

  const handleSaveMemory = useCallback((transcriptToSave: string[]) => {
    if (!currentPersonas) return;
    const memory = {
      id: `mem_${Date.now()}`,
      persona: currentPersonas[0],
      duration: callDuration,
      date: new Date(),
      emotion: 'neutral' as const,
      saved: true,
      transcript: transcriptToSave,
    };
    setProfile(prev => ({
      ...prev,
      savedCalls: [memory, ...(prev.savedCalls || [])]
    }));
  }, [currentPersonas, callDuration]);

  const callAgain = useCallback(() => {
    if (currentPersonas) {
      if (currentPersonas.length > 1) {
        startGroupCall();
      } else {
        startCallWithPersona(currentPersonas[0]);
      }
    }
  }, [currentPersonas, startCallWithPersona, startGroupCall]);

  const newCall = useCallback(() => {
    startCall();
  }, [startCall]);

  const goHome = useCallback(() => {
    gemini.disconnect();
    setScreen('home');
    setCurrentPersonas(null);
  }, [gemini]);

  const handleSavePersona = useCallback((newPersona: Persona) => {
    setProfile(prev => ({
      ...prev,
      customPersonas: [newPersona, ...(prev.customPersonas || [])]
    }));
    setScreen('home');
  }, []);

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
        {showApiKeyScreen ? (
          <ApiKeyScreen onSubmit={handleApiKeySubmit} initialKey={apiKey} />
        ) : screen === 'home' && (
          <HomeScreen
            onStartCall={startCall}
            onGroupCall={startGroupCall}
            onExplore={() => setScreen('explore')}
            onPremium={() => setScreen('premium')}
            onProfile={() => setScreen('profile')}
            onStudio={() => setScreen('studio')}
            totalCalls={profile.totalCalls}
            onChangeApiKey={handleChangeApiKey}
          />
        )}

        {screen === 'connecting' && currentPersonas && (
          <ConnectingScreen
            persona={currentPersonas[0]}
            onConnected={onConnected}
          />
        )}

        {screen === 'call' && currentPersonas && (
          <CallScreen
            personas={currentPersonas}
            isConnected={gemini.isConnected}
            isSpeaking={gemini.isSpeaking}
            emotion={gemini.emotion}
            error={gemini.error}
            onEndCall={endCall}
            onToggleMute={gemini.toggleMute}
            transcript={gemini.transcript}
          />
        )}

        {screen === 'postCall' && currentPersonas && (
          <PostCallScreen
            personas={currentPersonas}
            duration={callDuration}
            transcript={lastTranscript}
            onSaveMemory={handleSaveMemory}
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
            customPersonas={profile.customPersonas || []}
          />
        )}

        {screen === 'profile' && (
          <ProfileScreen
            profile={profile}
            onBack={goHome}
          />
        )}

        {screen === 'premium' && (
          <PremiumScreen
            onBack={goHome}
            currentTier={profile.subscriptionTier || 'free'}
          />
        )}

        {screen === 'studio' && (
          <StudioScreen
            onBack={goHome}
            onSave={handleSavePersona}
            isPro={profile.subscriptionTier === 'pro'}
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
