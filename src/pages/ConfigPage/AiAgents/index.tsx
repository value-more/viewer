import React, { useEffect, useState } from 'react';
// @ts-expect-error no type
import { JsonEditor as Editor } from 'jsoneditor-react';
import { api } from '../../../api/invData';
import { Button } from 'primereact/button';

export const AiAgents: React.FC = () => {
    const [instance, setInstance] = useState<any>();
    const setEditorInstance = (ins: any) => setInstance(ins);
    const [instanceEx, setInstanceEx] = useState<any>();
    const [data, setData] = useState<object>([]);
    const [dataEx, setDataEx] = useState<object>({});

    useEffect(() => {
        if (!instance) return;
        (async () => {
            const value = await api('invData/assistants');
            instance.jsonEditor.update(value);
            setData(value);
        })();
    }, [instance]);

    useEffect(() => {
        if (!instanceEx) return;
        (async () => {
            const value = await api('invData/companies/1652044/full');
            instanceEx.jsonEditor.update(value);
            setDataEx(value);
        })();
    }, [instanceEx]);

    const save = () => {
        api(`invData/assistants`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    };

    return (
        <div>
            <div className="ml-1 mb-1">
                Available placeholders can be used with{' '}
                <b className="text-primary">{'${placeholderName}'}</b>. For
                object to string it is required to use the function
                <b className="text-primary">{' ${json(placeholderName)}'}</b>.
                Use the example bellow for the variables.
            </div>
            <div className="flex h-27rem w-full">
                <Editor
                    ref={setEditorInstance}
                    value={data}
                    onChange={(value: object) => {
                        setData(value);
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
            <div className="flex h-27rem w-full flex-column">
                <div>Example:</div>

                <Editor
                    ref={setInstanceEx}
                    value={dataEx}
                    mode="view"
                    navigationBar={true}
                    statusBar={true}
                    allowedModes={['view']}
                    innerRef={(ref: HTMLElement) =>
                        ref?.classList?.add('flex-auto')
                    }
                />
            </div>
        </div>
    );
};
