import React from 'react'
import { ChartOptions, ChartSettings } from '../../types'
import { useTranslation } from 'react-i18next'
import { formatFromSymbol } from '../../../../utils/formatFromSymbol'
import { InvData } from '../../../../models/types'
import { useIsMediumScreen, useIsXLargeScreen } from '../../../../utils/breakpointsHook'

interface AdditionalDataProps {
    config: ChartOptions;
    data: InvData;
    value: ChartSettings;
}

export const AdditionalData: React.FC<AdditionalDataProps> = ({ config, value, data }) => {
    const { t, i18n: { language } } = useTranslation();
    const isMediumScreen = useIsMediumScreen();
    const isXLargeScreen = useIsXLargeScreen();

    if ( !value?.additionalData?.length ) {
        return null;
    }

    return (
        <div className={`flex-none align-self-center mt-5 xl:mt-0 ${isMediumScreen && !isXLargeScreen ? 'col-12': ''}`}>
            <div className={`border-1 p-1 border-primary-alpha ${isMediumScreen && !isXLargeScreen ? 'flex w-full' : 'ml-3'}`}>
                <div className={'text-primary m-1 font-bold'}>{t(`ticker.metrics.charts.${config.key}.additionalDataTitle`)}</div>
                <div className={isMediumScreen && !isXLargeScreen ? 'flex flex-1 justify-content-around': ''}>
                {
                    value.additionalData.map((ad, k) => (
                        <div key={k} className={`flex m-1 ${data?.metricsErrors?.some( o => o?.key === ad?.key ) ? 'text-red-500': 'text-primary'}`}>
                            <div className='mr-1'>{t(`ticker.metrics.chartsAdditionalData.${ad.key}`)}:</div>  
                            <div className='ml-auto'>{formatFromSymbol(language, ad.symbol, ad.value)}</div>
                        </div>
                    ))
                }
                </div>
            </div>
        </div>
    )
}