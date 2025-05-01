import React from 'react'
import { useUnit } from 'effector-react'
import { companyScoresStores } from '../../../models/company/scores'
import { Rating } from 'primereact/rating'

export const CompanyScore: React.FC = () => {
    const score = useUnit(companyScoresStores.$scores)?.score ?? undefined
    return (
        <div
            className={`flex align-items-center justify-content-center border-1 p-2 ${score === undefined ? 'border-warning' : 'border-solid'}`}
        >
            <Rating
                value={score !== undefined ? score + 2 : 0}
                disabled
                cancel={false}
            />
        </div>
    )
}
