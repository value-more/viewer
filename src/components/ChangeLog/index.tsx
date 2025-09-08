import React, { useEffect, useState } from 'react';
import { Logs } from './types';
import { Timeline } from 'primereact/timeline';
import { Card } from 'primereact/card';

const icons = {
    fix: 'pi-wrench',
    improv: 'pi-lightbulb',
    feat: 'pi-box',
    refactor: 'pi-hammer'
};

export const ChangeLog = () => {
    const [data, setData] = useState<Logs[]>([]);

    useEffect(() => {
        const getLogs = async () => {
            const res = await fetch(`/viewer/changelog.json`);
            setData(await res.json());
        };
        getLogs();
    }, []);

    if (!data?.length) return null;

    const customizedMarker = ({ list }: Logs) => {
        const counts = list.reduce(
            (prev, i) => {
                prev[i.type] = (prev[i.type] || 0) + 1;
                return prev;
            },
            {} as { [key: string]: number }
        );
        const maxKey = Object.keys(counts).reduce(
            (a, b) => (counts[a] > counts[b] ? a : b),
            'feat'
        ) as 'feat' | 'improv' | 'fix' | 'refactor';
        return (
            <span className="flex w-2rem h-2rem align-items-center justify-content-center border-circle z-1 shadow-1">
                <i className={`pi ${icons[maxKey] || 'pi-box'}`}></i>
            </span>
        );
    };

    const customizedContent = ({ version, list }: Logs) => {
        const start = new Date(
            list[list.length - 1].date * 1000
        ).toLocaleDateString();
        const end = new Date(list[0].date * 1000).toLocaleDateString();
        return (
            <Card
                title={version}
                subTitle={
                    !!list?.length && (
                        <div className="text-xs">
                            {start !== end ? `${start} ~ ${end}` : end}
                        </div>
                    )
                }
            >
                {list.map(({ message, type }, i) => {
                    const bColor =
                        type === 'refactor'
                            ? 'bg-purple-300'
                            : type === 'feat'
                              ? 'bg-blue-200'
                              : type === 'fix'
                                ? 'bg-indigo-700	'
                                : 'bg-green-200';
                    return (
                        <div key={i} className="flex align-items-center pb-2">
                            <div
                                className={`flex-none border-1 mr-2 mb-1 mt-1 p-1 text-white ${bColor} text-sm font-medium text-center`}
                                style={{ width: '58px' }}
                            >
                                {type}
                            </div>
                            <div className="text-left">{message}</div>
                        </div>
                    );
                })}
            </Card>
        );
    };

    return (
        <div className="card">
            <Timeline
                value={data}
                align="alternate"
                className="customized-timeline"
                marker={customizedMarker}
                content={customizedContent}
            />
        </div>
    );
};
