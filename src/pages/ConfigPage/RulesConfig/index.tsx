import React from 'react';
import { ConfigEditor } from '../ConfigEditor';

export const RulesConfig: React.FC = () => {
    return (
        <>
            <ConfigEditor endpoint="companies/fundamentals/rules" />
        </>
    );
};
