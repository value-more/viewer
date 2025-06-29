import React, { useEffect, useState } from 'react';
import { InvDataViewerTable } from './InvDataViewerTable';
import { useTranslation } from 'react-i18next';
import { Config } from './types';
import { api } from '../../api/invData';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { InfoIcon } from '../InfoIcon';
import { viewerEvents, viewerStores } from './state';
import { useUnit } from 'effector-react';
import { ApproveButton } from '../companies/CompanyStatus/ApproveButton';

interface InvDataViewerProps {
    cik: number;
    syncTimestamp?: number;
    overwriteTimestamp?: number;
    readonly?: boolean;
    withIcon?: boolean;
}

export const InvDataViewer: React.FC<InvDataViewerProps> = ({
    cik,
    syncTimestamp,
    overwriteTimestamp,
    readonly,
    withIcon
}) => {
    const { t } = useTranslation();
    const [configs, setConfigs] = useState<Config[] | undefined>();
    const indexes = useUnit(viewerStores.$indexes);

    useEffect(() => {
        const getConfig = async () => {
            const data = await api(
                `invData/companies/fundamentals/rules/display`
            );
            setConfigs(data);
        };
        getConfig();
    }, []);

    if (!configs) {
        return (
            <div className="text-center">
                <ProgressSpinner />
            </div>
        );
    }

    return (
        <div>
            <h2
                className={`${!readonly && 'bg-primary p-2'} flex scrollMarginTop`}
            >
                <div>
                    {!!withIcon && <i className="pi pi-database mr-2" />}
                    {t('ticker.fundamentals.title')}
                </div>
                {(syncTimestamp || overwriteTimestamp) && (
                    <div className="ml-auto mr-2 ">
                        <span className="mr-3">
                            <ApproveButton prop="dataApproved" readonly />
                        </span>
                        <InfoIcon
                            syncTimestamp={syncTimestamp}
                            editTimestamp={overwriteTimestamp}
                        />
                    </div>
                )}
            </h2>
            <Accordion
                multiple
                activeIndex={indexes}
                onTabChange={(event) =>
                    viewerEvents.setIndexes(
                        typeof event.index === 'number'
                            ? [event.index]
                            : event.index
                    )
                }
            >
                {configs.map((c, i) => (
                    <AccordionTab
                        key={i}
                        header={t(`ticker.fundamentals.${c.name}.title`)}
                    >
                        <InvDataViewerTable
                            cik={cik}
                            dataKey={c.name}
                            structure={c.children}
                            readonly={readonly}
                        />
                    </AccordionTab>
                ))}
            </Accordion>
        </div>
    );
};
