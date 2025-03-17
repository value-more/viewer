import { useUnit } from 'effector-react';
import React from 'react'
import { useTranslation } from 'react-i18next';
import { companyValuesStores } from '../../../../models/company/values';
import { CompanyValue } from '../../../../models/company/values/types';

export const CompanyValueSummary: React.FC = () => {
    const { t, i18n: { language } } = useTranslation();
    const values = useUnit(companyValuesStores.$values)?.values || [];
    
    const valuesByKey = values.reduce((prev: {[key: string]: number[]}, v: CompanyValue) => {
        Object.keys(v).forEach( (k: string) => {
            if ( !prev[k] ) prev[k] = [];
            const value: number = v[k];
            prev[k].push(value);
        });
        return prev;
    }, {});

    const keys = Object.keys(valuesByKey);

    return (
        <div className='overflow-auto'>
            <table className='m-auto'>
                <thead>
                    <tr>
                        <th></th>
                        {values.map( (_v, i) => <th key={i} className='p-1 pr-3 pl-3 text-right'>{t(`ticker.value.levels.${i}`)}</th>)}
                    </tr>
                </thead>
                <tbody>
                {keys.map( (k, ik) => {
                    return <tr key={k}>
                        <td className={`${keys.length-1 === ik ? 'font-bold': ''}`}>{t(`ticker.value.categories.${k}.title`)}</td>
                        {valuesByKey[k].map( (v, i) => (
                            <td key={`${k}_${i}`} className={`text-right p-1 pr-3 pl-3 ${keys.length-1 === ik ? 'pt-3 font-bold': ''}`}>
                                {
                                    v?.toLocaleString(language, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    })
                                }</td>
                        ))}
                    </tr>
                })}
                </tbody>
            </table>
        </div>
    )
}