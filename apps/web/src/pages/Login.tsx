import React, { useState } from 'react';
import { supabase } from '@yedirenklicinar/shared-api';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from '@yedirenklicinar/ui-kit';
import { GraduationCap, Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

export const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { data, error: loginError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (loginError) {
            setError('Giriş başarısız. Lütfen e-posta ve şifrenizi kontrol edin.');
            setLoading(false);
            return;
        }

        // Get profile to determine role and redirect
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.user.id)
            .single();

        if (profile?.role === 'student') {
            navigate('/student/exams');
        } else {
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-gradient-to-br from-slate-50 to-primary-50">
            <Card className="max-w-md w-full p-10 space-y-8 rounded-[3rem] shadow-2xl border-none bg-white/80 backdrop-blur-xl">
                <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-primary-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-xl shadow-primary-500/40 rotate-3">
                        <GraduationCap size={40} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight italic">Akademi Giriş</h2>
                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">Yedi Renkli Çınar Eğitim Platformu</p>
                    </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold animate-in fade-in slide-in-from-top-2">
                            <AlertCircle size={18} />
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">E-Posta</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-12 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary-500/50 transition-all outline-none font-bold text-slate-700"
                                placeholder="ornek@yedirenklicinar.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Şifre</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-12 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary-500/50 transition-all outline-none font-bold text-slate-700"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <Button
                        variant="primary"
                        type="submit"
                        isLoading={loading}
                        className="w-full py-5 rounded-[2rem] font-black text-lg shadow-xl shadow-primary-500/30 flex items-center justify-center gap-3 text-white"
                    >
                        <LogIn size={20} strokeWidth={3} />
                        Giriş Yap
                    </Button>
                </form>

                <div className="pt-6 border-t border-slate-50 text-center space-y-4">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Test Hesapları</p>
                    <div className="flex flex-col gap-2">
                        <div className="text-[10px] bg-slate-50 p-2 rounded-xl text-slate-500 font-bold border border-slate-100">
                            Admin: <span className="text-primary-600">admin@yedirenklicinar.com</span> (Password123!)
                        </div>
                        <div className="text-[10px] bg-slate-50 p-2 rounded-xl text-slate-500 font-bold border border-slate-100">
                            Öğrenci: <span className="text-primary-600">ogrenci@yedirenklicinar.com</span> (Password123!)
                        </div>
                        <div className="text-[10px] bg-slate-50 p-2 rounded-xl text-slate-500 font-bold border border-slate-100">
                            Öğretmen: <span className="text-primary-600">ogretmen@yedirenklicinar.com</span> (Password123!)
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};
