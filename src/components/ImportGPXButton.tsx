import React from 'react';
import './ImportGPXButton.css';

interface ImportGPXButtonProps {
    text: string;
    icon: React.ReactNode;
    onClick?: () => void;
}

export const ImportGPXButton: React.FC<ImportGPXButtonProps> = ({
    text,
    icon,
    onClick,
}) => {
    const iconWithSize = React.isValidElement(icon)
        ? React.cloneElement(icon, { size: 24 } as any)
        : icon;

    return (
        <button
            onClick={onClick}
            className="import-btn"
        >
            <span className="import-btn-icon">{iconWithSize}</span>
            <span className='import-btn-text'>{text}</span>
            <span className='import-btn-format'>.GPX</span>
        </button>
    );
};