import React from 'react';
import { Card, Button } from '@yedirenklicinar/ui-kit';
import { UserPlus, Search, Shield, User } from 'lucide-react';

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@yedirenklicinar/shared-api';

export const Users: React.FC = () => {
    const [searchTerm, setSearchTerm] = React.useState('');

    const { data: profiles, isLoading, error } = useQuery({
        queryKey: ['profiles'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('full_name');
            if (error) throw error;
            return data || [];
        }
    });

    const filteredProfiles = profiles?.filter(p =>
        p.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getRoleStyling = (role: string) => {
        switch (role) {
            case 'admin': return { label: 'Admin', icon: Shield, color: 'text-purple-600', bg: 'bg-purple-50' };
            case 'teacher': return { label: 'Öğretmen', icon: User, color: 'text-blue-600', bg: 'bg-blue-50' };
            default: return { label: 'Öğrenci', icon: User, color: 'text-emerald-600', bg: 'bg-emerald-50' };
        }
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 animate-in fade-in duration-500">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Kullanıcı Yönetimi</h1>
                    <p className="text-slate-500 mt-2 font-medium">Öğretmen, öğrenci ve admin hesaplarını yönetin.</p>
                </div>
                <Button variant="primary" size="lg" className="rounded-2xl shadow-xl shadow-primary-500/20 px-8 gap-3 font-black">
                    <UserPlus size={22} strokeWidth={3} />
                    Yeni Kullanıcı
                </Button>
            </div>

            <Card className="p-4 border-none shadow-sm bg-white/50 backdrop-blur-sm rounded-2xl">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="İsim, e-posta veya rol ile ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-slate-100/50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500/20 focus:bg-white transition-all outline-none text-sm font-bold placeholder:text-slate-400"
                        />
                    </div>
                </div>
            </Card>

            <div className="grid gap-4">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <div className="w-10 h-10 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
                        <p className="text-slate-500 font-bold animate-pulse">Kullanıcılar yükleniyor...</p>
                    </div>
                ) : error ? (
                    <Card className="p-8 border-red-100 bg-red-50 text-center rounded-[2rem]">
                        <p className="text-red-700 font-bold">Kullanıcı listesi alınırken bir hata oluştu.</p>
                    </Card>
                ) : filteredProfiles && filteredProfiles.length > 0 ? (
                    filteredProfiles.map((profile, i) => {
                        const style = getRoleStyling(profile.role);
                        return (
                            <div key={profile.id} className="animate-in slide-in-from-bottom-2" style={{ animationDelay: `${i * 50}ms` }}>
                                <Card className="p-5 border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all group rounded-[1.5rem]">
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                                        <div className="flex flex-col sm:flex-row items-center gap-5">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${style.bg} ${style.color}`}>
                                                <style.icon size={28} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black text-slate-800 tracking-tight group-hover:text-primary-600 transition-colors">{profile.full_name || 'İsimsiz Kullanıcı'}</h3>
                                                <p className="text-sm text-slate-400 font-bold tracking-tight">{profile.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] shadow-sm ${style.bg} ${style.color}`}>
                                                {style.label}
                                            </span>
                                            <Button variant="ghost" size="sm" className="rounded-xl font-bold px-4 text-slate-400 hover:text-slate-600">Düzenle</Button>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-20 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                        <Search size={48} className="mx-auto text-slate-200 mb-4" />
                        <h3 className="text-xl font-bold text-slate-400">Kullanıcı Bulunamadı</h3>
                    </div>
                )}
            </div>
        </div>
    );
};
