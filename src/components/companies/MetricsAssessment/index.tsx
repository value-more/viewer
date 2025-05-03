import React, { useEffect } from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import { useState } from 'react';
import { api } from '../../../api/invData';
import { Divider } from 'primereact/divider';
import { toasts } from '../../../models/toast';

interface MetricsAssessmentProps {
    cik: number;
    readonly?: boolean;
}

let timeout: any = null;

export const MetricsAssessment: React.FC<MetricsAssessmentProps> = ({
    cik,
    readonly
}) => {
    const [data, setData] = useState<string>('');

    useEffect(() => {
        const getData = async () => {
            const res = (
                await api(`invdata/companies/${cik}/metrics/assessments`)
            ).value;
            setData(res);
        };
        getData();
    }, [cik]);

    const save = (value: string) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            api(`invdata/companies/${cik}/metrics/assessments`, {
                method: 'POST',
                body: JSON.stringify({ value })
            }).then(() => {
                toasts.showToast({
                    severity: 'info',
                    summary: 'Metrics assessment updated'
                });
            });
        }, 750);
        setData(data);
    };

    return (
        <div>
            {readonly ? (
                <>{data ? <div>{data}</div> : <Divider />}</>
            ) : (
                <InputTextarea
                    autoResize
                    className="w-full mt-1 h-7rem"
                    onChange={(event) => save(event.target.value)}
                    value={data}
                />
            )}
        </div>
    );
};
