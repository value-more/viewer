import React from 'react'
import { SelectButton } from 'primereact/selectbutton'
import { useStoreMap } from 'effector-react';
import { metricsScoresEffects, metricsScoresStores } from '../../../models/company/metricsScores';
import { InfoIcon } from '../../InfoIcon';

interface VotingSelectorProps {
    graphKey: string;
}

const items = [-2, -1, 0, 1, 2].map( k => ({ name: String(k), value: k }));

export const VotingSelector: React.FC<VotingSelectorProps> = ({ graphKey }) => {
    const value = useStoreMap(metricsScoresStores.$scores, state => state?.[graphKey]?.value)
    const timestamp = useStoreMap(metricsScoresStores.$scores, state => state?.[graphKey]?.timestamp)

    const setVal = (v : number) => metricsScoresEffects.saveScoreFx({ graphKey, value: v, timestamp: Date.now() });

    return (
        <div className='flex align-items-center'>
            <div>
                <SelectButton 
                    title={graphKey} 
                    pt={{ button: { className: "pt-1 pb-1 pl-3 pr-3 text-xs border-gray-100" } }}
                    value={value} 
                    onChange={(e) => setVal(e.value)} 
                    optionLabel="name" 
                    options={items}
                />
            </div>
            <div className='ml-2'>
                <InfoIcon editTimestamp={timestamp} />
            </div>
        </div>
    );
}   