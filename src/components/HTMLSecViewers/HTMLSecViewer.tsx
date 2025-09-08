import React from 'react';

interface HTMLSecViewerProps {
    cik: number;
    year: string;
}

export const HTMLSecViewer: React.FC<HTMLSecViewerProps> = ({ cik, year }) => {
    return (
        <iframe
            className="w-full h-full border-none"
            src={`${process.env.REACT_APP_API_HOST}/invData/companies/${cik}/${year}/docs/sec/html`}
        ></iframe>
    );
};
