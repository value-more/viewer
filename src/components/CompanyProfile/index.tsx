import React from 'react';
import { useEffect, useState } from 'react';
import { api } from '../../api/invData';
import { useTranslation } from 'react-i18next';
import { InputTextarea } from 'primereact/inputtextarea';
import { toasts } from '../../models/toast';
import { InfoIcon } from '../InfoIcon';

interface CompanyProfileProps {
    cik: number;
    edit?: boolean;
}

interface Profile {
    text?: string;
    editTime?: number;
    fetchTime?: number;
}

let timeout: any = null;

export const CompanyProfile: React.FC<CompanyProfileProps> = ({
    cik,
    edit
}) => {
    const [profile, setProfile] = useState<Profile | null>(null);
    const {
        t,
        i18n: { language }
    } = useTranslation();

    useEffect(() => {
        (async () => {
            const data = await api(
                `invData/companies/${cik}/profiles?language=${language}`
            );
            setProfile(data);
        })();
    }, [cik, language]);

    const save = (value: string) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            api(`invData/companies/${cik}/profiles`, {
                method: 'POST',
                body: JSON.stringify({ text: value, language })
            }).then(() => {
                toasts.showToast({
                    severity: 'info',
                    summary: 'Company profile updated'
                });
            });
        }, 750);
        setProfile((prev) => ({ ...(prev ?? {}), text: value }));
    };

    return (
        <>
            {edit ? (
                <h3 className="bg-primary p-2 flex align-items-center">
                    <div>
                        <i className="pi pi-info mr-2" />
                        {t('ticker.profile')}
                    </div>
                    <div className="ml-auto mr-2 ">
                        <InfoIcon editTimestamp={profile?.editTime} />
                    </div>
                </h3>
            ) : (
                <h2 className="mt-0">{t('ticker.profile')}</h2>
            )}
            <div>
                {!edit || language !== 'de' ? (
                    profile?.text
                ) : (
                    <InputTextarea
                        value={profile?.text}
                        onChange={(event) => save(event.currentTarget.value)}
                        className="w-full h-20rem line-height-4"
                    />
                )}
            </div>
        </>
    );
};
