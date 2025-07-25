import React, { useEffect, useState } from 'react';
import { Answers, TranslatedValue, Question } from './types';
import { api } from '../../api/invData';
import { InputTextarea } from 'primereact/inputtextarea';
import { InfoIcon } from '../InfoIcon';
import { useTranslation } from 'react-i18next';
import { Skeleton } from 'primereact/skeleton';
import { companyStatusEffects } from '../../models/company/status';

interface QuestionsAnswersProps {
    cik: number;
    /**
     * API for questions config and answers per cik usually
     */
    apiUrls: { questions: string; answers: string };
    readonly?: boolean;
}

const timeouts: { [key: string]: any } = {};

export const QuestionsAnswers: React.FC<QuestionsAnswersProps> = ({
    cik,
    apiUrls,
    readonly
}) => {
    const {
        i18n: { language }
    } = useTranslation();
    const [questions, setQuestions] = useState<Question[] | null>(null);
    const [answers, setAnswers] = useState<Answers | null>(null);

    useEffect(() => {
        setQuestions(null);
        setAnswers(null);

        const getData = async () => {
            const res = (await api(`${apiUrls.questions}?limit=1`))?.[0];
            const q = (res?.rules?.questions || []).map(
                (v: any, i: number) => ({
                    ...v,
                    value: { de: v.value, en: res?.translations?.[i]?.en }
                })
            );
            setQuestions(q);

            const data = (await api(`${apiUrls.answers}`)).reduce(
                (
                    prev: Answers,
                    c: {
                        questionKey: string;
                        answer: TranslatedValue;
                        timestamp?: number;
                    }
                ) => {
                    prev[c.questionKey] = {
                        answer: c.answer,
                        timestamp: c.timestamp
                    };
                    return prev;
                },
                {}
            );
            setAnswers(data);
        };
        getData();
    }, [cik]);

    const save = (questionKey: string, answer: string) => {
        setAnswers({
            ...answers,
            [questionKey]: {
                answer: { de: answer, en: answer },
                timestamp: Date.now()
            }
        });

        clearTimeout(timeouts[questionKey]);
        timeouts[questionKey] = setTimeout(() => {
            (async () => {
                await api(apiUrls.answers, {
                    method: 'POST',
                    body: JSON.stringify({
                        questionKey,
                        answer
                    })
                });
                companyStatusEffects.getStatusForActiveCikFx();
            })();
        }, 750);
    };

    if (questions === null || answers === null) {
        return (
            <div className="mt-2">
                <Skeleton className="max-w-30rem h-2rem mb-3" />
                <Skeleton className="max-w-10rem mb-3" />
                <Skeleton className="max-w-20rem mb-3" />
                <Skeleton className="max-w-25rem mb-3" />
                <Skeleton className="max-w-30rem mb-3" />
            </div>
        );
    }

    return (
        <div>
            {questions.map(({ key, value }) => {
                const timestamp = answers[key]?.timestamp;
                return (
                    <div key={key} className="w-full">
                        <h4 className="flex">
                            <div>{value?.[language]}</div>
                            {!readonly && (
                                <div className="ml-auto mr-2 ">
                                    <InfoIcon editTimestamp={timestamp} />
                                </div>
                            )}
                        </h4>
                        {readonly ? (
                            <div>{answers[key]?.answer?.[language] || ''}</div>
                        ) : (
                            <InputTextarea
                                autoResize
                                name={key}
                                className="w-full"
                                onChange={(event) =>
                                    save(key, event.target.value)
                                }
                                value={answers[key]?.answer?.[language] || ''}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
};
