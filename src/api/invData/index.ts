import { navs } from '../../models/routes';
import { logoutFx } from '../../models/user';

export const HOST = process.env.REACT_APP_API_HOST;
export const WS_HOST = process.env.REACT_APP_WS_HOST ?? '';

export const api = async (url: string, init?: RequestInit): Promise<any> => {
    const res = await fetch(`${HOST}/${url}`, {
        ...init,
        headers: [
            ['x-token', localStorage.getItem('token') || ''],
            ['Content-Type', 'application/json']
        ]
    });

    if (res.status === 404) return null;

    if (res.status === 401) {
        logoutFx();
        navs.setNavigateTo('/login');
        return null;
    }

    if (res.status === 204) {
        return;
    }

    return res.json();
};
