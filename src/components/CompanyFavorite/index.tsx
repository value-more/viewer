import React, { useEffect, useState } from 'react';
import { api } from '../../api/invData';

interface CompanyFavoriteProps {
    cik: number;
    favorite: boolean;
    size?: 'md' | 'xl';
    onFavoriteChange?: (opts: { cik: number; state: boolean }) => void;
}

export const CompanyFavorite: React.FC<CompanyFavoriteProps> = ({
    cik,
    favorite,
    size,
    onFavoriteChange
}) => {
    const [fav, setFav] = useState<boolean>(favorite);

    useEffect(() => {
        setFav(favorite);
    }, [cik, favorite]);

    const toggle = async ({ cik }: { cik: number }) => {
        const state = !fav;
        setFav(state);
        await api('invData/companies/favorites', {
            method: 'POST',
            body: JSON.stringify({ cik, state })
        });
        onFavoriteChange?.({ cik, state });
    };

    return (
        <div
            className={`cursor-pointer pi pi-bookmark${fav ? '-fill' : ''} text-${size}`}
            onClick={(event) => {
                event.stopPropagation();
                toggle({ cik });
            }}
        ></div>
    );
};
