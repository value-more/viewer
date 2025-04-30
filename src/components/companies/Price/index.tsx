import React, { useEffect } from 'react'
import { companyPriceEvents, companyPriceStores } from '../../../models/company/price';
import { useUnit } from 'effector-react';

interface PriceProps {
    ticker?: string;
}

export const Price: React.FC<PriceProps> = ({ ticker }) => {
    const priceData = useUnit(companyPriceStores.$priceData);
    useEffect(() => {
        if ( !ticker ) return;
        companyPriceEvents.setTicker(ticker);
    }, [ticker]);

    if ( !ticker || !priceData ) {
        return null;
    }

    return (
        <>
            <div>Last price: </div>
            <div>{priceData.price} USD</div>
        </>
    )
}