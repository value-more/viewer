import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import React, { useState } from 'react';

interface SmartSearchProps {
    onSubmit: (search: string) => void;
}

export const SmartSearch: React.FC<SmartSearchProps> = ({ onSubmit }) => {
    const [value, setValue] = useState<string>('');
    return (
        <div className="p-inputgroup flex-1">
            <Button icon="pi pi-search" onClick={() => onSubmit(value)} />
            <InputText
                value={value}
                placeholder="Tell us what you are looking for"
                onChange={(event) => setValue(event.currentTarget.value)}
                onKeyDown={(event) => event.key === 'Enter' && onSubmit(value)}
            />
        </div>
    );
};
