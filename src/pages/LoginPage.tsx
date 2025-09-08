import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Navigate, useParams } from 'react-router';
import { api } from '../api/invData';
import { setUser } from '../models/user';
import { BaseLayout } from '../BaseLayout';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

type Inputs = {
    login: string;
    password: string;
};

export const LoginPage: React.FC = () => {
    const { t } = useTranslation('login');
    const [hasToken, setHasToken] = useState<boolean>(false);
    const params = useParams();

    useEffect(() => {
        document.title = 'ValueMore - Login';
    }, []);

    const storeInfo = (json: any) => {
        localStorage.setItem('token', json.token);
        const user = {
            ...json.user,
            name: json.user.name ?? json.user.login,
            rights: json.user.rights?.reduce(
                (prev: { [key: string]: boolean }, i: string) => {
                    prev[i] = true;
                    return prev;
                },
                {}
            )
        };
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        setHasToken(true);
    };

    useEffect(() => {
        if (params?.accesstoken) {
            (async () => {
                const data = await api(
                    `invData/accesslinks/${params.accesstoken}`
                );
                if (!data?.token) return;
                storeInfo(data);
            })();
        }
    }, [params]);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
        const json = await api('invData/login', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        if (json?.token) {
            storeInfo(json);
        }
    };

    if (hasToken) {
        return <Navigate to="/" />;
    }

    return (
        <BaseLayout>
            <div className="m-auto w-3">
                <h2 className="text-center">{t('titles.login')}</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="p-inputgroup my-3">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-at"></i>
                        </span>
                        <input
                            id="input-email"
                            {...register('login', { required: true })}
                            type="email"
                            placeholder={t('fields.username')}
                            className="p-inputtext"
                        />
                    </div>
                    <div className="p-inputgroup my-3">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-key"></i>
                        </span>
                        <input
                            id="input-password"
                            {...register('password', { required: true })}
                            type="password"
                            placeholder={t('fields.password')}
                            className="p-inputtext"
                        />
                    </div>
                    <div className="text-center">
                        {(errors.login || errors.password) && (
                            <span>{t('errors.missing')}</span>
                        )}
                    </div>
                    <div className="m-3 text-center">
                        <button type="submit" className="p-button">
                            {t('buttons.signIn')}
                        </button>
                    </div>
                    <div className="flex justify-content-center">
                        <NavLink to="/register" className="mr-4">
                            {t('buttons.register')}
                        </NavLink>
                        <NavLink to="/login/forgotpassword">
                            {t('buttons.forgotPassword')}
                        </NavLink>
                    </div>
                </form>
            </div>
        </BaseLayout>
    );
};
