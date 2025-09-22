import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { api } from '../../api/invData';
import { useTranslation } from 'react-i18next';
import { Checkbox } from 'primereact/checkbox';

interface PriceAlert {
    uuid: string;
    price: number;
}

export const PriceAlerts: React.FC = () => {
    const {
        t,
        i18n: { language }
    } = useTranslation();
    const [alerts, setAlerts] = useState<PriceAlert[]>([]);
    useEffect(() => {
        (async () => {
            const json = await api('invData/prices/alerts');
            setAlerts(json?.data ?? []);
        })();
    }, []);

    if (!alerts?.length) return null;

    const deleteOne = async (uuid: string) => {
        await api(`invData/prices/alerts/${uuid}`, { method: 'DELETE' });
        setAlerts(alerts.filter((a) => a.uuid !== uuid));
    };

    return (
        <>
            <DataTable value={alerts} stripedRows>
                <Column field="ticker" header={t('alerts.price.ticker')} />
                <Column
                    field="price"
                    header={t('alerts.price.price')}
                    body={({ price }) =>
                        price?.toLocaleString(language, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        }) ?? ''
                    }
                />
                <Column
                    field="type"
                    header={t('alerts.price.typeLabel')}
                    body={({ type }) => t(`alerts.price.type.${type}`)}
                    className="w-1rem"
                />
                <Column
                    field="recurrent"
                    header={t('alerts.price.recurrent')}
                    body={({ recurrent }) => (
                        <div className="flex justify-content-center">
                            <Checkbox disabled checked={recurrent} />
                        </div>
                    )}
                    className="w-1rem"
                />
                <Column
                    field="uuid"
                    body={({ uuid }) => (
                        <Button
                            icon="pi pi-trash"
                            onClick={() => deleteOne(uuid)}
                        />
                    )}
                    className="w-1rem"
                />
            </DataTable>
        </>
    );
};
