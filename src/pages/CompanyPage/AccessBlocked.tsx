import React from 'react';
import { BlockUI } from 'primereact/blockui';
import { Button } from 'primereact/button';
import { Skeleton } from 'primereact/skeleton';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

export const AccessBlocked = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="p-2">
            <BlockUI
                blocked={true}
                template={
                    <i className="pi pi-lock" style={{ fontSize: '3rem' }}></i>
                }
            >
                <div className="p-4">
                    <div className="flex gap-3">
                        <Skeleton height="3rem" width="20rem" />
                        <Skeleton height="3rem" />
                    </div>

                    <Skeleton height="2rem" width="60%" className="mt-5" />
                    <Skeleton height="2rem" width="95%" className="mt-2" />

                    <Skeleton height="2rem" width="90%" className="mt-5" />
                    <Skeleton height="2rem" width="70%" className="mt-2" />

                    <Skeleton height="10rem" className="mt-5" />
                </div>
            </BlockUI>
            <div className="mt-3 flex flex-column align-items-center">
                <h3>{t('ticker.accessLimited')}</h3>
                <Button
                    label={t('menu.signin')}
                    onClick={() => navigate('/login')}
                ></Button>
            </div>
        </div>
    );
};
