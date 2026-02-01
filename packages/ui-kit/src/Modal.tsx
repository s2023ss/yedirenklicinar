import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
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

    const sizes = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-4xl',
        xl: 'max-w-6xl',
    };

    return (
        <div
            className="!fixed !inset-0 z-[99999] bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300 flex items-center justify-center p-4"
            style={{ top: 0 }}
        >
            <div
                className={`bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] w-full ${sizes[size]} animate-in zoom-in-95 duration-300 border border-white/20 flex flex-col overflow-hidden`}
                style={{ maxHeight: '90vh' }}
            >
                {/* Fixed Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h3>
                    <button onClick={onClose} className="p-2.5 hover:bg-white hover:shadow-sm rounded-xl transition-all text-slate-400 hover:text-primary-600 border border-transparent hover:border-slate-100">
                        {React.createElement(X as React.FC<any>, { size: 24 })}
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
                    {children}
                </div>
            </div>
        </div>
    );
};
