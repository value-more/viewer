import { useUnit } from 'effector-react';
import React from 'react';
import { navs } from '../../models/routes';
import { Navigate } from 'react-router';

export const NavigateEffector: React.FC = () => {
    const navigateTo = useUnit(navs.$navigateTo);
    const setNavigateTo = useUnit(navs.setNavigateTo);

    if (navigateTo) {
        setNavigateTo(null);
        return <Navigate to={navigateTo} />;
    }

    return null;
};
