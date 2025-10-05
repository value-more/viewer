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
import { StatusWorkflow } from '../../models/company/status/types';
import { HTMLSecViewersSideBar } from '../HTMLSecViewersSideBar';

interface InvDataViewerProps {
    cik: number;
    syncTimestamp?: number;
    overwriteTimestamp?: number;
    readonly?: boolean;
    withIcon?: boolean;
    years?: string[];
}

export const InvDataViewer: React.FC<InvDataViewerProps> = ({
    cik,
    syncTimestamp,
    overwriteTimestamp,
    readonly,
    withIcon,
    years
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
    console.log(years);
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
                            <ApproveButton
                                statusKey={StatusWorkflow.DATA_APPROVED}
                                readonly
                            />
                        </span>
                        <InfoIcon
                            syncTimestamp={syncTimestamp}
                            editTimestamp={overwriteTimestamp}
                        />
                    </div>
                )}
            </h2>
            {!readonly && !!years && (
                <div className="text-right mb-2">
                    <HTMLSecViewersSideBar cik={cik} years={years} />
                </div>
            )}
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
