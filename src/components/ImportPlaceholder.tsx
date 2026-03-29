import React from 'react';
import './ImportPlaceholder.css';

interface ImportPlaceholderProps {
    icon: React.ReactNode;
    text: string;
}

export const ImportPlaceholder: React.FC<ImportPlaceholderProps> = ({ icon, text }) => {
    const iconWithSize = React.isValidElement(icon)
        ? React.cloneElement(icon, { size: 45, strokeWidth: 0.75 } as any)
        : icon;
    return (
        <div className="placeholder">
            <span className="placeholder-icon">{iconWithSize}</span>
            <span className='placeholder-text'>{text}</span>
        </div>
    );
};