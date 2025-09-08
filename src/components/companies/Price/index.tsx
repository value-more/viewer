import React from 'react';
import {
    companyPriceEffects,
    companyPriceStores
} from '../../../models/company/price';
import { useUnit } from 'effector-react';
import { Skeleton } from 'primereact/skeleton';

interface PriceProps {
    ticker?: string;
}

export const Price: React.FC<PriceProps> = ({ ticker }) => {
    const priceData = useUnit(companyPriceStores.$priceData);
    const priceFxPending = useUnit(companyPriceEffects.priceFx.pending);

    return (
        <>
            <div>Last price: </div>
            <div>
                {!ticker || priceFxPending ? (
                    <Skeleton />
                ) : (
                    <>{priceData?.price ?? '-'} USD</>
                )}
            </div>
        </>
    );
};
