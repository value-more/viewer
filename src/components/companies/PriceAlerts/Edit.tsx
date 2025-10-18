import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { RadioButton } from 'primereact/radiobutton';
import React, { useState } from 'react';
import { api } from '../../../api/invData';
import { toasts } from '../../../models/toast';
import { useTranslation } from 'react-i18next';
import { InputSwitch } from 'primereact/inputswitch';
import { PriceAlert } from './types';

interface EditPriceAlertProps {
    data: PriceAlert;
    onHide: (newData?: PriceAlert) => void;
    forNew?: boolean;
}

export const EditPriceAlert: React.FC<EditPriceAlertProps> = ({
    data,
    onHide,
    forNew
}) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();
    const [row, setRow] = useState<PriceAlert>(data);

    const create = async () => {
        if (!row?.price || !row?.type) return;
        await api('invData/prices/alerts', {
            method: 'POST',
            body: JSON.stringify(row)
        });
        toasts.showToast({
            severity: 'success',
            summary: `Price alert has been ${forNew ? 'created' : 'udpated'}`
        });
        onHide(row);
    };

    const add = (key: string, value: unknown) => {
        setRow({ ...row, [key]: value });
    };

    return (
        <>
            <Dialog
                closable
                visible
                header={t('alerts.price.formNew.title')}
                onHide={() => onHide()}
                footer={
                    <div className="flex gap-2 justify-content-end">
                        <Button severity="secondary" onClick={() => onHide()}>
                            {t('alerts.price.formNew.buttonCancel')}
                        </Button>
                        <Button onClick={() => create()}>
                            {t(
                                `alerts.price.formNew.${forNew ? 'buttonCreate' : 'buttonUpdate'}`
                            )}
                        </Button>
                    </div>
                }
            >
                <div className="px-4">
                    <p>{t('alerts.price.formNew.content')}</p>
                    <div className="pb-4">
                        <InputNumber
                            value={row?.price}
                            onChange={(e) => add('price', e.value)}
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
                                onChange={(e) => add('type', e.value)}
                                checked={row?.type === 'down'}
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
                                onChange={(e) => add('type', e.value)}
                                checked={row?.type === 'up'}
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
                            checked={row?.recurrent ?? false}
                            onChange={(event) => add('recurrent', event.value)}
                        />
                        <label>{t('alerts.price.recurrent')}</label>
                    </div>
                </div>
            </Dialog>
        </>
    );
};
