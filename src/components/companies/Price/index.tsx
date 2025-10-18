import React, { useState } from 'react';
import {
    companyPriceEffects,
    companyPriceStores
} from '../../../models/company/price';
import { useUnit } from 'effector-react';
import { Skeleton } from 'primereact/skeleton';
import { NewPriceAlert } from '../NewPriceAlert';
import { useUserRights } from '../../../models/user/hooks';
import { useTranslation } from 'react-i18next';

interface PriceProps {
    cik: number;
    ticker?: string;
}

export const Price: React.FC<PriceProps> = ({ cik, ticker }) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();
    const priceData = useUnit(companyPriceStores.$priceData);
    const priceFxPending = useUnit(companyPriceEffects.priceFx.pending);
    const userRights = useUserRights();
    const [visibleNewPriceAlert, setVisibleNewPriceAlert] =
        useState<boolean>(false);

    return (
        <>
            <div className="col-3 flex align-items-center gap-3 p-0 mt-1 line-height-2">
                <div>
                    <i
                        className={`pi pi-bell text-xl ${userRights?.['prices.alerts'] ? 'cursor-pointer' : ''}`}
                        onClick={() =>
                            userRights?.['prices.alerts'] &&
                            setVisibleNewPriceAlert(true)
                        }
                    />
                </div>
                <div className="text-xs">
                    <div>{t('ticker.lastprice')}</div>
                    <div>
                        {!ticker || priceFxPending ? (
                            <Skeleton />
                        ) : (
                            <>
                                {priceData?.price?.toLocaleString?.(language, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                }) ?? '-'}{' '}
                                USD
                            </>
                        )}
                    </div>
                </div>
            </div>
            {ticker && visibleNewPriceAlert && (
                <NewPriceAlert
                    cik={cik}
                    ticker={ticker}
                    onHide={() => setVisibleNewPriceAlert(false)}
                />
            )}
        </>
    );
};
