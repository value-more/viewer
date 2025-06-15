import React, { useEffect, useState } from 'react';
import { CompaniesList } from '../../components/CompaniesList';
import { BaseLayout } from '../../BaseLayout';
import { useTranslation } from 'react-i18next';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router';
import {
    useIsMediumScreen,
    useIsXXXLargeScreen
} from '../../utils/breakpointsHook';
import { useUserRights } from '../../models/user/hooks';

export const HomePage: React.FC = () => {
    const { t } = useTranslation();
    const [reloadFavList, setReloadFavList] = useState<number>(0);
    const urs = useUserRights();
    const navigate = useNavigate();
    const isMediumScreen = useIsMediumScreen();
    const isLargeScreen = useIsXXXLargeScreen();
    const limit = isLargeScreen ? 5 : isMediumScreen ? 4 : 3;

    useEffect(() => {
        document.title = 'ValueMore - Home';
    }, []);

    return (
        <BaseLayout title="Value More">
            <div className="flex flex-column h-full w-full">
                <div className="p-4 overflow-auto">
                    <h1>{t('home.recommendedCompanies')}</h1>
                    <div className="m-auto flex flex-column w-full overflow-auto">
                        <CompaniesList
                            filter={{ recommended: true, random: true }}
                            limit={limit}
                            onFavoritesChange={() =>
                                urs &&
                                setReloadFavList(
                                    Math.floor(Math.random() * 100000)
                                )
                            }
                        />
                    </div>
                    <Button
                        severity="secondary"
                        className="mt-3 ml-1"
                        onClick={() =>
                            navigate('/list', {
                                state: { recommended: true, random: true }
                            })
                        }
                    >
                        {t('common.showMore')}
                    </Button>
                    {urs?.['companies.favorites.edit'] && (
                        <>
                            <h1 className="mt-6">
                                {t('home.favoritesCompanies')}
                            </h1>
                            <div className="m-auto flex flex-column w-full overflow-auto">
                                <CompaniesList
                                    filter={{ favorites: true }}
                                    limit={limit}
                                    reload={reloadFavList}
                                />
                            </div>
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
                        </>
                    )}
                    <h1 className="mt-6">{t('home.randomCompanies')}</h1>
                    <div className="m-auto flex flex-column w-full overflow-auto">
                        <CompaniesList
                            limit={limit}
                            reload={reloadFavList}
                            filter={{ random: true, hasRoe: true }}
                        />
                    </div>
                </div>
                <Button
                    className="w-full mt-auto justify-content-center"
                    onClick={() => navigate('/list')}
                >
                    {t('home.allCompanies')}
                </Button>
            </div>
        </BaseLayout>
    );
};
