import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Sidebar } from 'primereact/sidebar';
import { HTMLSecViewerProps, HTMLSecViewers } from '../HTMLSecViewers';

type HTMLSecViewerPosType = 'left' | 'right' | 'bottom' | 'top';

export const HTMLSecViewersSideBar: React.FC<HTMLSecViewerProps> = ({
    cik,
    years
}) => {
    const [isVisibleHTMLSecViewer, setIsVisibleHTMLSecViewer] =
        useState<boolean>(false);
    const [HTMLSecViewerPos, setHTMLSecViewerPos] =
        useState<HTMLSecViewerPosType>(
            (localStorage.getItem(
                'HTMLSecViewerPos'
            ) as HTMLSecViewerPosType) || 'left'
        );

    const changeHTMLSecViewerPos = (newPos: HTMLSecViewerPosType) => {
        localStorage.setItem('HTMLSecViewerPos', newPos);
        setHTMLSecViewerPos(newPos);
    };

    return (
        <>
            <Button onClick={() => setIsVisibleHTMLSecViewer(true)}>
                SEC htmls
            </Button>
            <Sidebar
                visible={isVisibleHTMLSecViewer}
                onHide={() => setIsVisibleHTMLSecViewer(false)}
                position={HTMLSecViewerPos}
                className={
                    HTMLSecViewerPos === 'bottom' || HTMLSecViewerPos === 'top'
                        ? 'h-20rem'
                        : 'w-4'
                }
                modal={false}
                dismissable={false}
                fullScreen
                content={() => {
                    return (
                        <div className="flex w-full h-full">
                            <div style={{ width: 'calc(100% - 35px)' }}>
                                <HTMLSecViewers cik={cik} years={years} />
                            </div>
                            <div className="flex gap-2 flex-column flex-0">
                                <Button
                                    onClick={() =>
                                        setIsVisibleHTMLSecViewer(false)
                                    }
                                    text
                                    icon="pi pi-times"
                                />
                                <Button
                                    icon="pi pi-arrows-v"
                                    onClick={() =>
                                        changeHTMLSecViewerPos(
                                            HTMLSecViewerPos === 'bottom'
                                                ? 'top'
                                                : 'bottom'
                                        )
                                    }
                                />
                                <Button
                                    icon="pi pi-arrows-h"
                                    onClick={() =>
                                        changeHTMLSecViewerPos(
                                            HTMLSecViewerPos === 'left'
                                                ? 'right'
                                                : 'left'
                                        )
                                    }
                                />
                            </div>
                        </div>
                    );
                }}
            ></Sidebar>
        </>
    );
};
