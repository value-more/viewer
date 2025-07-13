import { Button } from 'primereact/button';
import React from 'react';
import {
    companyStatusEffects,
    companyStatusStores
} from '../../../models/company/status';
import { useUnit } from 'effector-react';
import {
    StatusWorkflow,
    workflows
} from '../../../models/company/status/types';

interface ApproveButtonProps {
    statusKey: StatusWorkflow;
    readonly?: boolean;
}

export const ApproveButton: React.FC<ApproveButtonProps> = ({
    statusKey,
    readonly
}) => {
    const status = useUnit(companyStatusStores.$status);
    const approved =
        !!status?.index && status.index >= workflows.indexOf(statusKey);
    const isNextTransition =
        !!status?.index && workflows[status.index + 1] === statusKey;

    return (
        <Button
            onClick={() => companyStatusEffects.toggleApprovalFx(statusKey)}
            size="small"
            disabled={readonly || !isNextTransition || approved}
            severity={
                approved
                    ? 'success'
                    : readonly
                      ? 'warning'
                      : !isNextTransition
                        ? 'danger'
                        : undefined
            }
        >
            {approved
                ? 'Approved'
                : readonly
                  ? 'Does not meet requirement'
                  : !isNextTransition
                    ? 'Previous step required'
                    : 'Approve'}
        </Button>
    );
};
