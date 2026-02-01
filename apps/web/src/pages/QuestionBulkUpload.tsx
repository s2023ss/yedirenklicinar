import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@yedirenklicinar/shared-api';
import { Card, Button } from '@yedirenklicinar/ui-kit';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, FileSpreadsheet, FileText, CheckCircle2, AlertCircle, Download } from 'lucide-react';
import * as XLSX from 'xlsx';

interface RawQuestion {
    kazanim_kodu: string;
    soru_icerigi: string;
    zorluk: number;
    secenek_a: string;
    secenek_b: string;
    secenek_c: string;
    secenek_d: string;
    dogru_cevap: string; // 'A', 'B', 'C', 'D'
}

export const QuestionBulkUpload: React.FC = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [fileData, setFileData] = useState<RawQuestion[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [uploadResults, setUploadResults] = useState<{ success: number; errors: string[] } | null>(null);

    // Fetch learning outcomes to match codes
    const { data: outcomes } = useQuery({
        queryKey: ['learning-outcomes-all'],
        queryFn: async () => {
            const { data, error } = await supabase.from('learning_outcomes').select('id, code');
            if (error) throw error;
            return data;
        }
    });

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const bstr = event.target?.result;
            const wb = XLSX.read(bstr, { type: 'binary' });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const data = XLSX.utils.sheet_to_json<RawQuestion>(ws);
            setFileData(data);
            setUploadResults(null);
        };
        reader.readAsBinaryString(file);
    };

    const processUpload = async () => {
        if (!fileData.length || !outcomes) return;
        setIsProcessing(true);
        const errors: string[] = [];
        let successCount = 0;

        for (const [index, row] of fileData.entries()) {
            try {
                const outcome = outcomes.find(o => o.code === row.kazanim_kodu);
                if (!outcome) {
                    errors.push(`Satır ${index + 2}: Kazanım kodu "${row.kazanim_kodu}" bulunamadı.`);
                    continue;
                }

                // Insert Question
                const { data: question, error: qErr } = await supabase
                    .from('questions')
                    .insert({
                        learning_outcome_id: outcome.id,
                        content: row.soru_icerigi,
                        difficulty_level: row.zorluk || 1
                    })
                    .select()
                    .single();

                if (qErr) throw qErr;

                // Insert Options
                const options = [
                    { question_id: question.id, option_text: row.secenek_a, is_correct: row.dogru_cevap === 'A' },
                    { question_id: question.id, option_text: row.secenek_b, is_correct: row.dogru_cevap === 'B' },
                    { question_id: question.id, option_text: row.secenek_c, is_correct: row.dogru_cevap === 'C' },
                    { question_id: question.id, option_text: row.secenek_d, is_correct: row.dogru_cevap === 'D' }
                ];

                const { error: optErr } = await supabase.from('options').insert(options);
                if (optErr) throw optErr;

                successCount++;
            } catch (err: any) {
                errors.push(`Satır ${index + 2}: ${err.message}`);
            }
        }

        setUploadResults({ success: successCount, errors });
        setIsProcessing(false);
        if (successCount > 0) {
            queryClient.invalidateQueries({ queryKey: ['questions'] });
        }
    };

    const downloadTemplate = (format: 'xlsx' | 'csv') => {
        const template = [
            {
                kazanim_kodu: 'M.12.1.1.1',
                soru_icerigi: 'Logaritma sorusu buraya gelecek...',
                zorluk: 3,
                secenek_a: 'Cevap A',
                secenek_b: 'Cevap B',
                secenek_c: 'Cevap C',
                secenek_d: 'Cevap D',
                dogru_cevap: 'B'
            }
        ];

        const ws = XLSX.utils.json_to_sheet(template);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sorular');
        XLSX.writeFile(wb, `soru_yukleme_sablonu.${format}`);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-in slide-in-from-top-4 duration-500">
                <div className="flex items-center gap-5">
                    <button
                        onClick={() => navigate('/questions')}
                        className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 hover:text-primary-600 hover:border-primary-200 hover:shadow-lg transition-all"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Toplu Soru Yükleme</h1>
                        <p className="text-slate-500 font-bold tracking-tight">Excel veya CSV ile yüzlerce soruyu anında ekleyin.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Step 1: Template */}
                <Card className="p-8 border-none shadow-xl bg-white rounded-[2.5rem] space-y-6">
                    <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center">
                        <Download size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-800">1. Şablonu İndir</h3>
                        <p className="text-sm text-slate-500 mt-2 font-medium">Verilerinizi doğru formatta yüklemek için şablon dosyalarından birini kullanın.</p>
                    </div>
                    <div className="flex flex-col gap-3">
                        <Button variant="outline" className="w-full justify-between gap-3 font-bold" onClick={() => downloadTemplate('xlsx')}>
                            <div className="flex items-center gap-2">
                                <FileSpreadsheet size={18} className="text-emerald-500" /> Excel Şablonu
                            </div>
                            <Download size={14} />
                        </Button>
                        <Button variant="outline" className="w-full justify-between gap-3 font-bold" onClick={() => downloadTemplate('csv')}>
                            <div className="flex items-center gap-2">
                                <FileText size={18} className="text-blue-500" /> CSV Şablonu
                            </div>
                            <Download size={14} />
                        </Button>
                    </div>
                </Card>

                {/* Step 2: Upload */}
                <Card className="lg:col-span-2 p-8 border-none shadow-xl bg-white rounded-[2.5rem] space-y-8">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                                    <Upload size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-800">2. Dosyayı Seç ve Yükle</h3>
                                    <p className="text-sm text-slate-500 font-medium">Dosyanızı seçerek verileri önizleyin.</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <input
                                type="file"
                                accept=".xlsx, .xls, .csv"
                                onChange={handleFileUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="border-4 border-dashed border-slate-100 rounded-[2rem] p-12 text-center space-y-4 hover:border-primary-200 hover:bg-primary-50/30 transition-all group">
                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-white transition-colors">
                                    <Upload className="text-slate-400 group-hover:text-primary-500" size={32} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-slate-600 font-black">Dosya Bırakın veya Seçin</p>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">XLSX, XLS veya CSV (Max 10MB)</p>
                                </div>
                            </div>
                        </div>

                        {fileData.length > 0 && !uploadResults && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 space-y-4">
                                <div className="flex items-center justify-between p-4 bg-primary-50 rounded-2xl border border-primary-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary-600 font-black">
                                            {fileData.length}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-primary-900">Soru Tespit Edildi</p>
                                            <p className="text-xs font-bold text-primary-600 italic">Verileri veritabanına aktarmaya hazır mısınız?</p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="primary"
                                        className="font-black px-8 py-3 rounded-xl shadow-lg shadow-primary-500/30"
                                        onClick={processUpload}
                                        isLoading={isProcessing}
                                    >
                                        Sisteme Aktar
                                    </Button>
                                </div>
                            </div>
                        )}

                        {uploadResults && (
                            <div className="space-y-6 animate-in zoom-in-95">
                                <div className={`p-6 rounded-3xl border-2 flex items-center gap-4 ${uploadResults.errors.length === 0 ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-amber-50 border-amber-100 text-amber-700'}`}>
                                    {uploadResults.errors.length === 0 ? <CheckCircle2 size={32} /> : <AlertCircle size={32} />}
                                    <div>
                                        <p className="text-lg font-black">{uploadResults.success} Soru Başarıyla Yüklendi!</p>
                                        {uploadResults.errors.length > 0 && <p className="text-sm font-bold opacity-80">{uploadResults.errors.length} hata ile tamamlandı.</p>}
                                    </div>
                                </div>

                                {uploadResults.errors.length > 0 && (
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-black text-red-400 uppercase tracking-widest pl-2">Hatalar ({uploadResults.errors.length})</h4>
                                        <div className="max-h-60 overflow-y-auto bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2 custom-scrollbar">
                                            {uploadResults.errors.map((err, i) => (
                                                <div key={i} className="flex items-center gap-3 text-red-600 text-[11px] font-bold bg-white p-2.5 rounded-xl border border-red-50">
                                                    <AlertCircle size={14} /> {err}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <Button variant="secondary" className="w-full py-4 rounded-2xl font-black" onClick={() => { setFileData([]); setUploadResults(null); }}>
                                    Yeni Dosya Yükle
                                </Button>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};
