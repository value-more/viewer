import React from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { HTMLSecViewer } from './HTMLSecViewer';

interface HTMLSecViewerProps {
    cik: number;
    years: string[];
}

export const HTMLSecViewers: React.FC<HTMLSecViewerProps> = ({
    cik,
    years
}) => {
    return (
        <TabView
            className="h-full flex flex-column"
            pt={{ panelContainer: { className: 'flex-1 m-0 p-0' } }}
            activeIndex={0}
        >
            {years.reverse().map((year) => (
                <TabPanel key={year} header={year} className="h-full w-full">
                    <HTMLSecViewer cik={cik} year={year} />
                </TabPanel>
            ))}
        </TabView>
    );
};
