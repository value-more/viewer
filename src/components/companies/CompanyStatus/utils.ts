import { useUnit } from 'effector-react';
import { CompanyStatus } from '../../../models/company/status/types';
import { companyStatusStores } from '../../../models/company/status';

export const workflows = [
    'companyProfilValid',
    'dataApproved',
    'diagramsApproved',
    'businessModelApproved',
    'moatApproved',
    'valuated',
    'assessed'
];

export const isWorkfowValid = (prop: string, status: CompanyStatus | null) => {
    if (!status) return false;
    const until = workflows.indexOf(prop) - 1;
    for (let i = 0; i < until; ++i) {
        if (!status[workflows[i]]) return false;
    }
    return true;
};

export const useStatusFromWorkflow = (): string => {
    const status = useUnit(companyStatusStores.$status);
    if (!status) return 'initial';
    for (let i = 0; i < workflows.length; ++i) {
        if (!status[workflows[i]]) {
            return workflows[i - 1] ?? 'initial';
        }
    }
    return workflows[workflows.length - 1];
};
