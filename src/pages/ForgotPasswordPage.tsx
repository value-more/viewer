import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { BaseLayout } from '../BaseLayout';
import { api } from '../api/invData';
import { toasts } from '../models/toast';
import { useTranslation } from 'react-i18next';

type Inputs = {
    email: string;
};

export const ForgotPasswordPage: React.FC = () => {
    const { t } = useTranslation('login');
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
        await api('invData/users/passwordforgotten', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        toasts.showToast({
            severity: 'info',
            summary: t('result.resetPasswordEmailSent')
        });
    };

    return (
        <BaseLayout>
            <div className="m-auto w-3">
                <h2 className="text-center">{t('titles.passwordForgotten')}</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="p-inputgroup my-5">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-at"></i>
                        </span>
                        <input
                            id="input-email"
                            {...register('email', {
                                required: true
                            })}
                            type="email"
                            placeholder={t('fields.email')}
                            className="p-inputtext"
                        />
                    </div>
                    <div className="text-center">
                        {errors.email && t('errors.emailRequired')}
                    </div>
                    <div className="m-3 text-center">
                        <button type="submit" className="p-button">
                            {t('buttons.sendRequestPasswordForgotten')}
                        </button>
                    </div>
                </form>
            </div>
        </BaseLayout>
    );
};
