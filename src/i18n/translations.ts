export type Language = 'en' | 'ko';

export interface CategoryTranslation {
  name: string;
  description: string;
}

export interface Translations {
  // App
  appTitle: string;
  appSubtitle: string;

  // API Key Screen
  apiKeyTitle: string;
  apiKeySubtitle: string;
  apiKeyPlaceholder: string;
  apiKeyButton: string;
  apiKeyGetKey: string;
  apiKeyGetKeyLink: string;
  apiKeyNote: string;
  apiKeyInvalid: string;
  apiKeyChangeKey: string;

  // Home
  talkingNow: string;
  explore: string;
  profile: string;
  callsMade: string;
  avgTime: string;
  connectTime: string;
  randomAll: string;
  callNow: string;
  pressToConnect: string;
  anonymous: string;

  // Connecting
  findingMatch: string;
  connectingPersona: string;
  pickingUp: string;
  connectedExclaim: string;

  // Call
  connectedLabel: string;
  connectingLabel: string;

  // Post Call
  callEnded: string;
  withPerson: string;
  xpEarned: string;
  rateConversation: string;
  save: string;
  saved: string;
  share: string;
  shared: string;
  exportLabel: string;
  callAgain: string;
  newMatch: string;

  // Explore
  exploreTitle: string;
  personasLabel: string;
  searchPlaceholder: string;
  all: string;
  noPersonasFound: string;
  tryDifferent: string;
  levelRequired: string;

  // Profile
  profileTitle: string;
  levelCaller: string;
  tabOverview: string;
  tabMemory: string;
  noSavedCalls: string;
  transcriptLabel: string;

  totalCalls: string;
  minutesTalked: string;
  favorites: string;
  totalXP: string;
  achievementsTitle: string;

  // Achievements
  achFirstContact: string;
  achFirstContactDesc: string;
  achRegularCaller: string;
  achRegularCallerDesc: string;
  achCallAddict: string;
  achCallAddictDesc: string;
  achChatterbox: string;
  achChatterboxDesc: string;
  achMarathonCaller: string;
  achMarathonCallerDesc: string;
  achNightOwl: string;
  achNightOwlDesc: string;
  achCollector: string;
  achCollectorDesc: string;
  achExplorer: string;
  achExplorerDesc: string;
  achLegend: string;
  achLegendDesc: string;

  // Categories
  categories: Record<string, CategoryTranslation>;

  // Language
  languageLabel: string;

  // Premium
  upgradeTitle: string;
  upgradeSubtitle: string;
  freePlan: string;
  plusPlan: string;
  proPlan: string;
  currentPlan: string;
  selectPlan: string;
  featStandardInteractions: string;
  featLimitedMinutes: string;
  featStandardQuality: string;
  featUnlimitedMinutes: string;
  featPriorityQueue: string;
  featHQVoices: string;
  featExcitingContent: string;
  featNanoBananaPro: string;
  featEarlyAccess: string;

  // Studio (Custom Personas)
  studioTitle: string;
  createPersona: string;
  personaName: string;
  personaDesc: string;

  studioPersonality: string;
  studioPersonalityHint: string;
  studioBackground: string;
  studioBackgroundHint: string;
  studioStyle: string;
  studioStyleHint: string;
  studioOpening: string;
  studioOpeningHint: string;

  generateAvatar: string;
  generateNanoBanana: string;
  nanoBananaPrompt: string;
  proRequired: string;
  createButton: string;

  // Prompt language instructions
  promptLangInstruction: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appTitle: 'LIVEPERSONA',
    appSubtitle: 'Random AI Voice Calls • Instant Connection • Infinite Personas',

    // Studio
    studioTitle: 'Creator Studio',
    createPersona: 'Create Persona',
    personaName: 'Persona Name',
    personaDesc: 'Short Description',

    // Granular Prompt Fields
    studioPersonality: 'Core Personality',
    studioPersonalityHint: 'e.g. Tsundere, Yandere, Caring older sister, Stern mentor...',
    studioBackground: 'Background Story',
    studioBackgroundHint: 'e.g. We grew up together but drifted apart. Or: A knight from a fallen kingdom.',
    studioStyle: 'Speaking Style',
    studioStyleHint: 'e.g. Uses a lot of slang, Speaks formally, Stutters when nervous.',
    studioOpening: 'Opening Line',
    studioOpeningHint: 'The exact first words they will say when the call connects.',

