import React from 'react';
import { InputText } from 'primereact/inputtext';
// @ts-expect-error no type
import { JsonEditor as Editor } from 'jsoneditor-react';
import 'jsoneditor-react/es/editor.min.css';
import { useUnit } from 'effector-react';
import { $activeConfig, setActiveConfig } from '../state';

export const EditTestConfig: React.FC = () => {
    const activeConfig = useUnit($activeConfig) || {
        name: 'New Test',
        data: {}
    };

    return (
        <>
            <div className="mb-2">
                Name{' '}
                <InputText
                    className="w-5"
                    value={activeConfig.name}
                    onChange={(event) =>
                        setActiveConfig({
                            ...activeConfig,
                            name: event.currentTarget.value
                        })
                    }
                />
            </div>
            <div className="flex" style={{ height: 'calc(100% - 50px)' }}>
                <Editor
                    value={activeConfig.data || {}}
                    onChange={(value: object) =>
                        setActiveConfig({ ...activeConfig, data: value })
                    }
                    history={true}
                    navigationBar={true}
                    statusBar={true}
                    mode="code"
                    allowedModes={['code', 'tree', 'view', 'form', 'text']}
                    innerRef={(ref: HTMLElement) =>
                        ref?.classList?.add('flex-auto')
                    }
                />
            </div>
        </>
    );
};
