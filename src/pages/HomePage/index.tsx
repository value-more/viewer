import React, { useEffect, useState } from 'react';
import { CompaniesList } from '../../components/CompaniesList';
import { BaseLayout } from '../../BaseLayout';
import { useTranslation } from 'react-i18next';

export const HomePage: React.FC = () => {
    const { t } = useTranslation();
    const [reloadFavList, setReloadFavList] = useState<number>(0);
    useEffect(() => {
        document.title = 'ValueMore - Home';
    }, []);

    return (
        <BaseLayout title="Value More">
            <div className="p-4">
                <h1>{t('home.recommendedCompanies')}</h1>
                <div className="m-auto flex flex-column w-full overflow-auto">
                    <CompaniesList
                        recommended
                        limit={3}
                        onFavoritesChange={() =>
                            setReloadFavList(Math.floor(Math.random() * 100000))
                        }
                    />
                </div>
                <h1>{t('home.favoritesCompanies')}</h1>
                <div className="m-auto flex flex-column w-full overflow-auto">
                    <CompaniesList favorites limit={3} reload={reloadFavList} />
                </div>
                <h1>{t('home.allCompanies')}</h1>
                <div className="m-auto flex flex-column w-full h-full overflow-auto">
                    <CompaniesList withHeader centerContent />
                </div>
            </div>
        </BaseLayout>
    );
};
