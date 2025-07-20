import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toasts } from '../../models/toast';
import { api } from '../../api/invData';

type Inputs = {
    name: string;
    email: string;
    category: string;
    message: string;
};

const categories = [
    { label: 'feedback.categories.bug', value: 'bug' },
    { label: 'feedback.categories.suggestion', value: 'suggestion' },
    { label: 'feedback.categories.compliment', value: 'compliment' },
    { label: 'feedback.categories.question', value: 'question' }
];

interface FeedbackProps {
    onSuccess: () => void;
}

export const Feedback: React.FC<FeedbackProps> = ({ onSuccess }) => {
    const { t } = useTranslation();
    const { register, handleSubmit } = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
        await api('invData/feedbacks', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        toasts.showToast({
            severity: 'success',
            summary: t('feedback.success')
        });
        onSuccess?.();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="p-inputgroup my-3">
                <span className="p-inputgroup-addon">
                    <i className="pi pi-user"></i>
                </span>
                <input
                    {...register('name', { required: true })}
                    type="text"
                    placeholder={t('feedback.name')}
                    className="p-inputtext"
                />
            </div>
            <div className="p-inputgroup my-3">
                <span className="p-inputgroup-addon">
                    <i className="pi pi-at"></i>
                </span>
                <input
                    {...register('email', { required: true })}
                    type="email"
                    placeholder={t('feedback.email')}
                    className="p-inputtext"
                />
            </div>
            <div className="flex flex-column gap-3 my-3">
                {categories.map((c, i) => (
                    <div className="flex align-items-center" key={i}>
                        <input
                            id={`feedback-category-${c.value}`}
                            {...register('category', { required: true })}
                            value={c.value}
                            type="radio"
                            className="p-radiobutton p-component cursor-pointer"
                        />
                        <label
                            htmlFor={`feedback-category-${c.value}`}
                            className="ml-2 cursor-pointer"
                        >
                            {t(c.label)}
                        </label>
                    </div>
                ))}
            </div>
            <div className="my-3">
                <label>{t('feedback.message')}</label>
                <textarea
                    className="w-full h-12rem p-2"
                    {...register('message', { required: true })}
                    placeholder={t('feedback.messagePlaceholder')}
                ></textarea>
            </div>
            <div className="m-3 text-right">
                <button type="submit" className="p-button">
                    {t('feedback.submit')}
                </button>
            </div>
        </form>
    );
};
