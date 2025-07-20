import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Navigate, useNavigate, useParams } from 'react-router';
import { api } from '../api/invData';
import { BaseLayout } from '../BaseLayout';
import { useTranslation } from 'react-i18next';

type Inputs = {
    password: string;
    confirmPassword: string;
};

export const ResetPasswordPage: React.FC = () => {
    const params = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation('login');

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
        await api('invData/users/password', {
            method: 'PUT',
            body: JSON.stringify({
                password: data.password,
                token: params.token
            })
        });
        navigate({ pathname: '/login' });
    };

    const password = watch('password');

    if (!params.token) {
        return <Navigate to="/" />;
    }

    return (
        <BaseLayout>
            <div className="m-auto w-3">
                <h2 className="text-center">{t('titles.resetPassword')}</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-column gap-2 m-3">
                        <label htmlFor="input-password">
                            {t('fields.newPassword')}
                        </label>
                        <input
                            id="input-password"
                            {...register('password', {
                                required: t('errors.passwordRequired')
                            })}
                            type="password"
                            className="p-inputtext"
                        />
                    </div>
                    <div className="flex flex-column gap-2 m-3">
                        <label htmlFor="input-confirmPassword">
                            {t('fields.confirmPassword')}
                        </label>
                        <input
                            id="input-confirmPassword"
                            {...register('confirmPassword', {
                                required: t('errors.confirmPasswordRequired'),
                                validate: (value) =>
                                    value === password ||
                                    t('errors.passwordNotMatch')
                            })}
                            type="password"
                            className="p-inputtext"
                        />
                    </div>
                    <div className="text-center">
                        {errors.password && (
                            <div>{errors.password.message}</div>
                        )}
                        {errors.confirmPassword && (
                            <div>{errors.confirmPassword.message}</div>
                        )}
                    </div>
                    <div className="m-3 text-center">
                        <button type="submit" className="p-button">
                            {t('buttons.updatePassword')}
                        </button>
                    </div>
                </form>
            </div>
        </BaseLayout>
    );
};
