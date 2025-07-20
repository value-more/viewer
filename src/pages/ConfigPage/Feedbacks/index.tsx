import React, { useEffect, useState } from 'react';
import { api } from '../../../api/invData';
import { Card } from 'primereact/card';
import { useTranslation } from 'react-i18next';
import { Button } from 'primereact/button';

interface Feedback {
    _id: string;
    name: string;
    email: string;
    category: string;
    message: string;
}

export const Feedbacks: React.FC = () => {
    const { t } = useTranslation();
    const [data, setData] = useState<Feedback[]>([]);
    const [refresh, setRefresh] = useState<boolean>(true);

    useEffect(() => {
        if (!refresh) return;
        setRefresh(false);
        (async () => {
            const data = await api('invData/feedbacks');
            setData(data);
        })();
    }, [refresh]);

    const remove = async (id: string) => {
        await api(`invData/feedbacks/${id}`, {
            method: 'DELETE'
        });
        setRefresh(true);
    };

    return (
        <div className="card flex justify-content-center gap-4 flex-wrap">
            {data.map(({ _id, name, email, message, category }, i) => (
                <Card
                    key={i}
                    title={name}
                    subTitle={
                        <p>
                            {email}
                            <br />
                            {t(`feedback.categories.${category}`)}
                        </p>
                    }
                    footer={
                        <div className="text-right">
                            <Button onClick={() => remove(_id)}>Remove</Button>
                        </div>
                    }
                    className="max-w-30rem"
                >
                    <p className="m-0">{message}</p>
                </Card>
            ))}
        </div>
    );
};
