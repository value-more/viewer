import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IntrinsicValueGraph } from '../../IntrinsicValueGraph';
import { useUnit } from 'effector-react';
import {
    companyValuesEffects,
    companyValuesEvents,
    companyValuesStores
} from '../../../models/company/values';
import { downloadSvg, downloadSvgAsPng } from './utils';
import { InfoIcon } from '../../InfoIcon';
import { CompanyValueSummary } from '../CompanyValue/Summary';
import { TabMenu } from 'primereact/tabmenu';
import { companyPriceStores } from '../../../models/company/price';
import { Dropdown } from 'primereact/dropdown';
import { ProgressSpinner } from 'primereact/progressspinner';
import { ApproveButton } from '../CompanyStatus/ApproveButton';

interface IntrinsicValueProps {
    ticker: string;
    displayDetails?: boolean;
    withTitle?: boolean;
    defaultLevelSelector?: boolean;
}

export const IntrinsicValue: React.FC<IntrinsicValueProps> = ({
    ticker,
    displayDetails,
    withTitle,
    defaultLevelSelector
}) => {
    const { t } = useTranslation();
    const svgRef = useRef<any>(null);
    const companyValues = useUnit(companyValuesStores.$values);
    const companyValuesFxPending = useUnit(
        companyValuesEffects.getValuesForActiveCikFx.pending
    );
    const { timestamp } = useUnit(companyValuesStores.$timestamps);
    const priceData = useUnit(companyPriceStores.$priceData);
    const level = useUnit(companyValuesStores.$level);
    const [detailsVisible, setDetailsVisible] = useState<boolean>(false);

    const areas = companyValues?.areas?.[level];
    const items = companyValues?.areas?.map((_, i) => ({
        label: t(`ticker.value.levels.${i}`),
        command: () => companyValuesEvents.setLevel(i),
        value: i
    }));

    return (
        <div>
            {!!withTitle && (
                <h2 className="bg-primary p-2 flex">
                    <div>
                        <i className="pi pi-compass mr-2" />
                        {t('ticker.intrinsicValue.title')}
                    </div>
                    <div className="ml-auto mr-2 ">
                        <span className="mr-3">
                            <ApproveButton prop="valuated" />
                        </span>
                        <InfoIcon syncTimestamp={timestamp} />
                    </div>
                </h2>
            )}
            {companyValuesFxPending ? (
                <ProgressSpinner />
            ) : (
                <>
                    <div className="flex mb-3 overflow-x-auto">
                        {!!items && (
                            <div className="flex gap-4">
                                <TabMenu
                                    activeIndex={level}
                                    model={items}
                                    pt={{ action: { className: 'bg-default' } }}
                                />
                                {!!defaultLevelSelector && (
                                    <div className="ml-4">
                                        <Dropdown
                                            options={items}
                                            value={
                                                companyValues?.preselectedLevel ??
                                                0
                                            }
                                            onChange={(event) =>
                                                companyValuesEffects.updateDefaultLevelForActiveCikFx(
                                                    {
                                                        preselectedLevel:
                                                            event.value
                                                    }
                                                )
                                            }
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                        <div className="ml-auto align-items-center flex mr-3">
                            <i
                                className="pi pi-download cursor-pointer"
                                onClick={() =>
                                    downloadSvg(
                                        svgRef.current,
                                        `${ticker}.intrinsicValue-level${level}.svg`
                                    )
                                }
                            ></i>
                            <i
                                className="ml-3 pi pi-file-import cursor-pointer"
                                onClick={() =>
                                    downloadSvgAsPng(
                                        svgRef.current,
                                        `${ticker}.intrinsicValue-level${level}.png`
                                    )
                                }
                            ></i>
                            {!!displayDetails && (
                                <i
                                    className="ml-3 pi pi-table cursor-pointer hover:text-primary"
                                    onClick={() =>
                                        setDetailsVisible(!detailsVisible)
                                    }
                                ></i>
                            )}
                        </div>
                    </div>

                    <div>
                        {
                            <IntrinsicValueGraph
                                areas={areas}
                                value={priceData?.price}
                                ref={svgRef}
                            />
                        }
                    </div>

                    {detailsVisible && <CompanyValueSummary />}
                </>
            )}
        </div>
    );
};
