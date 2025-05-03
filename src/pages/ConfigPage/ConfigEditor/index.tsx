import React, { useEffect, useState } from 'react';
import { api } from '../../../api/invData';
// @ts-expect-error no type
import { JsonEditor as Editor } from 'jsoneditor-react';
import 'jsoneditor-react/es/editor.min.css';
import { Button } from 'primereact/button';

interface ConfigEditorProps {
    endpoint: string;
    profile?: string;
}

export const ConfigEditor: React.FC<ConfigEditorProps> = ({
    endpoint,
    profile
}) => {
    const [rules, setRules] = useState<object>();
    const [instance, setInstance] = useState<any>();
    const setEditorInstance = (ins: any) => setInstance(ins);

    useEffect(() => {
        const getConfigs = async () => {
            const value = await api(
                `invData/${endpoint}?limit=1${profile ? `&profile=${profile}` : ''}`
            );
            const r = value?.[0]?.rules || {};
            setRules(r);
            instance?.jsonEditor?.set(r);
        };
        getConfigs();
    }, [profile]);

    if (!rules) return null;

    const save = () => {
        api(`invData/${endpoint}`, {
            method: 'POST',
            body: JSON.stringify({ rules, profile })
        });
    };

    return (
        <>
            <div className="flex h-27rem w-full">
                <Editor
                    ref={setEditorInstance}
                    value={rules}
                    onChange={(value: object) => {
                        setRules(value);
                    }}
                    history={true}
                    navigationBar={true}
                    statusBar={true}
                    allowedModes={['tree', 'view', 'form', 'code', 'text']}
                    innerRef={(ref: HTMLElement) =>
                        ref?.classList?.add('flex-auto')
                    }
                />
            </div>
            <div className="mt-2 mb-3 text-center">
                <Button label="Save" onClick={save} />
            </div>
        </>
    );
};
