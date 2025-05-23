export interface CompanyScores {
    businessModel?: { val?: number; timestamp?: number };
    moat?: MoatScores;
    score?: number;
    fundamentals?: number;
    timestamp?: number;
}

export interface MoatScores {
    moat?: number;
    trend?: number;
    result?: number;
    timestamp?: number;
}
