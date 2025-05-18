import React from 'react';
import { useTranslation } from 'react-i18next';
import { useUnit } from 'effector-react';
import {
    companyScoresEffects,
    companyScoresStores
} from '../../../models/company/scores';
import { Tooltip } from 'primereact/tooltip';
import { companyValuesStores } from '../../../models/company/values';
import { CompanyScoreBase } from './base';

interface CompanyScoreProps {
    withTooltip?: boolean;
}

export const CompanyScore: React.FC<CompanyScoreProps> = ({ withTooltip }) => {
    const { t } = useTranslation();
    const scoreData = useUnit(companyScoresStores.$scores);
    const valuation = useUnit(companyValuesStores.$values);
    const scoreFxPending = useUnit(
        companyScoresEffects.getScoresForActiveCikFx.pending
    );
    const score = scoreData?.score ?? undefined;

    const itemTemplate = ({
        label,
        value
    }: {
        label: string;
        value?: number;
    }) => (
        <div>
            <i
                className={`mr-2 pi ${value === undefined ? 'pi-times-circle' : 'pi-check-circle'}`}
            />
            {t(`${label}`)}
        </div>
    );

    return (
        <>
            <CompanyScoreBase score={score} pending={scoreFxPending} />
            {withTooltip && (
                <Tooltip target=".company-score-rating" position="bottom">
                    {itemTemplate({
                        label: 'ticker.metrics.title',
                        value: scoreData?.fundamentals
                    })}
                    {itemTemplate({
                        label: 'ticker.businessmodel.title',
                        value: scoreData?.businessModel?.val
                    })}
                    {itemTemplate({
                        label: 'ticker.moat.title',
                        value: scoreData?.moat?.result
                    })}
                    {itemTemplate({
                        label: 'ticker.value.title',
                        value: valuation?.areas?.length
                    })}
                </Tooltip>
            )}
        </>
    );
};
