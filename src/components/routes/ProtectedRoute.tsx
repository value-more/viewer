import React, { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router';
import { useUserRights } from '../../models/user/hooks';

interface ProtectedRouteProps {
    right?: string;
    children: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    right
}) => {
    const [token, setToken] = useState<string | null>();
    const urs = useUserRights();

    useEffect(() => {
        setToken(localStorage.getItem('token') || '');
    }, []);

    if (token === '') {
        return <Navigate to="/login" />;
    }

    if (right && !urs?.[right]) {
        return <Navigate to="/" />;
    }

    return <>{children}</>;
};
