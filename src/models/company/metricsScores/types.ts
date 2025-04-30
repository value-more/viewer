
export interface ScoreData {
    graphKey: string;
    value: number;
    timestamp: number;
}

export type ScoresData = {[key: string]: ScoreData}
