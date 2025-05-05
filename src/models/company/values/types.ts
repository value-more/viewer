export interface CompanyValues {
    values?: CompanyValue[];
    areas?: number[][];
    preselectedLevel?: number;
}

export type CompanyValue = { [key: string]: number };
