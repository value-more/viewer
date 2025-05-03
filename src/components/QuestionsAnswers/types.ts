export interface Question {
    key: string;
    value: TranslatedValue;
    timestamp: number;
}

export type Answers = {
    [key: string]: {
        answer: TranslatedValue;
        timestamp?: number;
    };
};

export type TranslatedValue = { [lang: string]: string };