    generateAvatar: 'Generate Avatar',
    generateNanoBanana: '✨ NanoBanana Pro Generation',
    nanoBananaPrompt: 'Describe the image you want (Pro tier required)...',
    proRequired: 'Requires Pro Subscription',
    createButton: 'Create & Save',

    apiKeyTitle: 'Welcome to LivePersona',
    apiKeySubtitle: 'Enter your Gemini API key to start making calls',
    apiKeyPlaceholder: 'Paste your Gemini API key here...',
    apiKeyButton: '🚀 Start Calling',
    apiKeyGetKey: 'Get your free API key from',
    apiKeyGetKeyLink: 'Google AI Studio',
    apiKeyNote: 'Your key is stored locally in your browser and never shared with anyone.',
    apiKeyInvalid: 'Please enter a valid API key (at least 10 characters)',
    apiKeyChangeKey: 'Change API Key',

    talkingNow: 'talking now',
    explore: 'Explore',
    profile: 'Profile',
    callsMade: 'calls made',
    avgTime: 'Avg 8.4 min',
    connectTime: '0.3s connect',
    randomAll: 'Random (All Categories)',
    callNow: 'CALL NOW',
    pressToConnect: 'Press to instantly connect with a random AI persona.',
    anonymous: '100% anonymous • Real-time voice • Emotional AI',

    findingMatch: 'Finding your match...',
    connectingPersona: 'Connecting to persona...',
    pickingUp: 'is picking up...',
    connectedExclaim: 'Connected!',

    connectedLabel: 'Connected',
    connectingLabel: 'Connecting...',

    callEnded: 'Call Ended',
    withPerson: 'with',
    xpEarned: 'XP Earned',
    rateConversation: 'Rate this conversation',
    save: 'Save',
    saved: 'Saved!',
    share: 'Share',
    shared: 'Copied!',
    exportLabel: 'Export',
    callAgain: 'Call Again',
    newMatch: 'New Match',

    exploreTitle: 'Explore Personas',
    personasLabel: 'personas',
    searchPlaceholder: 'Search personas, tags, categories...',
    all: 'All',
    noPersonasFound: 'No personas found',
    tryDifferent: 'Try a different search or category',
    levelRequired: 'Level {level} required',
    // Profile Screen
    profileTitle: 'Commander Profile',
    levelCaller: 'Level {level} Operator',

    tabOverview: 'Overview',
    tabMemory: 'Memory Bank',
    noSavedCalls: 'No saved memories yet. Record your calls to save them here!',
    transcriptLabel: 'Call Transcript',

    totalCalls: 'Total Calls',
    minutesTalked: 'Minutes Talked',
    favorites: 'Favorites',
    totalXP: 'Total XP',
    achievementsTitle: 'Achievements',

    achFirstContact: 'First Contact',
    achFirstContactDesc: 'Make your first call',
    achRegularCaller: 'Regular Caller',
    achRegularCallerDesc: 'Make 10 calls',
    achCallAddict: 'Call Addict',
    achCallAddictDesc: 'Make 50 calls',
    achChatterbox: 'Chatterbox',
    achChatterboxDesc: 'Talk for 60 minutes total',
    achMarathonCaller: 'Marathon Caller',
    achMarathonCallerDesc: 'Talk for 5 hours total',
    achNightOwl: 'Night Owl',
    achNightOwlDesc: 'Make a call after midnight',
    achCollector: 'Collector',
    achCollectorDesc: 'Save 5 favorite personas',
    achExplorer: 'Explorer',
    achExplorerDesc: 'Try 10 different categories',
    achLegend: 'Legend',
    achLegendDesc: 'Talk to a legendary persona',

    categories: {
      healing: { name: 'Healing', description: 'Comfort & emotional support' },
      romance: { name: 'Romance', description: 'Love, flirting & connection' },
      comedy: { name: 'Comedy', description: 'Laughs & good times' },
      horror: { name: 'Horror', description: 'Scares & thrills' },
      idol: { name: 'Idol & Celebrity', description: 'Stars & performers' },
      intellectual: { name: 'Intellectual', description: 'Deep talks & knowledge' },
      adventure: { name: 'Adventure', description: 'Quests & exploration' },
      mystic: { name: 'Mystic', description: 'Fortune & spirituality' },
      asmr: { name: 'ASMR & Relax', description: 'Soothing & calming' },
      motivation: { name: 'Motivation', description: 'Push & inspiration' },
      scifi: { name: 'Sci-Fi', description: 'Future & technology' },
      fantasy: { name: 'Fantasy', description: 'Magic & mythical' },
      language: { name: 'Language', description: 'Learn & practice' },
      villain: { name: 'Villain', description: 'Dark & devious' },
      chaos: { name: 'Chaos', description: 'Wild & unpredictable' },
    },

