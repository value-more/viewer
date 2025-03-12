export interface Logs {
    version: string;
    list: Log[]
}

export interface Log {
    date: number;
    message: string;
    type: 'feat'|'fix'|'improv'|'refactor';
}