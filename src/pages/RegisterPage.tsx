import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { api } from '../api/invData';
import { toasts } from '../models/toast';
import { BaseLayout } from '../BaseLayout';
import { useTranslation } from 'react-i18next';

type Inputs = {
    email: string;
    name: string;
};

export const RegisterPage: React.FC = () => {
    const { t } = useTranslation('login');
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
        await api('invData/users', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        toasts.showToast({
            severity: 'info',
            summary: t('result.confirmEmailSent')
        });
    };

    return (
        <BaseLayout>
            <div className="m-auto w-3">
                <h2 className="text-center">{t('titles.register')}</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="p-inputgroup my-3">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-at"></i>
                        </span>
                        <input
                            id="input-email"
                            {...register('email', { required: true })}
                            type="email"
                            placeholder={t('fields.email')}
                            className="p-inputtext"
                        />
                    </div>
                    <div className="p-inputgroup my-3">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-user"></i>
                        </span>
                        <input
                            id="input-name"
                            {...register('name', { required: true })}
                            type="text"
                            placeholder={t('fields.name')}
                            className="p-inputtext"
                        />
                    </div>
                    <div className="text-center">
                        {(errors.email || errors.name) && (
                            <span>{t('errors.missing')}</span>
                        )}
                    </div>
                    <div className="m-3 text-center">
                        <button type="submit" className="p-button">
                            {t('buttons.register')}
                        </button>
                    </div>
                </form>
            </div>
        </BaseLayout>
    );
};
