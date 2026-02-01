import React from 'react';
import { Card } from '@yedirenklicinar/ui-kit';
import { Users, BookOpen, HelpCircle, TrendingUp } from 'lucide-react';

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@yedirenklicinar/shared-api';

export const Dashboard: React.FC = () => {
    // Fetch Student Count
    const { data: studentCount } = useQuery({
        queryKey: ['count', 'students'],
        queryFn: async () => {
            const { count, error } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true })
                .eq('role', 'student');
            if (error) throw error;
            return count || 0;
        }
    });

    // Fetch Course Count
    const { data: courseCount } = useQuery({
        queryKey: ['count', 'courses'],
        queryFn: async () => {
            const { count, error } = await supabase
                .from('courses')
                .select('*', { count: 'exact', head: true });
            if (error) throw error;
            return count || 0;
        }
    });

    // Fetch Question Count
    const { data: questionCount } = useQuery({
        queryKey: ['count', 'questions'],
        queryFn: async () => {
            const { count, error } = await supabase
                .from('questions')
                .select('*', { count: 'exact', head: true });
            if (error) throw error;
            return count || 0;
        }
    });

    const stats = [
        { label: 'Toplam Öğrenci', value: String(studentCount ?? '...'), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Aktif Dersler', value: String(courseCount ?? '...'), icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Soru Sayısı', value: String(questionCount ?? '...'), icon: HelpCircle, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Başarı Oranı', value: '%86', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    ];

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div className="animate-in fade-in duration-700">
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Hoş Geldiniz</h1>
                <p className="text-slate-500 mt-2 font-medium">Yedi Renkli Çınar eğitim yönetim paneline genel bakış.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="animate-in zoom-in-95" style={{ animationDelay: `${i * 100}ms` }}>
                        <Card className="p-6 border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div className="flex items-center gap-4">
                                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} shadow-inner`}>
                                    <stat.icon size={28} />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.15em] mb-1">{stat.label}</p>
                                    <p className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-8 border-slate-100 min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed bg-slate-50/10 rounded-[2.5rem] relative overflow-hidden group">
                    <div className="absolute inset-0 bg-primary-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative text-center space-y-4">
                        <div className="w-20 h-20 bg-white shadow-xl rounded-3xl flex items-center justify-center mx-auto text-slate-300">
                            <TrendingUp size={40} />
                        </div>
                        <p className="text-slate-400 font-bold text-lg">Öğrenci Gelişim Grafiği (Yakında)</p>
                        <p className="text-slate-300 text-sm max-w-[240px] mx-auto font-medium">Sınav sonuçlarına göre öğrenci performans analizleri burada görüntülenecek.</p>
                    </div>
                </Card>
                <Card className="p-8 border-slate-100 min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed bg-slate-50/10 rounded-[2.5rem] relative overflow-hidden group">
                    <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative text-center space-y-4">
                        <div className="w-20 h-20 bg-white shadow-xl rounded-3xl flex items-center justify-center mx-auto text-slate-300">
                            <BookOpen size={40} />
                        </div>
                        <p className="text-slate-400 font-bold text-lg">Son Aktiviteler (Yakında)</p>
                        <p className="text-slate-300 text-sm max-w-[240px] mx-auto font-medium">Öğrencilerin çözdüğü son testler ve kazanım durumları burada takip edilecek.</p>
                    </div>
                </Card>
            </div>
        </div>
    );
};
