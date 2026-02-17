/**
 * RCC Core Types
 * HARDENED v1.0.0-DAY6
 */
export type RCCState = 'CALM' | 'NEUTRAL' | 'TENSE';
export type Channel = 'cli' | 'slack';
export interface InputMessage {
    id: string;
    text: string;
    author: string;
    channel: Channel;
    timestamp: number;
}
export interface AnalysisResult {
    state: RCCState;
    score: number;
    reason: string;
}
export interface RegulationResult {
    action: 'PASSTHROUGH' | 'SOFTEN' | 'SUMMARIZE' | 'PAUSE';
    message: string;
    meta?: Record<string, unknown>;
}
export interface RouterResult {
    channel: 'TEXT' | 'COOLDOWN';
}
