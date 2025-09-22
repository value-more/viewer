import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { RadioButton } from 'primereact/radiobutton';
import React, { useState } from 'react';
import { api } from '../../../api/invData';
import { toasts } from '../../../models/toast';
import { useTranslation } from 'react-i18next';
import { InputSwitch } from 'primereact/inputswitch';

interface NewPriceAlertProps {
    cik: number;
    ticker: string;
    onHide: () => void;
}

export const NewPriceAlert: React.FC<NewPriceAlertProps> = ({
    cik,
    ticker,
    onHide
}) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();
    const [type, setType] = useState<'up' | 'down'>('down');
    const [price, setPrice] = useState<number | null>(null);
    const [recurrent, setRecurrent] = useState<boolean>(false);

    const create = async () => {
        if (!price || !type) return;
        await api('invData/prices/alerts', {
            method: 'POST',
            body: JSON.stringify({
                cik,
                type,
                price,
                ticker,
                recurrent
            })
        });
        toasts.showToast({
            severity: 'success',
            summary: 'Price alert has been created'
        });
        onHide();
    };

    return (
        <>
            <Dialog
                closable
                visible
                header={t('alerts.price.formNew.title')}
                onHide={onHide}
                footer={
                    <div className="flex gap-2 justify-content-end">
                        <Button severity="secondary" onClick={() => onHide()}>
                            {t('alerts.price.formNew.buttonCancel')}
                        </Button>
                        <Button onClick={() => create()}>
                            {t('alerts.price.formNew.buttonCreate')}
                        </Button>
                    </div>
                }
            >
                <div className="px-4">
                    <p>{t('alerts.price.formNew.content')}</p>
                    <div className="pb-4">
                        <InputNumber
                            value={price}
                            onChange={(e) => setPrice(e.value)}
                            locale={language}
                            maxFractionDigits={2}
                        />
                    </div>
                    <div className="flex flex-wrap gap-3 pb-4">
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="price-alert-type-below"
                                name="price-alert-type"
                                value="down"
                                onChange={(e) => setType(e.value)}
                                checked={type === 'down'}
                            />
                            <label
                                htmlFor="price-alert-type-below"
                                className="ml-2"
                            >
                                {t('alerts.price.type.down')}
                            </label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="price-alert-type-above"
                                name="price-alert-type"
                                value="up"
                                onChange={(e) => setType(e.value)}
                                checked={type === 'up'}
                            />
                            <label
                                htmlFor="price-alert-type-above"
                                className="ml-2"
                            >
                                {t('alerts.price.type.up')}
                            </label>
                        </div>
                    </div>
                    <div className="flex align-items-center gap-2 pb-4">
                        <InputSwitch
                            checked={recurrent}
                            onChange={(event) => setRecurrent(event.value)}
                        />
                        <label>{t('alerts.price.recurrent')}</label>
                    </div>
                </div>
            </Dialog>
        </>
    );
};
