import React from 'react';
import { EditPriceAlert } from './Edit';

interface NewPriceAlertProps {
    cik: number;
    ticker: string;
    onHide: () => void;
}

export const NewPriceAlert: React.FC<NewPriceAlertProps> = ({
    cik,
    ticker,
    onHide
}) => <EditPriceAlert onHide={onHide} data={{ cik, ticker }} forNew />;
