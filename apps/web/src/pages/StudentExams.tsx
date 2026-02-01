import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@yedirenklicinar/shared-api';
import { Card, Button } from '@yedirenklicinar/ui-kit';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Clock, CheckCircle2, Play, AlertCircle } from 'lucide-react';

export const StudentExams: React.FC = () => {
    const navigate = useNavigate();

    // In a real app, we'd get the user from context. For now, let's fetch session.
    const { data: userData } = useQuery({
        queryKey: ['current-user'],
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Oturum bulunamadı');

            const { data: profile, error } = await supabase
                .from('profiles')
                .select('*, grades(*)')
                .eq('id', user.id)
                .single();

            if (error) throw error;
            return { user, profile };
        }
    });

    const { data: exams, isLoading, error } = useQuery({
        queryKey: ['student-assigned-exams', userData?.profile?.id],
        queryFn: async () => {
            if (!userData?.profile) return [];

            // Fetch assignments where grade matched OR student matched
            let query = supabase
                .from('test_assignments')
                .select(`
                    id,
                    test_id,
                    tests (
                        *,
                        test_questions (count)
                    )
                `);

            if (userData.profile.grade_id) {
                query = query.or(`grade_id.eq.${userData.profile.grade_id},student_id.eq.${userData.profile.id}`);
            } else {
                query = query.eq('student_id', userData.profile.id);
            }

            const { data: assignments, error: asError } = await query;

            if (asError) throw asError;

            // Also fetch submissions to check if already completed
            const { data: submissions, error: subError } = await supabase
                .from('submissions')
                .select('test_id, score, completed_at')
                .eq('student_id', userData.profile.id);

            if (subError) throw subError;

            // Merge data
            return assignments.map((as: any) => ({
                ...as.tests,
                submission: submissions.find(s => s.test_id === as.test_id)
            }));
        },
        enabled: !!userData?.profile
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="w-16 h-16 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
                <p className="text-slate-500 font-black animate-pulse">Sınavlar yükleniyor...</p>
            </div>
        );
    }

    if (error) {
        return (
            <Card className="p-12 border-red-100 bg-red-50 text-center rounded-[2rem] max-w-2xl mx-auto mt-20">
                <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
                <h3 className="text-xl font-black text-red-900">Bir Hata Oluştu</h3>
                <p className="text-red-700 font-medium">Sınavlar yüklenirken bir sorun yaşandı. Lütfen tekrar deneyin.</p>
                <Button variant="ghost" className="mt-6 font-bold" onClick={() => window.location.reload()}>Sayfayı Yenile</Button>
            </Card>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-20">
            {/* Student Welcome Header */}
            <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-primary-700 to-primary-900 p-10 md:p-16 text-white shadow-2xl shadow-primary-900/40">
                <div className="relative z-10 space-y-4 max-w-2xl animate-in slide-in-from-left-8 duration-700">
                    <span className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-[0.2em]">Öğrenci Paneli</span>
                    <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-tight italic">
                        Selam, <span className="text-primary-300 font-black drop-shadow-sm">{userData?.profile?.full_name?.split(' ')[0]}!</span>
                    </h1>
                    <p className="text-primary-100 text-lg font-bold leading-relaxed opacity-90">
                        Henüz çözmediğin <span className="text-white underline decoration-primary-400 decoration-4 underline-offset-8">{(exams?.filter((e: any) => !e.submission).length || 0)}</span> adet sınavın bulunuyor. Başarıya bir adım daha yaklaşmak için sınava başla!
                    </p>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-primary-400/20 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[120px]"></div>
                <div className="absolute right-12 bottom-12 hidden lg:block opacity-20">
                    <ClipboardList size={220} strokeWidth={1} />
                </div>
            </div>

            {/* Exams Grid */}
            <div className="space-y-8 px-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                        <div className="w-1.5 h-8 bg-primary-500 rounded-full"></div>
                        Atanan Sınavlar
                    </h2>
                </div>

                {!exams || exams.length === 0 ? (
                    <Card className="p-20 border-none shadow-sm bg-slate-50/50 text-center space-y-6 rounded-[3rem]">
                        <div className="w-24 h-24 bg-white text-slate-300 rounded-[2rem] flex items-center justify-center mx-auto shadow-sm">
                            <ClipboardList size={48} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-400">Henüz Atanmış Sınav Yok</h3>
                        <p className="text-slate-400 max-w-md mx-auto font-medium">Öğretmenlerin sana sınav atadığında burada görünecek.</p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {exams.map((exam: any, i: number) => (
                            <div
                                key={exam.id}
                                className="animate-in slide-in-from-bottom-8"
                                style={{ animationDelay: `${i * 100}ms` }}
                            >
                                <Card
                                    className={`p-0 border-none shadow-xl shadow-slate-200/40 bg-white rounded-[2.5rem] overflow-hidden group hover:shadow-2xl transition-all duration-500 ${exam.submission ? 'opacity-70 grayscale-[0.3]' : 'hover:-translate-y-2'}`}
                                >
                                    <div className="p-8 space-y-6">
                                        <div className="flex justify-between items-start">
                                            <div className={`p-4 rounded-2xl shadow-inner ${exam.submission ? 'bg-emerald-50 text-emerald-600' : 'bg-primary-50 text-primary-600'}`}>
                                                <ClipboardList size={28} />
                                            </div>
                                            {exam.submission ? (
                                                <span className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/30">
                                                    <CheckCircle2 size={12} /> Tamamlandı
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1.5 px-4 py-2 bg-amber-100 text-amber-700 rounded-xl text-[10px] font-black uppercase tracking-widest border border-amber-200">
                                                    <Clock size={12} /> Yeni
                                                </span>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <h3 className="text-2xl font-black text-slate-800 tracking-tight group-hover:text-primary-600 transition-colors uppercase leading-tight line-clamp-2 min-h-[4rem]">{exam.title}</h3>
                                            <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-400">
                                                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg">
                                                    <Clock size={14} className="text-primary-500" /> {exam.duration_minutes}dk
                                                </div>
                                                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg">
                                                    <ClipboardList size={14} className="text-emerald-500" /> {exam.test_questions?.[0]?.count || 0} Soru
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-6 border-t border-slate-50">
                                            {exam.submission ? (
                                                <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-[1.5rem] border border-emerald-100">
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] font-black uppercase text-emerald-700 tracking-widest">Puanın</span>
                                                        <span className="text-2xl font-black text-emerald-800">{exam.submission.score}</span>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-[10px] font-black uppercase text-emerald-700 tracking-widest">Tarih</span>
                                                        <p className="text-[11px] font-bold text-emerald-800">{new Date(exam.submission.completed_at).toLocaleDateString('tr-TR')}</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <Button
                                                    variant="primary"
                                                    className="w-full rounded-2xl font-black py-4 text-sm shadow-xl shadow-primary-500/20 group-hover:shadow-primary-500/40 flex items-center justify-center gap-3 text-white"
                                                    onClick={() => navigate(`/quiz/solve/${exam.id}`)}
                                                >
                                                    <Play size={18} fill="currentColor" /> Sınava Başla
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
