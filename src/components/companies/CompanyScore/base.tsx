import React from 'react';
import { Rating } from 'primereact/rating';
import { Skeleton } from 'primereact/skeleton';

interface CompanyScoreBaseProps {
    pending?: boolean;
    score?: number;
}

export const CompanyScoreBase: React.FC<CompanyScoreBaseProps> = ({
    pending,
    score
}) => {
    return (
        <div
            className={`company-score-rating flex align-items-center w-min justify-content-center border-1 p-2 ${score === undefined ? 'border-warning' : 'border-solid'}`}
        >
            {pending ? (
                <Skeleton className="w-8rem" />
            ) : (
                <>
                    <Rating
                        value={score !== undefined ? score + 2 : 0}
                        disabled
                        cancel={false}
                    />
                </>
            )}
        </div>
    );
};
