import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface AuthScreenProps {
    onLoginSuccess: () => void;
    onSkip: () => void;
}

export function AuthScreen({ onLoginSuccess, onSkip }: AuthScreenProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isSignUp) {
                const { error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (signUpError) throw signUpError;
                // On success, we assume they need to verify email or auto login
                setError("회원가입 성공! 가입하신 이메일을 확인하거나 로그인해주세요.");
                setIsSignUp(false);
            } else {
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (signInError) throw signInError;
                onLoginSuccess();
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-[100] animate-fade-in px-4">
            <div className="glass rounded-3xl p-8 max-w-sm w-full animate-slide-up border border-neon-blue/20 shadow-2xl bg-dark-900/90 backdrop-blur-xl">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-pink to-neon-purple flex items-center justify-center shadow-[0_0_30px_rgba(255,45,120,0.4)]">
                        <span className="text-3xl">🔑</span>
                    </div>
                </div>

                <h2 className="text-2xl font-display font-bold text-center mb-2">LivePersona 로그인</h2>
                <p className="text-gray-400 text-center text-sm mb-6">로그인하여 프리미엄 기능과 커스텀 페르소나 정보를 영구 저장하세요.</p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-200 text-xs p-3 rounded-xl mb-4 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleAuth} className="space-y-4">
                    <input
                        type="email"
                        placeholder="이메일 (Email)"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full bg-dark-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all"
                        required
                    />
                    <input
                        type="password"
                        placeholder="비밀번호 (Password)"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full bg-dark-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all"
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-neon-blue text-dark-900 font-bold rounded-xl hover:bg-neon-blue/90 hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all disabled:opacity-50"
                    >
                        {loading ? '처리중...' : (isSignUp ? '간편 회원가입' : '이메일로 로그인')}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <button
                        onClick={() => {
                            setIsSignUp(!isSignUp);
                            setError(null);
                        }}
                        className="text-xs text-neon-pink hover:underline"
                    >
                        {isSignUp ? '이미 계정이 있으신가요? 로그인' : '계정이 없으신가요? 3초 회원가입'}
                    </button>
                </div>

                <div className="mt-6 flex items-center justify-center">
                    <button
                        onClick={onSkip}
                        className="text-gray-500 text-sm hover:text-white transition-colors"
                    >
                        건너뛰고 비회원으로 진행 (로컬 저장)
                    </button>
                </div>
            </div>
        </div>
    );
}
