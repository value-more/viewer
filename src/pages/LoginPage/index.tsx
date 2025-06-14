import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Navigate } from 'react-router';
import { api } from '../../api/invData';
import { setUser } from '../../models/user';

type Inputs = {
    login: string;
    password: string;
};

export const LoginPage: React.FC = () => {
    const [hasToken, setHasToken] = useState<boolean>(false);

    useEffect(() => {
        document.title = 'InvData - Login';
    }, []);

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
        }
    };

    if (hasToken) {
        return <Navigate to="/" />;
    }

    return (
        <div className="m-auto w-3">
            <h2 className="text-center">Login form</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-column gap-2 m-3">
                    <label htmlFor="input-login">Username</label>
                    <input
                        id="input-login"
                        {...register('login', { required: true })}
                        className="p-inputtext"
                    />
                </div>
                <div className="flex flex-column gap-2 m-3">
                    <label htmlFor="input-password">Password</label>
                    <input
                        id="input-password"
                        {...register('password', { required: true })}
                        type="password"
                        className="p-inputtext"
                    />
                </div>
                <div>
                    {(errors.login || errors.password) && (
                        <span>Missing required fields</span>
                    )}
                </div>
                <div className="m-3 text-center">
                    <button type="submit" className="p-button">
                        Sign in
                    </button>
                </div>
            </form>
        </div>
    );
};
