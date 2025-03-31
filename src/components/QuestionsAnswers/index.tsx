import React, { useEffect, useState } from 'react'
import { Question } from './types';
import { api } from '../../api/invData';
import { InputTextarea } from 'primereact/inputtextarea';
import { InfoIcon } from '../InfoIcon';

interface QuestionsAnswersProps {
    /**
     * API for questions config and answers per cik usually
     */
    apiUrls: { questions: string; answers: string };
    readonly?: boolean;
}

const timeouts: {[key: string]: any} = {};

export const QuestionsAnswers: React.FC<QuestionsAnswersProps> = ({ apiUrls, readonly }) => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [answers, setAnswers] = useState<{[key: string]: { answer: string; timestamp?: number; }}>({});

    useEffect(() => {
        const getData = async () => {
            const res = (await api(`${apiUrls.questions}?limit=1`))?.[0]?.rules?.questions || [];
            setQuestions(res);

            const data = (await api(apiUrls.answers))
                    .reduce((prev: {[key: string]: { answer: string; timestamp?: number; }}, c: { questionKey: string, answer: string, timestamp?: number; }) => {
                        prev[c.questionKey] = { answer: c.answer, timestamp: c.timestamp };
                        return prev;
                    }, {});
            setAnswers(data);
        }
        getData();
    }, []);
    
    const save = (questionKey: string, answer: string) => {
        setAnswers({ ...answers, [questionKey]: { answer, timestamp: Date.now() } });

        clearTimeout(timeouts[questionKey]);
        timeouts[questionKey] = setTimeout(() => {
            api(apiUrls.answers, {
                method: 'POST',
                body: JSON.stringify({
                    questionKey, answer
                })
            });
        }, 750 );
    }

    return (
        <div>
            {
                questions.map( ({ key, value }) => {
                    const timestamp = answers[key]?.timestamp;
                    return (
                    <div key={key} className='w-full'>
                        <h4 className="flex">
                            <div>{value}</div>
                            {!readonly && (<div className='ml-auto mr-2 '>
                                <InfoIcon editTimestamp={timestamp} />
                            </div>)}
                        </h4>
                        {
                            readonly ? 
                            (<div>{answers[key]?.answer || ''}</div>) : 
                            (
                            <InputTextarea 
                                autoResize 
                                name={key} 
                                className='w-full' 
                                onChange={event => save(key, event.target.value)} 
                                value={answers[key]?.answer || ''}
                            />
                            )
                        }
                    </div>
                ) } )
            }
        </div>
    );
}