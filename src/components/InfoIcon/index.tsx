import React, { useState } from 'react';
import { Tooltip } from 'primereact/tooltip';
import { v4 as uuidv4 } from 'uuid';

interface InfoIconProps {
    syncTimestamp?: number;
    editTimestamp?: number;
}

export const InfoIcon: React.FC<InfoIconProps> = ({
    syncTimestamp,
    editTimestamp
}) => {
    const [cla] = useState<string>(uuidv4());
    return (
        <>
            <Tooltip target={`.c${cla}`} className="w-12rem">
                {syncTimestamp && (
                    <div className="text-sm flex align-items-center mb-1">
                        <i className="pi pi-sync mr-2"></i>
                        {new Date(syncTimestamp).toLocaleString()}
                    </div>
                )}
                {editTimestamp && (
                    <div className="text-sm flex align-items-center">
                        <i className="pi pi-pencil mr-2"></i>
                        {new Date(editTimestamp).toLocaleString()}
                    </div>
                )}
            </Tooltip>
            <i className={`pi pi-info-circle c${cla}`} />
        </>
    );
};
