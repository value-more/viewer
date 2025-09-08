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
import { CompaniesFavorites } from './CompaniesFavorites';

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
                    <CompaniesFavorites
                        limit={limit}
                        reloadFavList={reloadFavList}
                    />
                    {!urs && (
                        <>
                            <h1 className="mt-6">
                                {t('home.lastVisitedCompanies')}
                            </h1>
                            <div className="m-auto flex flex-column w-full overflow-auto">
                                <CompaniesList
                                    limit={limit}
                                    reload={reloadFavList}
                                    filter={{
                                        lastVisited: true
                                    }}
                                />
                            </div>
                        </>
                    )}
                    <h1 className="mt-6">{t('home.discoverMore')}</h1>
                    <div className="m-auto flex flex-column w-full overflow-auto">
                        <CompaniesList
                            limit={limit}
                            reload={reloadFavList}
                            filter={{
                                recommendedDiscovery: true,
                                random: true
                            }}
                        />
                    </div>
                </div>
                <Button
                    className="m-auto justify-content-center mb-3 mt-4 shadow-6 px-6"
                    size="large"
                    onClick={() => navigate('/list')}
                >
                    {t('home.allCompanies')}
                </Button>
            </div>
        </BaseLayout>
    );
};
