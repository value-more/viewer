import React from 'react';
import { useTranslation } from 'react-i18next';
import { SelectButton } from 'primereact/selectbutton';
import { moatItems, trendItems } from './constants';
import { QuestionsAnswers } from '../../QuestionsAnswers';
import { useUnit } from 'effector-react';
import {
    companyScoresEffects,
    companyScoresStores
} from '../../../models/company/scores';
import { MoatScores } from '../../../models/company/scores/types';
import { ScoreText } from '../../ScoreText';
import { InfoIcon } from '../../InfoIcon';
import { ApproveButton } from '../CompanyStatus/ApproveButton';

interface MoatProps {
    cik: number;
}

export const Moat: React.FC<MoatProps> = ({ cik }) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();
    const scores = useUnit(companyScoresStores.$scores)?.moat || {};

    const save = async ({ moat, trend }: MoatScores) => {
        const s = { ...scores };
        if (moat !== undefined) s.moat = moat;
        if (trend !== undefined) s.trend = trend;
        companyScoresEffects.saveScoresFx({ moat: s });
    };

    const iconTemplate = (option: { icon: string }) => {
        return <i className={option.icon}></i>;
    };

    return (
        <div>
            <h3 className="bg-primary p-2 scrollMarginTop flex">
                <div>
                    <i className="pi pi-chart-line mr-2" />
                    {t('ticker.moat.title')}
                </div>
                <div className="ml-auto">
                    <ApproveButton prop="moatApproved" />
                </div>
            </h3>
            <div className="flex gap-5 justify-content-end">
                <div className="align-self-center">
                    <InfoIcon editTimestamp={scores.timestamp} />
                </div>
                <div>
                    <div className="text-center">{t('ticker.moat.moat')}</div>
                    <SelectButton
                        pt={{
                            button: {
                                className:
                                    'pt-1 pb-1 pl-4 pr-4 border-gray-100 text-sm font-bold'
                            }
                        }}
                        value={scores.moat}
                        onChange={(e) => save({ moat: e.value })}
                        optionLabel="name"
                        options={moatItems}
                    />
                </div>
                <div>
                    <div className="text-center">{t('ticker.moat.trend')}</div>
                    <SelectButton
                        pt={{
                            button: {
                                className:
                                    'pt-1 pb-1 pl-4 pr-4 text-sm border-gray-100'
                            }
                        }}
                        value={scores.trend}
                        onChange={(e) => save({ trend: e.value })}
                        itemTemplate={iconTemplate}
                        options={trendItems}
                    />
                </div>
                <div className="flex flex-column">
                    <div className="text-center flex-none">
                        {t('ticker.moat.result')}
                    </div>
                    <div className="align-content-center flex-auto text-center text-xl">
                        <ScoreText value={scores.result} />
                    </div>
                </div>
            </div>
            <QuestionsAnswers
                apiUrls={{
                    questions: 'invData/companies/moat/questions',
                    answers: `invData/companies/${cik}/moat/questions/answers`
                }}
                readonly={language === 'en'}
                cik={cik}
            />
        </div>
    );
};
