import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    onClick?: () => void;
    style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, onClick, style }) => {
    return (
        <div
            className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden ${className}`}
            onClick={onClick}
            style={style}
        >
            {title && (
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                </div>
            )}
            <div className="p-6">{children}</div>
        </div>
    );
};
