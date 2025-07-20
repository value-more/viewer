import { FloatLabel } from 'primereact/floatlabel';
import { useDebounce } from 'primereact/hooks';
import { InputText } from 'primereact/inputtext';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface SearchProps {
    onChange: (value: string | null) => void;
}

export const Search: React.FC<SearchProps> = ({ onChange }) => {
    const { t } = useTranslation();
    const [, search, setSearch] = useDebounce<string | null>(null, 400);

    useEffect(() => {
        onChange(search);
    }, [search]);

    return (
        <FloatLabel>
            <InputText onChange={(event) => setSearch(event.target.value)} />
            <label>{t('controls.search')}</label>
        </FloatLabel>
    );
};
