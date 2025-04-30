import React, { useState } from 'react'
import { api } from '../../api/invData';

interface CompanyFavoriteProps {
    cik: number;
    favorite: boolean;
    size?: 'md' | 'xl';
}

export const CompanyFavorite: React.FC<CompanyFavoriteProps> = ({ cik, favorite, size }) => {
    const [fav, setFav] = useState<boolean>(favorite);

    const toggle = async ({ cik } : { cik: number }) => {
        const state = !fav;
        setFav(state);
        return api('invData/companies/favorites', {
            method: 'POST',
            body: JSON.stringify({ cik, state })
        })
    }

    return <div 
        className={`cursor-pointer pi pi-bookmark${fav ? '-fill' : ''} text-${size}`} 
        onClick={(event) => { event.stopPropagation(); toggle({ cik }) }}>
    </div>;
}