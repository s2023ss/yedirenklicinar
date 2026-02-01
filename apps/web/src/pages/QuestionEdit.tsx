import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card } from '@yedirenklicinar/ui-kit';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@yedirenklicinar/shared-api';
import { QuestionForm } from '../components/QuestionForm';

export const QuestionEdit: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: question, isLoading, error } = useQuery({
        queryKey: ['question', id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('questions')
                .select(`
                    *,
                    learning_outcomes (
                        id,
                        description,
                        topic_id,
                        topics (
                            id,
                            name,
                            unit_id,
                            units (
                                id,
                                name,
                                course_id,
                                courses (
                                    id,
                                    name,
                                    grade_id
                                )
                            )
                        )
                    ),
                    options (*)
                `)
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        },
        enabled: !!id
    });

    const handleSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ['questions'] });
        queryClient.invalidateQueries({ queryKey: ['question', id] });
        navigate('/questions');
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <div className="w-14 h-14 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
                <p className="text-slate-500 font-bold animate-pulse text-lg">Soru bilgileri alınıyor...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-3xl mx-auto py-12">
                <Card className="p-8 border-red-100 bg-red-50 text-center">
                    <h3 className="text-xl font-bold text-red-900 mb-2">Hata Oluştu</h3>
                    <p className="text-red-700">Soru verileri yüklenirken bir sorun oluştu.</p>
                    <Button variant="primary" className="mt-6" onClick={() => navigate('/questions')}>
                        Soru Bankasına Dön
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/questions')}
                        className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-500 hover:text-primary-600 hover:border-primary-200 hover:shadow-lg hover:shadow-primary-500/10 transition-all group"
                    >
                        <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="px-2.5 py-0.5 bg-primary-100 text-primary-700 text-[10px] font-black uppercase tracking-wider rounded-lg">
                                Düzenleme Modu
                            </span>
                            <span className="text-slate-400 text-xs font-bold">ID: #{id}</span>
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Soruyu Güncelle</h1>
                    </div>
                </div>

                <div className="hidden lg:flex items-center gap-3 px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <BookOpen size={20} className="text-slate-400" />
                    <span className="text-sm font-bold text-slate-500">
                        {question?.learning_outcomes?.topics?.units?.courses?.name}
                    </span>
                </div>
            </div>

            {/* Form Container */}
            <Card className="p-8 md:p-12 border-none shadow-2xl shadow-slate-200/50 bg-white rounded-[2.5rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="relative z-10">
                    <QuestionForm
                        onSuccess={handleSuccess}
                        onCancel={() => navigate('/questions')}
                        initialData={question}
                    />
                </div>
            </Card>
        </div>
    );
};
