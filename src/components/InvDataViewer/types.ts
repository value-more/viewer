export interface LabelData {
    label: string;
    main?: boolean;
    level?: number;
    avoidScaling?: boolean;
    name: string;
}

export interface Config {
    children: LabelData[];
    name: string;
}
