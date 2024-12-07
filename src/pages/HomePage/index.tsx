import React, { useEffect } from 'react'
import { api } from '../../api/invData'
import { CompaniesList } from '../../components/CompaniesList'
import { useTranslation } from 'react-i18next';

const getCompanies = ({ opts, filter, favorites }: { opts: any, filter: any, favorites?: boolean }) => api(`invData/companies?first=${opts.first}&rows=${opts.rows}&favorites=${favorites??false}&q=${filter.toLocaleLowerCase()}`);

export const HomePage: React.FC = () => {
    const { t } = useTranslation()
    
    useEffect(() => {
        document.title = "Map of wonders";
    }, []);

    return (
        <div className="m-auto flex flex-column w-full overflow-auto">
            <h3 className="text-center">{t('home.title')}</h3>
            <CompaniesList onLoad={getCompanies} />
        </div>

    );
}
