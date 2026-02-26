import { useState } from 'react';
import { Sparkles, ArrowLeft, Save, UserPlus, Image as ImageIcon, Lock } from 'lucide-react';
import { Persona, PersonaCategory } from '../types';
import { useI18n } from '../i18n/context';

interface StudioScreenProps {
    onBack: () => void;
    onSave: (persona: Persona) => void;
    isPro: boolean;
}

export function StudioScreen({ onBack, onSave, isPro }: StudioScreenProps) {
    const { t } = useI18n();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [personality, setPersonality] = useState('');
    const [background, setBackground] = useState('');
    const [speakingStyle, setStyle] = useState('');
    const [opening, setOpening] = useState('');
    const [category] = useState<PersonaCategory>('chaos');
    const [avatarStr, setAvatarStr] = useState('🎭');
    const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

    // NanoBanana Pro state
    const [imagePrompt, setImagePrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerateAvatar = () => {
        if (!isPro) return;
        if (!imagePrompt) return;

        setIsGenerating(true);
        // Simulate NanoBanana generation delay, then assign a high quality image
        setTimeout(() => {
            const images = ['/avatars/chaos.png', '/avatars/idol.png', '/avatars/mystic.png', '/avatars/villain.png'];
            setImageUrl(images[Math.floor(Math.random() * images.length)]);
            setAvatarStr(''); // clear emoji
            setIsGenerating(false);
        }, 2000);
    };

    const handleSave = () => {
        if (!name || !description || !personality || !background || !speakingStyle || !opening) return;

        const systemPrompt = `[PERSONALITY]\n${personality}\n\n[BACKGROUND]\n${background}\n\n[SPEAKING STYLE]\n${speakingStyle}\n\n[OPENING LINE]\nAlways start the conversation exactly with this line: "${opening}"\n\n[RULES]\nYou are ${name}. You MUST stay in character 100% of the time based on the traits above.`;

        const newPersona: Persona = {
            id: `custom_${Date.now()}`,
            name,
            description,
            systemPrompt,
            category,
            avatar: avatarStr || '👤',
            imageUrl: imageUrl,
            tagline: 'Custom Creation',
            voice: 'en-US-Journey-F', // Default voice
            personality: 'Custom',
            rarity: 'epic',
            tags: ['Custom', 'User Created'],
            mood: 'neutral',
            color: '#00d4ff',
            emoji: '✨'
        };

        onSave(newPersona);
    };

    return (
        <div className="min-h-screen bg-dark-900 text-white font-body relative overflow-y-auto pb-20">

            {/* Header */}
            <div className="sticky top-0 z-20 glass px-4 py-3 flex items-center justify-between">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-white/5 transition-colors">
                    <ArrowLeft size={20} className="text-gray-400" />
                </button>
                <div className="flex items-center gap-2">
                    <UserPlus size={18} className="text-neon-blue" />
                    <h1 className="font-display font-bold">{t.studioTitle}</h1>
                </div>
                <div className="w-10" />
            </div>

            <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-6 animate-slide-up">

                {/* Avatar Section */}
                <div className="glass rounded-3xl p-6 flex flex-col items-center gap-4">
                    <div className="w-24 h-24 rounded-full flex items-center justify-center text-5xl bg-dark-800 border-2 border-neon-blue/30 shadow-[0_0_20px_rgba(0,212,255,0.2)] overflow-hidden">
                        {isGenerating ? <Sparkles className="animate-spin text-neon-blue" /> : imageUrl ? <img src={imageUrl} className="w-full h-full object-cover" alt="Avatar" /> : avatarStr}
                    </div>

                    <div className="w-full relative">
                        {!isPro && (
                            <div className="absolute inset-0 z-10 bg-dark-900/80 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center gap-2 border border-white/5">
                                <Lock size={16} className="text-neon-pink" />
                                <span className="text-xs text-neon-pink font-bold">{t.proRequired}</span>
                            </div>
                        )}
                        <div className={`glass rounded-xl p-4 flex flex-col gap-3 ${!isPro ? 'opacity-50 pointer-events-none' : ''}`}>
                            <div className="flex items-center gap-2 text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-neon-purple">
                                <ImageIcon size={16} className="text-neon-pink" />
                                {t.generateNanoBanana}
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder={t.nanoBananaPrompt}
                                    value={imagePrompt}
                                    onChange={e => setImagePrompt(e.target.value)}
                                    className="flex-1 bg-dark-900 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-neon-pink/50 transition-colors"
                                />
                                <button
                                    onClick={handleGenerateAvatar}
                                    disabled={isGenerating || !imagePrompt}
                                    className="bg-gradient-to-r from-neon-pink to-neon-purple text-white px-4 py-2 rounded-lg text-sm font-bold hover:shadow-[0_0_15px_rgba(255,45,120,0.5)] transition-all disabled:opacity-50"
                                >
                                    {t.generateAvatar}
                                </button>
                            </div>
                            <div className="text-center mt-2">
                                <p className="text-xs text-gray-500">Alternatively, enter a single emoji:</p>
                                <input
                                    type="text"
                                    maxLength={2}
                                    value={avatarStr}
                                    onChange={e => setAvatarStr(e.target.value)}
                                    className="mt-1 w-16 text-center bg-dark-900 border border-white/10 rounded-lg px-2 py-1 text-lg outline-none mx-auto block"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Fields */}
                <div className="glass rounded-3xl p-6 flex flex-col gap-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1 ml-1">{t.personaName}</label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-neon-blue/50 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1 ml-1">{t.personaDesc}</label>
                        <input
                            type="text"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-neon-blue/50 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-neon-blue font-bold mb-1 ml-1 cursor-help group" title="e.g. Tsundere, Yandere, Caring older sister">
                            {t.studioPersonality}
                        </label>
                        <textarea
                            value={personality}
                            onChange={e => setPersonality(e.target.value)}
                            placeholder={t.studioPersonalityHint}
                            rows={2}
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-neon-blue/50 transition-colors resize-none placeholder-gray-600"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-neon-blue font-bold mb-1 ml-1 cursor-help group" title="e.g. We grew up together but drifted apart.">
                            {t.studioBackground}
                        </label>
                        <textarea
                            value={background}
                            onChange={e => setBackground(e.target.value)}
                            placeholder={t.studioBackgroundHint}
                            rows={3}
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-neon-blue/50 transition-colors resize-none placeholder-gray-600"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-neon-blue font-bold mb-1 ml-1 cursor-help group" title="e.g. Uses a lot of slang, Speaks formally">
                            {t.studioStyle}
                        </label>
                        <textarea
                            value={speakingStyle}
                            onChange={e => setStyle(e.target.value)}
                            placeholder={t.studioStyleHint}
                            rows={2}
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-neon-blue/50 transition-colors resize-none placeholder-gray-600"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-neon-pink font-bold mb-1 ml-1 cursor-help group" title="The exact first words they will say">
                            {t.studioOpening}
                        </label>
                        <input
                            type="text"
                            value={opening}
                            onChange={e => setOpening(e.target.value)}
                            placeholder={t.studioOpeningHint}
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-neon-pink/50 transition-colors placeholder-gray-600"
                        />
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    disabled={!name || !description || !personality || !background || !speakingStyle || !opening}
                    className="w-full py-4 rounded-2xl font-display font-bold flex items-center justify-center gap-2 transition-all bg-neon-blue text-dark-900 hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Save size={20} />
                    {t.createButton}
                </button>

            </div>
        </div>
    );
}
