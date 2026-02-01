import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, title, children }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const CloseIcon = X as any;

    return createPortal(
        <div className="fixed inset-0 z-[99999] flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-500"
                onClick={onClose}
            />

            {/* Drawer Content */}
            <div className="relative w-full max-w-2xl bg-white h-full shadow-[-20px_0_60px_-15px_rgba(0,0,0,0.3)] flex flex-col animate-in slide-in-from-right duration-500 border-l border-white/20">
                {/* Header */}
                <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
                    <div>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-none">{title}</h3>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse"></div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Soru Oluşturma Sihirbazı</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3.5 hover:bg-slate-50 rounded-2xl transition-all text-slate-400 hover:text-primary-600 border border-transparent hover:border-slate-100"
                    >
                        <CloseIcon size={28} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-[#fcfdfe]">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    ) as any;
};
