import React, { useEffect, useState } from 'react';
import { api } from '../../../../api/invData';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { ProgressSpinner } from 'primereact/progressspinner';

interface DetailedFormulaProps {
    profile: string;
}

export const DetailedFormula: React.FC<DetailedFormulaProps> = ({
    profile
}) => {
    const [data, setData] = useState<any>();

    useEffect(() => {
        (async () => {
            const res = await api(
                `invData/companies/metrics/formulas/details/${profile}`
            );
            setData(res);
        })();
    }, [profile]);

    if (!data) {
        return <ProgressSpinner />;
    }

    const renderMetrics = (metrics: any) => {
        return Object.keys(metrics).map((key) => (
            <div key={key}>
                <h4>{key}</h4>
                <ul>
                    {metrics[key].map((item: string, i: number) => (
                        <li key={i}>
                            <pre>{item}</pre>
                        </li>
                    ))}
                </ul>
            </div>
        ));
    };

    return (
        <Accordion>
            <AccordionTab header="Global metrics" className="overflow-auto">
                {data.metrics && renderMetrics(data.metrics)}
            </AccordionTab>
            <AccordionTab header="Yearly metrics">
                {data.year?.metrics && renderMetrics(data.year.metrics)}
            </AccordionTab>
        </Accordion>
    );
};
