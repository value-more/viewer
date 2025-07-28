import React, { useState } from 'react';
import { useUserRights } from '../../models/user/hooks';
import { CompaniesList } from '../../components/CompaniesList';
import { useTranslation } from 'react-i18next';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router';

interface CompaniesFavoritesProps {
    limit: number;
    reloadFavList: number;
}

export const CompaniesFavorites: React.FC<CompaniesFavoritesProps> = ({
    limit,
    reloadFavList
}) => {
    const { t } = useTranslation();
    const urs = useUserRights();
    const navigate = useNavigate();
    const [total, setTotal] = useState<number | null>(null);

    return (
        <>
            {urs?.['companies.favorites.edit'] && (
                <>
                    <h1 className="mt-6">{t('home.favoritesCompanies')}</h1>
                    <div className="m-auto flex flex-column w-full overflow-auto">
                        <CompaniesList
                            filter={{ favorites: true }}
                            limit={limit}
                            reload={reloadFavList}
                            onReload={({ total }) => setTotal(total)}
                        />
                    </div>
                    {!!total && (
                        <Button
                            severity="secondary"
                            className="mt-3 ml-1"
                            onClick={() =>
                                navigate('/list', {
                                    state: { favorites: true }
                                })
                            }
                        >
                            {t('common.showMore')}
                        </Button>
                    )}
                </>
            )}
        </>
    );
};
