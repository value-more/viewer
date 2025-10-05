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
                        : 'w-3'
                }
                modal={false}
                dismissable={false}
                icons={
                    <div className="mr-2 flex gap-2">
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
                }
                fullScreen
            >
                <HTMLSecViewers cik={cik} years={years} />
            </Sidebar>
        </>
    );
};
