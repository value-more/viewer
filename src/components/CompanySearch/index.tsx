import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/invData';
import {
    AutoComplete,
    AutoCompleteCompleteEvent
} from 'primereact/autocomplete';

interface Company {
    label: string;
    cik: number;
}

export const CompanySearch: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [companies, setCompanies] = useState<Company[]>([]);
    const [value, setValue] = useState<string>('');

    const search = async (event: AutoCompleteCompleteEvent) => {
        const data = await api(`invData/companies/search`, {
            method: 'POST',
            body: JSON.stringify({
                first: 0,
                rows: 5,
                filter: { q: event.query.toLocaleLowerCase() }
            })
        });
        setCompanies(
            (data.data || []).map(
                (c: { title: string; tickers: string[]; cik: number }) => ({
                    label: `[${c.tickers?.[0] ?? ''}] ${c.title}`,
                    cik: c.cik
                })
            )
        );
    };

    return (
        <div className="flex align-items-center relative">
            <AutoComplete
                placeholder={t('controls.companySearch')}
                field="label"
                suggestions={companies}
                value={value}
                completeMethod={search}
                onChange={(e) => setValue(e.value)}
                onSelect={(e) => {
                    setValue('');
                    navigate(`/company/${e.value.cik}`);
                }}
                autoHighlight={true}
                pt={{ input: { root: { className: 'pr-4' } } }}
            />
            {value && (
                <button
                    className="absolute cursor-pointer right-0 p-2 border-none"
                    style={{ background: 'transparent' }}
                    onClick={() => setValue('')}
                >
                    ✖
                </button>
            )}
        </div>
    );
};
