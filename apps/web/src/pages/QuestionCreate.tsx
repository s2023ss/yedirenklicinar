import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@yedirenklicinar/ui-kit';
import { ChevronLeft, HelpCircle } from 'lucide-react';
import { QuestionForm } from '../components/QuestionForm';

export const QuestionCreate: React.FC = () => {
    const navigate = useNavigate();

    const handleSuccess = () => {
        navigate('/questions');
    };

    const handleCancel = () => {
        navigate('/questions');
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Breadcrumbs */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 text-slate-400 hover:text-primary-600 font-bold text-sm transition-colors group mb-4"
                    >
                        <ChevronLeft size={18} className="transition-transform group-hover:-translate-x-1" />
                        Soru Bankasına Dön
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-500/20 shadow-xl">
                            <HelpCircle size={24} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Yeni Soru Hazırla</h1>
                            <p className="text-slate-500 font-medium">Sisteme yeni bir soru ekleyin ve kazanıma bağlayın.</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-xl font-bold border-slate-200" onClick={handleCancel}>
                        İptal Et
                    </Button>
                </div>
            </div>

            {/* Form Container */}
            <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                <div className="p-8 md:p-12">
                    <QuestionForm onSuccess={handleSuccess} onCancel={handleCancel} />
                </div>
            </div>
        </div>
    );
};