    languageLabel: 'Language',

    // Premium
    upgradeTitle: 'Upgrade to Premium',
    upgradeSubtitle: 'Unlock the full potential of LivePersona with an upgraded plan.',
    freePlan: 'Free',
    plusPlan: 'Plus',
    proPlan: 'Pro',
    currentPlan: 'Current Plan',
    selectPlan: 'Select Plan',
    featStandardInteractions: 'Standard AI Interactions',
    featLimitedMinutes: 'Limited monthly minutes',
    featStandardQuality: 'Standard voice quality',
    featUnlimitedMinutes: 'Unlimited monthly minutes',
    featPriorityQueue: 'Priority queue access',
    featHQVoices: 'High-quality 18+ voice models',
    featExcitingContent: 'Exciting & Stimulating personas',
    featNanoBananaPro: 'NanoBanana Pro (나노바나나 프로) Images',
    featEarlyAccess: 'Early access to new features',

    promptLangInstruction: '\n\nIMPORTANT: You MUST respond entirely in English. All your dialogue, reactions, emotional expressions, and conversations must be in natural English.',
  },
  ko: {
    appTitle: 'LIVEPERSONA',
    appSubtitle: '랜덤 AI 음성 통화 • 즉시 연결 • 무한 페르소나',

    // Studio
    studioTitle: '크리에이터 스튜디오',
    createPersona: '페르소나 생성',
    personaName: '페르소나 이름',
    personaDesc: '짧은 소개말',

    // Granular Prompt Fields
    studioPersonality: '핵심 성격 (Personality)',
    studioPersonalityHint: '예: 츤데레 소꿉친구, 다정한 누나/오빠, 냉혹한 암살자 등...',
    studioBackground: '배경 설정 (Background Story)',
    studioBackgroundHint: '예: 어릴 적 친했지만 멀어진 사이. 혹은 마왕을 물리치러 가는 파티원.',
    studioStyle: '말투 및 특징 (Speaking Style)',
    studioStyleHint: '예: 반말을 쓰고 은어를 많이 씀, 딱딱한 군인 말투, 소심해서 말을 더듬음.',
    studioOpening: '첫 인사말 (Opening Line)',
    studioOpeningHint: '통화가 연결되자마자 AI가 항상 먼저 건넬 첫 마디를 작성하세요.',

    generateAvatar: '아바타 생성',
    generateNanoBanana: '✨ 나노바나나 프로 생성',
    nanoBananaPrompt: '생성하고 싶은 아바타 이미지를 묘사하세요 (Pro 등급 필요)...',
    proRequired: 'Pro 구독이 필요합니다',
    createButton: '생성 및 저장',

    apiKeyTitle: 'LivePersona에 오신 것을 환영합니다',
    apiKeySubtitle: 'Gemini API 키를 입력하여 통화를 시작하세요',
    apiKeyPlaceholder: 'Gemini API 키를 여기에 붙여넣기...',
    apiKeyButton: '🚀 통화 시작',
    apiKeyGetKey: '에서 무료 API 키를 받으세요',
    apiKeyGetKeyLink: 'Google AI Studio',
    apiKeyNote: '키는 브라우저에 로컬로 저장되며 누구와도 공유되지 않습니다.',
    apiKeyInvalid: '유효한 API 키를 입력해주세요 (최소 10자)',
    apiKeyChangeKey: 'API 키 변경',

    talkingNow: '명 통화 중',
    explore: '탐색',
    profile: '프로필',
    callsMade: '통화 완료',
    avgTime: '평균 8.4분',
    connectTime: '0.3초 연결',
    randomAll: '랜덤 (전체 카테고리)',
    callNow: '지금 전화',
    pressToConnect: '버튼을 누르면 랜덤 AI 페르소나와 즉시 연결됩니다.',
    anonymous: '100% 익명 • 실시간 음성 • 감정 AI',

    findingMatch: '매칭 중...',
    connectingPersona: '페르소나 연결 중...',
    pickingUp: '님이 전화를 받는 중...',
    connectedExclaim: '연결됨!',

    connectedLabel: '연결됨',
    connectingLabel: '연결 중...',

    callEnded: '통화 종료',
    withPerson: '와(과)',
    xpEarned: '획득한 XP',
    rateConversation: '이 대화를 평가하세요',
    save: '저장',
    saved: '저장됨!',
    share: '공유',
    shared: '복사됨!',
    exportLabel: '내보내기',
    callAgain: '다시 전화',
    newMatch: '새 매칭',

    exploreTitle: '페르소나 탐색',
    personasLabel: '페르소나',
    searchPlaceholder: '페르소나, 태그, 카테고리 검색...',
    all: '전체',
    noPersonasFound: '페르소나를 찾을 수 없습니다',
    tryDifferent: '다른 검색어나 카테고리를 시도하세요',
    levelRequired: '레벨 {level} 필요',

    profileTitle: '프로필',
    levelCaller: '레벨 {level} 콜러',

    tabOverview: '요약 (Overview)',
    tabMemory: '추억 저장소 (Memory)',
    noSavedCalls: '아직 저장된 추억이 없습니다. 통화 후 요약 화면에서 저장 버튼을 눌러주세요!',
    transcriptLabel: '통화 대화록',

    totalCalls: '총 통화',
    minutesTalked: '통화 시간 (분)',
    favorites: '즐겨찾기',
    totalXP: '총 XP',
    achievementsTitle: '업적',

    achFirstContact: '첫 통화',
    achFirstContactDesc: '첫 번째 통화하기',
    achRegularCaller: '단골 통화자',
    achRegularCallerDesc: '10회 통화하기',
    achCallAddict: '통화 중독',
    achCallAddictDesc: '50회 통화하기',
    achChatterbox: '수다쟁이',
    achChatterboxDesc: '총 60분 통화하기',
    achMarathonCaller: '마라톤 통화자',
    achMarathonCallerDesc: '총 5시간 통화하기',
    achNightOwl: '올빼미족',
    achNightOwlDesc: '자정 이후 통화하기',
    achCollector: '수집가',
    achCollectorDesc: '즐겨찾기 5개 저장하기',
    achExplorer: '탐험가',
    achExplorerDesc: '10개 카테고리 시도하기',
    achLegend: '전설',
    achLegendDesc: '전설 페르소나와 통화하기',

    categories: {
      healing: { name: '힐링', description: '위로와 감정 지원' },
      romance: { name: '로맨스', description: '사랑, 플러팅 & 연결' },
      comedy: { name: '코미디', description: '웃음 & 즐거운 시간' },
      horror: { name: '공포', description: '무서움 & 스릴' },
      idol: { name: '아이돌 & 셀럽', description: '스타 & 퍼포머' },
      intellectual: { name: '지식인', description: '깊은 대화 & 지식' },
      adventure: { name: '모험', description: '퀘스트 & 탐험' },
      mystic: { name: '신비', description: '운명 & 영성' },
      asmr: { name: 'ASMR & 릴렉스', description: '편안함 & 진정' },
      motivation: { name: '동기부여', description: '푸시 & 영감' },
      scifi: { name: 'SF', description: '미래 & 기술' },
      fantasy: { name: '판타지', description: '마법 & 신화' },
      language: { name: '언어', description: '학습 & 연습' },
      villain: { name: '빌런', description: '어둠 & 사악함' },
      chaos: { name: '카오스', description: '거침없는 & 예측불가' },
    },

    languageLabel: '언어',

    // Premium
    upgradeTitle: '프리미엄 업그레이드',
    upgradeSubtitle: '업그레이드 플랜으로 LivePersona의 모든 기능을 잠금 해제하세요.',
    freePlan: '무료',
    plusPlan: '플러스',
    proPlan: '프로',
    currentPlan: '현재 플랜',
    selectPlan: '플랜 선택',
    featStandardInteractions: '표준 AI 대화',
    featLimitedMinutes: '월간 제한된 통화 시간',
    featStandardQuality: '일반 음성 품질',
    featUnlimitedMinutes: '무제한 월간 통화 시간',
    featPriorityQueue: '우선 접속 대기열',
    featHQVoices: '고품질 18+ 음성 모델',
    featExcitingContent: '새롭고 자극적인 페르소나',
    featNanoBananaPro: '나노바나나 프로 기반 이미지',
    featEarlyAccess: '신규 기능 앞서 해보기',

    promptLangInstruction: '\n\n중요: 반드시 한국어로만 대답하세요. 모든 대화, 반응, 감정 표현, 대화는 자연스러운 한국어로 해야 합니다. 존댓말과 반말을 캐릭터에 맞게 적절히 사용하세요.',
  },
};
