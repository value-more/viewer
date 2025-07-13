export interface CompanyStatus {
    key: StatusWorkflow;
    index?: number;
    updated: number;
}

export enum StatusWorkflow {
    INIT = 'INIT',
    COMPANY_PROFIL_VALID = 'COMPANY_PROFIL_VALID',
    DATA_APPROVED = 'DATA_APPROVED',
    DIAGRAMS_APPROVED = 'DIAGRAMS_APPROVED',
    BUSINESS_MODEL_APPROVED = 'BUSINESS_MODEL_APPROVED',
    MOAT_APPROVED = 'MOAT_APPROVED',
    VALUATED = 'VALUATED',
    ASSESSED = 'ASSESSED'
}

export const workflows: StatusWorkflow[] = [
    StatusWorkflow.COMPANY_PROFIL_VALID,
    StatusWorkflow.DATA_APPROVED,
    StatusWorkflow.DIAGRAMS_APPROVED,
    StatusWorkflow.BUSINESS_MODEL_APPROVED,
    StatusWorkflow.MOAT_APPROVED,
    StatusWorkflow.VALUATED,
    StatusWorkflow.ASSESSED
];
