import { Button } from 'primereact/button';
import React from 'react';
import {
    companyStatusEffects,
    companyStatusStores
} from '../../../models/company/status';
import { useUnit } from 'effector-react';
import { isWorkfowValid } from './utils';

interface ApproveButtonProps {
    prop: string;
    readonly?: boolean;
}

export const ApproveButton: React.FC<ApproveButtonProps> = ({
    prop,
    readonly
}) => {
    const status = useUnit(companyStatusStores.$status);
    const statusProp = !!status?.[prop];
    const workflowValid = isWorkfowValid(prop, status);

    return (
        <Button
            onClick={() => companyStatusEffects.toggleApprovalFx(prop)}
            size="small"
            disabled={readonly || !workflowValid || statusProp}
            severity={
                !workflowValid
                    ? 'danger'
                    : statusProp
                      ? 'success'
                      : readonly
                        ? 'warning'
                        : undefined
            }
        >
            {!workflowValid
                ? 'Previous step required'
                : statusProp
                  ? 'Approved'
                  : readonly
                    ? 'Does not meet requirement'
                    : 'Approve'}
        </Button>
    );
};
