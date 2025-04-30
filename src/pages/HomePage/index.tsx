import React, { useEffect } from 'react'
import { api } from '../../api/invData'
import { CompaniesList } from '../../components/CompaniesList'
import { BaseLayout } from '../../BaseLayout';

const getCompanies = ({ opts, filter, favorites }: { opts: any, filter: any, favorites?: boolean }) => api(`invData/companies?first=${opts.first}&rows=${opts.rows}&favorites=${favorites??false}&q=${filter.toLocaleLowerCase()}`);

export const HomePage: React.FC = () => {
    useEffect(() => {
        document.title = "InvData - Home";
    }, []);

    return (
        <BaseLayout>
            <div className="m-auto flex flex-column w-full h-full overflow-auto">
                <CompaniesList onLoad={getCompanies} />
            </div>
        </BaseLayout>
    );
}
