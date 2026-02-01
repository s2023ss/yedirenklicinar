import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, error, className = '', ...props }) => {
    return (
        <div className="w-full space-y-1.5">
            {label && (
                <label className="text-sm font-semibold text-slate-700 ml-1">
                    {label}
                </label>
            )}
            <textarea
                className={`
                    w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-xl 
                    focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 block p-3 
                    transition-all duration-200 hover:border-slate-300 shadow-sm
                    ${error ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : ''}
                    ${className}
                `}
                {...props}
            />
            {error && <p className="text-xs font-medium text-red-500 ml-1 mt-1">{error}</p>}
        </div>
    );
};
