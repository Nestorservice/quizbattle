import { Question, FinalResult } from './quiz';
import { TeamSummary } from './team';

export type BleState = 'lobby' | 'generating' | 'playing' | 'results';
export type BleMode = 'host' | 'client' | 'idle';

export type BleMessage =
  | { type: 'state'; state: BleState }
  | { type: 'teams'; teams: TeamSummary[] }
  | { type: 'question'; index: number; total: number; question: Question; startAt: number }
  | { type: 'reveal'; correctIndex: number; scores: Record<string, number> }
  | { type: 'results'; final: FinalResult[] };

export type BleClientMessage =
  | { type: 'join'; teamId: string; teamName: string }
  | { type: 'answer'; teamId: string; answerIndex: number; timestamp: number };

export interface BleDevice {
  id: string;
  name: string;
  rssi: number;
}
