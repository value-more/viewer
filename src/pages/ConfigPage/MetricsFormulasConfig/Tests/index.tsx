import React, { useEffect, useState } from 'react';
import { api } from '../../../../api/invData';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { DataView } from 'primereact/dataview';
import { TestConfig } from './types';
import { EditTestConfig } from './EditTestConfig';
import {
    removeActiveConfigFx,
    saveActiveConfigFx,
    setActiveConfig
} from './state';
import { Results } from './Results';

interface TestsProps {
    profile: string;
}

export const Tests: React.FC<TestsProps> = ({ profile }) => {
    const [displaySidebarTestConfig, setDisplaySidebarTestConfig] =
        useState<boolean>(false);
    const [displaySidebarTestResult, setDisplaySidebarTestResult] =
        useState<boolean>(false);
    const [list, setList] = useState<TestConfig[]>([]);

    const getConfigs = async () => {
        const res = await api(`invData/companies/metrics/formulas/tests`);
        setList(res);
    };

    const save = async () => {
        await saveActiveConfigFx(undefined);
        setDisplaySidebarTestConfig(false);
        getConfigs();
    };

    const execute = async (config: TestConfig) => {
        await api(`invData/companies/metrics/formulas/testruns`, {
            method: 'POST',
            body: JSON.stringify({ id: config._id, profile })
        });
        getConfigs();
    };

    const remove = async () => {
        await removeActiveConfigFx(undefined);
        setDisplaySidebarTestConfig(false);
        getConfigs();
    };

    useEffect(() => {
        getConfigs();
    }, []);

    const itemTemplate = (item: TestConfig, index: number) => {
        const result = item.results?.[profile];
        return (
            <div className="mt-3" key={index}>
                <div className="flex gap-4 align-items-center">
                    <div>{item.name}</div>
                    <div className="ml-auto">
                        <Button
                            className="mr-2 p-2"
                            severity="help"
                            onClick={() => {
                                setActiveConfig(item);
                                setDisplaySidebarTestConfig(true);
                            }}
                        >
                            <i className="pi pi-pencil"></i>
                        </Button>
                        {result?.errors && (
                            <Button
                                className="mr-2 p-2"
                                severity="warning"
                                onClick={() => {
                                    setActiveConfig(item);
                                    setDisplaySidebarTestResult(true);
                                }}
                            >
                                <i className="pi pi-exclamation-triangle"></i>
                            </Button>
                        )}
                        <Button
                            className="p-2"
                            severity={
                                result?.pass === true
                                    ? 'success'
                                    : result?.pass === false
                                      ? 'danger'
                                      : 'secondary'
                            }
                            onClick={() => execute(item)}
                        >
                            <i className="pi pi-play"></i>
                        </Button>
                    </div>
                </div>
            </div>
        );
    };

    const listTemplate = (items: TestConfig[]) =>
        items.map((item, index) => itemTemplate(item, index));

    return (
        <>
            <h2 className="mt-0 flex align-items-center">
                <div>Tests</div>
                <Button
                    className="ml-3 h-2rem"
                    onClick={() => {
                        setActiveConfig(null);
                        setDisplaySidebarTestConfig(true);
                    }}
                >
                    Add
                </Button>
            </h2>

            <DataView value={list} listTemplate={listTemplate} />

            <Sidebar
                visible={displaySidebarTestConfig}
                position="right"
                className="w-11"
                header={
                    <div className="mt-0 flex align-items-center w-full">
                        <h2 className="m-0">Test config</h2>
                        <div className="ml-auto mr-8">
                            <Button severity="danger" onClick={() => remove()}>
                                Remove
                            </Button>
                            <Button onClick={() => save()} className="ml-8">
                                Save
                            </Button>
                            <Button
                                onClick={() => {
                                    setDisplaySidebarTestConfig(false);
                                    getConfigs();
                                }}
                                className="ml-2"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                }
                onHide={() => setDisplaySidebarTestConfig(false)}
            >
                <EditTestConfig />
            </Sidebar>

            <Sidebar
                visible={displaySidebarTestResult}
                position="right"
                className="w-11"
                header={
                    <div className="mt-0 flex align-items-center w-full">
                        <h2 className="m-0">Following issues occured</h2>
                        <div className="ml-auto mr-8">
                            <Button
                                onClick={() => {
                                    setDisplaySidebarTestResult(false);
                                }}
                                className="ml-2"
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                }
                onHide={() => setDisplaySidebarTestResult(false)}
            >
                <Results profile={profile} />
            </Sidebar>
        </>
    );
};
