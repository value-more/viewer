import React from 'react';
import { BaseLayout } from '../../BaseLayout';
import { CompaniesList } from '../../components/CompaniesList';
import { useLocation } from 'react-router';

export const ListPage = () => {
    const location = useLocation();
    const { recommended, favorites, random } = location.state || {};

    return (
        <BaseLayout title="Value More">
            <div className="p-4 m-auto flex flex-column w-full h-full overflow-auto">
                <CompaniesList
                    withHeader
                    centerContent
                    view="table"
                    filter={{
                        favorites,
                        recommended,
                        random
                    }}
                />
            </div>
        </BaseLayout>
    );
};
