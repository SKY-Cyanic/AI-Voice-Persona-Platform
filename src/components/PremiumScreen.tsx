import { Crown, Check, ArrowLeft, Zap, Sparkles, Image as ImageIcon } from 'lucide-react';
import { useI18n } from '../i18n/context';

interface PremiumScreenProps {
    onBack: () => void;
    currentTier?: 'free' | 'plus' | 'pro';
}

export function PremiumScreen({ onBack, currentTier = 'free' }: PremiumScreenProps) {
    const { t } = useI18n();

    return (
        <div className="min-h-screen bg-dark-900 text-white font-body relative overflow-hidden flex flex-col items-center">
            {/* Background gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-neon-pink/20 blur-[120px] rounded-full mix-blend-screen" />
                <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] bg-neon-blue/20 blur-[120px] rounded-full mix-blend-screen" />
                <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-neon-purple/20 blur-[120px] rounded-full mix-blend-screen" />
            </div>

            {/* Header */}
            <div className="w-full flex items-center justify-between p-4 z-10 max-w-6xl">
                <button
                    onClick={onBack}
                    className="glass rounded-full p-2 text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div className="flex items-center gap-2 glass px-4 py-1.5 rounded-full">
                    <Crown size={16} className="text-neon-yellow" />
                    <span className="text-sm font-semibold">{t.upgradeTitle}</span>
                </div>
                <div className="w-10" /> {/* Spacer */}
            </div>

            <div className="z-10 flex flex-col items-center text-center mt-8 mb-12 px-4 animate-slide-up">
                <h1 className="text-4xl md:text-5xl font-display font-black mb-4">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-pink via-neon-purple to-neon-blue">
                        {t.upgradeTitle}
                    </span>
                </h1>
                <p className="text-gray-400 max-w-lg">{t.upgradeSubtitle}</p>
            </div>

            {/* Pricing Cards */}
            <div className="z-10 w-full max-w-6xl px-4 flex flex-col md:flex-row gap-6 justify-center items-stretch mb-20">

                {/* Free Tier */}
                <div className="flex-1 glass rounded-3xl p-6 flex flex-col relative animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <h3 className="text-xl font-bold mb-2">{t.freePlan}</h3>
                    <div className="text-3xl font-black mb-6">$0<span className="text-lg text-gray-500 font-normal">/mo</span></div>

                    <div className="flex-1 flex flex-col gap-4">
                        <div className="flex items-start gap-3 text-sm text-gray-300">
                            <Check size={18} className="text-neon-green shrink-0 mt-0.5" />
                            <span>{t.featStandardInteractions}</span>
                        </div>
                        <div className="flex items-start gap-3 text-sm text-gray-300">
                            <Check size={18} className="text-neon-green shrink-0 mt-0.5" />
                            <span>{t.featLimitedMinutes}</span>
                        </div>
                        <div className="flex items-start gap-3 text-sm text-gray-300">
                            <Check size={18} className="text-neon-green shrink-0 mt-0.5" />
                            <span>{t.featStandardQuality}</span>
                        </div>
                    </div>

                    <button className={`mt-8 w-full py-3 rounded-xl font-bold text-sm transition-all ${currentTier === 'free' ? 'bg-white/10 text-gray-400 cursor-default' : 'glass hover:bg-white/10'}`}>
                        {currentTier === 'free' ? t.currentPlan : t.selectPlan}
                    </button>
                </div>

                {/* Plus Tier */}
                <div className="flex-1 glass rounded-3xl p-6 flex flex-col relative animate-slide-up border border-neon-blue/30 scale-100 md:scale-105 z-10 bg-dark-800/80 shadow-[0_0_30px_rgba(0,212,255,0.1)]" style={{ animationDelay: '0.2s' }}>
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-neon-blue text-dark-900 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                        <Zap size={12} /> MOST POPULAR
                    </div>

                    <h3 className="text-xl font-bold mb-2 text-neon-blue">{t.plusPlan}</h3>
                    <div className="text-3xl font-black mb-6">$9.99<span className="text-lg text-gray-500 font-normal">/mo</span></div>

                    <div className="flex-1 flex flex-col gap-4">
                        <div className="flex items-start gap-3 text-sm text-gray-200">
                            <Check size={18} className="text-neon-blue shrink-0 mt-0.5" />
                            <span>{t.featUnlimitedMinutes}</span>
                        </div>
                        <div className="flex items-start gap-3 text-sm text-gray-200">
                            <Check size={18} className="text-neon-blue shrink-0 mt-0.5" />
                            <span>{t.featPriorityQueue}</span>
                        </div>
                        <div className="flex items-start gap-3 text-sm text-gray-200">
                            <Check size={18} className="text-neon-blue shrink-0 mt-0.5" />
                            <span>{t.featHQVoices}</span>
                        </div>
                    </div>

                    <button className={`mt-8 w-full py-3 rounded-xl font-bold text-sm transition-all ${currentTier === 'plus' ? 'bg-neon-blue/20 text-neon-blue cursor-default' : 'bg-neon-blue text-dark-900 hover:bg-neon-blue/90 hover:shadow-[0_0_20px_rgba(0,212,255,0.4)]'}`}>
                        {currentTier === 'plus' ? t.currentPlan : t.selectPlan}
                    </button>
                </div>

                {/* Pro Tier */}
                <div className="flex-1 glass rounded-3xl p-6 flex flex-col relative animate-slide-up border border-neon-pink/40 bg-gradient-to-b from-neon-pink/5 to-transparent shadow-[0_0_40px_rgba(255,45,120,0.15)]" style={{ animationDelay: '0.3s' }}>
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-neon-pink to-neon-purple text-white text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1 shadow-[0_0_15px_rgba(255,45,120,0.5)]">
                        <Sparkles size={12} /> ULTIMATE
                    </div>

                    <h3 className="text-xl font-bold mb-2 text-neon-pink">{t.proPlan}</h3>
                    <div className="text-3xl font-black mb-6">$19.99<span className="text-lg text-gray-500 font-normal">/mo</span></div>

                    <div className="flex-1 flex flex-col gap-4">
                        <div className="flex items-start gap-3 text-sm text-white font-medium">
                            <Check size={18} className="text-neon-pink shrink-0 mt-0.5" />
                            <span>{t.featExcitingContent}</span>
                        </div>
                        <div className="flex items-start gap-3 text-sm text-white font-medium">
                            <ImageIcon size={18} className="text-neon-purple shrink-0 mt-0.5" />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-neon-pink to-neon-blue font-bold tracking-wide">
                                {t.featNanoBananaPro}
                            </span>
                        </div>
                        <div className="flex items-start gap-3 text-sm text-gray-200">
                            <Check size={18} className="text-neon-pink shrink-0 mt-0.5" />
                            <span>{t.featHQVoices}</span>
                        </div>
                        <div className="flex items-start gap-3 text-sm text-gray-200">
                            <Check size={18} className="text-neon-pink shrink-0 mt-0.5" />
                            <span>{t.featUnlimitedMinutes} & Priority</span>
                        </div>
                        <div className="flex items-start gap-3 text-sm text-gray-200">
                            <Check size={18} className="text-neon-pink shrink-0 mt-0.5" />
                            <span>{t.featEarlyAccess}</span>
                        </div>
                    </div>

                    <button className={`mt-8 w-full py-3 rounded-xl font-bold text-sm transition-all ${currentTier === 'pro' ? 'bg-neon-pink/20 text-neon-pink cursor-default' : 'bg-gradient-to-r from-neon-pink to-neon-purple text-white hover:shadow-[0_0_25px_rgba(255,45,120,0.6)] hover:scale-[1.02]'}`}>
                        {currentTier === 'pro' ? t.currentPlan : t.selectPlan}
                    </button>
                </div>

            </div>
        </div>
    );
}
