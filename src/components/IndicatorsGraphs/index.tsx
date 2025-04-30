import React, { useEffect, useState, useRef } from 'react'
import { useUnit } from 'effector-react'
import { InvData } from '../../models/types'
import { MetricsGraph } from './MetricGraph'
import { TabPanel, TabView } from 'primereact/tabview'
import { useTranslation } from 'react-i18next'
import { MetricsScoreViewer } from '../MetricsScoreViewer'
import { api } from '../../api/invData'
import { ChartsConfig } from './types'
import { ProgressSpinner } from 'primereact/progressspinner'
import { InfoIcon } from '../InfoIcon'
import { metricsScoresStores } from '../../models/company/metricsScores';

interface IndicatorsGraphProps {
    data?: InvData;
    view?: 'endless' | 'tabs';
    includeScore?: boolean;
    withIcon?: boolean;
    readonly?: boolean;
}

export const IndicatorsGraph: React.FC<IndicatorsGraphProps> = ({ data, view = 'tabs', includeScore, withIcon, readonly }) => {
    const { t } = useTranslation();
    const [ config, setConfig ] = useState<ChartsConfig | null>(null);
    const timestampLastEdit = useUnit(metricsScoresStores.$timestampLastEdit) ?? undefined;
    const tabsRef = useRef(null);

    useEffect(() => {
        const getData = async () => {
            const data = await api(`invData/companies/metrics/charts/rules?limit=1`)
            setConfig(data?.[0]?.rules);
        }
        getData()
    }, []);
    
    const template = (key: string) => {
        if ( !config || !data ) return null;
        return config[key].map((e, i) => (
            <div
                key={i}
                className="flex justify-content-around gap-2"
                style={{ marginBottom: '75px' }}
            >
                <MetricsGraph
                    config={e}
                    data={data}
                    readonly={readonly}
                />
            </div>
        ))
    }
    
    return (
        <div>
            <h2 className={`${readonly ? '' : 'bg-primary p-2'} flex`}>
                <div>
                    {!!withIcon && (<i className='pi pi-chart-scatter mr-2' />)}{t('ticker.metrics.title')}
                </div>
                {!readonly && (<div className='ml-auto mr-2 '>
                    <InfoIcon syncTimestamp={data?.metricsTimestamp} editTimestamp={timestampLastEdit} />
                </div>)}
            </h2>
            {
                !data || !config 
                ? (<div><ProgressSpinner /></div>)
                : (<>
                    {view === 'tabs' ? (
                    <>
                        <div ref={tabsRef} className='scrollMarginTop'></div>
                        <TabView 
                            activeIndex={includeScore ? 0 : 1} 
                            pt={{ navContainer: { className: `z-4 sticky ${withIcon ? 'top-3': 'top-5'}` }}} 
                            onClick={(e) => { 
                                const css = (e.target as HTMLElement).classList.value;
                                if (css === 'p-tabview-nav-link' || css === 'p-tabview-title') {
                                    (tabsRef?.current as any)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); 
                                }
                            }}
                        >
                            {!!includeScore && (
                            <TabPanel header={t('ticker.metrics.categories.score')}>
                                <MetricsScoreViewer cik={Number(data.cik)} />
                            </TabPanel>
                            )}
                            {!!data && Object.keys(config).map( key => (
                                <TabPanel
                                    header={t(
                                        `ticker.metrics.categories.${key}`
                                    )}
                                    key={key}
                                >
                                    {template(key)}
                                </TabPanel>
                            ))}
                        </TabView>
                    </>
                    ) : (
                    <>
                        {includeScore && (<MetricsScoreViewer cik={Number(data.cik)} />)}
                        {!!data && Object.keys(config).map( key => (
                            <div key={key}>
                                <h4>{t(`ticker.metrics.categories.${key}`)}</h4>
                                {template(key)}
                            </div>
                        ))}
                    </>
                )}
                </>)
            }
        </div>
    )
}
