import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { useTranslation } from 'react-i18next';
import { Checkbox } from 'primereact/checkbox';
import { api } from '../../../api/invData';
import { EditPriceAlert } from './Edit';
import { PriceAlert } from './types';
import { useNavigate } from 'react-router';

export const PriceAlerts: React.FC = () => {
    const {
        t,
        i18n: { language }
    } = useTranslation();
    const navigate = useNavigate();
    const [alerts, setAlerts] = useState<PriceAlert[]>([]);
    const [edit, setEdit] = useState<PriceAlert | null>(null);

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
            <DataTable
                value={alerts}
                stripedRows
                pt={{ wrapper: { style: { overflow: 'hidden' } } }}
            >
                <Column
                    field="ticker"
                    header={t('alerts.price.ticker')}
                    body={({ cik, ticker }) => (
                        <div
                            onClick={() => navigate(`/company/${cik}`)}
                            className="cursor-pointer"
                        >
                            {ticker}
                        </div>
                    )}
                />
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
                    body={(row) => (
                        <Button
                            icon="pi pi-pencil"
                            onClick={() => setEdit(row)}
                        />
                    )}
                    className="p-1 w-1rem"
                />
                <Column
                    field="uuid"
                    body={({ uuid }) => (
                        <Button
                            icon="pi pi-trash"
                            onClick={() => deleteOne(uuid)}
                        />
                    )}
                    className="p-1 w-1rem"
                />
            </DataTable>
            {!!edit && (
                <EditPriceAlert
                    data={edit}
                    onHide={(row) => {
                        if (row) {
                            const alert = alerts.find(
                                (a) => a.uuid === edit.uuid
                            );
                            if (alert) {
                                alert.price = row.price;
                                alert.recurrent = row.recurrent;
                                alert.type = row.type;
                            }
                        }
                        setEdit(null);
                    }}
                />
            )}
        </>
    );
};
