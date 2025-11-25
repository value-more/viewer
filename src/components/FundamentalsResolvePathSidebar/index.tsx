import { Button } from 'primereact/button';
import { Sidebar } from 'primereact/sidebar';
import React, { useState } from 'react';
import { api } from '../../api/invData';

interface FundamentalsResolvePathSidebarProps {
    cik: number;
}

interface PathHistoryItem {
    year: number;
    category: string;
    key: string;
    ruleEntry: string;
    ai?: boolean;
    confidence?: number;
}

type PathHistoryItemByKey = {
    [category: string]: { [key: string]: PathHistoryItem[] };
};

export const FundamentalsResolvePathSidebar: React.FC<
    FundamentalsResolvePathSidebarProps
> = ({ cik }) => {
    const [conf, setConf] = useState<PathHistoryItemByKey | null>(null);
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const load = async () => {
        setLoading(true);
        const json = await api(
            `invData/companies/${cik}/fundamentals/rules/paths`
        );
        setConf(
            json.reduce((prev: PathHistoryItemByKey, e: PathHistoryItem) => {
                if (!prev[e.category]) prev[e.category] = {};
                if (!prev[e.category][e.key]) prev[e.category][e.key] = [];
                prev[e.category][e.key].push(e);
                return prev;
            }, {} as PathHistoryItemByKey)
        );
        setIsVisible(true);
        setLoading(false);
    };

    const renderPath = (arr: PathHistoryItem[]) => {
        return (
            <div className="flex flex-column flex-wrap">
                {arr
                    .sort((a, b) => a.year - b.year)
                    .filter((e) => !!e.ruleEntry)
                    .map((e) => (
                        <div key={e.year} style={{ overflowWrap: 'anywhere' }}>
                            {e.year}
                            <span className="font-bold">
                                {e.ai
                                    ? ` [AI${e.confidence !== undefined ? ': ' + e.confidence : ''}]`
                                    : ''}
                            </span>
                            : {e.ruleEntry}
                        </div>
                    ))}
            </div>
        );
    };

    return (
        <>
            <Button onClick={() => load()} loading={loading}>
                View resolution path
            </Button>
            {conf && isVisible && (
                <Sidebar
                    visible={isVisible}
                    onHide={() => setIsVisible(false)}
                    position="right"
                    className="w-4"
                    modal={false}
                    content={() => {
                        return (
                            <div className="w-full h-full p-2 overflow-auto">
                                {Object.entries(conf).map(
                                    ([category, entries]) => (
                                        <div key={category}>
                                            <h3 className="m-1">{category}</h3>
                                            <div>
                                                {Object.entries(entries).map(
                                                    ([key, arr]) => (
                                                        <div key={key}>
                                                            <h4 className="m-1">
                                                                {key}
                                                            </h4>
                                                            {renderPath(arr)}
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        );
                    }}
                ></Sidebar>
            )}
        </>
    );
};
