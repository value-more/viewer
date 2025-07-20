import React, { useEffect, useState } from 'react';
import { api } from '../../../api/invData';
import { Card } from 'primereact/card';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { Button } from 'primereact/button';

interface User {
    uuid: string;
    name: string;
    email: string;
    resetPassword: boolean;
    confirmEmail: boolean;
}

export const Users: React.FC = () => {
    const [data, setData] = useState<User[]>([]);
    const [refresh, setRefresh] = useState<boolean>(true);

    useEffect(() => {
        if (!refresh) return;
        setRefresh(false);
        (async () => {
            const data = await api('invData/users');
            setData(data);
        })();
    }, [refresh]);

    const confirm = (event: any, uuid: string) => {
        confirmPopup({
            target: event.currentTarget,
            message: 'Are you sure you want to proceed?',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'accept',
            accept: () => remove(uuid)
        });
    };

    const remove = async (id: string) => {
        await api(`invData/users/${id}`, {
            method: 'DELETE'
        });
        setRefresh(true);
    };

    return (
        <div className="card flex justify-content-center gap-4 flex-wrap">
            <ConfirmPopup />
            {data.map(
                ({ uuid, name, email, confirmEmail, resetPassword }, i) => (
                    <Card
                        key={i}
                        title={name}
                        subTitle={
                            <>
                                <div>{email}</div>
                                <div>{uuid}</div>
                                {confirmEmail && (
                                    <div className="text-green-600">
                                        Email confirmed
                                    </div>
                                )}
                                {resetPassword && (
                                    <div className="text-orange-600">
                                        Reset password email sent
                                    </div>
                                )}
                            </>
                        }
                        footer={
                            <div className="text-right">
                                <Button
                                    onClick={(event) => confirm(event, uuid)}
                                >
                                    Remove
                                </Button>
                            </div>
                        }
                        className="max-w-30rem"
                    ></Card>
                )
            )}
        </div>
    );
};
