import React, { useEffect, useState } from 'react';
import { api } from '../../../api/invData';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';

interface AccessLink {
    token: string;
    validUntil: string;
}

export const AccessLinks = () => {
    const [links, setLinks] = useState<AccessLink[]>([]);
    const [validUntil, setValidUntil] = useState<Date | null>();
    const [refresh, setRefresh] = useState<boolean>(true);

    useEffect(() => {
        if (!refresh) return;
        setRefresh(false);
        (async () => {
            const data = await api('invData/accesslinks');
            setLinks(data);
        })();
    }, [refresh]);

    const generate = async () => {
        await api('invData/accesslinks', {
            method: 'POST',
            body: JSON.stringify({ validUntil })
        });
        setRefresh(true);
    };

    const remove = async (token: string) => {
        await api(`invData/accesslinks/${token}`, { method: 'DELETE' });
        setRefresh(true);
    };

    return (
        <div>
            <h2>Open access</h2>
            <div className="flex justify-content-center">
                {links.map((link, i) => {
                    const url = `${window.location.origin}${process.env.PUBLIC_URL}#/login/${link.token}`;
                    return (
                        <div
                            key={i}
                            className="flex gap-3 align-items-center line-height-1 mt-2"
                        >
                            <div>
                                <a href={url}>{url}</a>
                            </div>
                            <div>
                                {link?.validUntil &&
                                    new Date(
                                        link.validUntil
                                    )?.toLocaleDateString()}
                            </div>
                            <div>
                                <Button
                                    icon="pi pi-trash"
                                    onClick={() => remove(link.token)}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
            <h2>Generate new access</h2>
            <div className="flex gap-2">
                <div>
                    <label className="mr-2">Valid until</label>
                    <Calendar
                        value={validUntil}
                        onChange={(event) => setValidUntil(event.value)}
                    />
                </div>
                <div>
                    <Button onClick={() => generate()} label="Generate" />
                </div>
            </div>
        </div>
    );
};
