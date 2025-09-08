import React from 'react';

interface ScoreTextProps {
    value?: number;
}

const colors: string[] = [
    'red-500',
    'orange-400',
    'primary',
    'green-500',
    'cyan-500'
];
const text: string[] = ['--', '-', 'O', '+', '++'];

export const ScoreText: React.FC<ScoreTextProps> = ({ value }) => {
    const color =
        value !== undefined && value !== null ? colors[value + 2] : 'primary';
    return (
        <span className={`font-bold text-${color}`}>
            {value !== undefined && value !== null ? text[value + 2] : 'none'}
        </span>
    );
};
