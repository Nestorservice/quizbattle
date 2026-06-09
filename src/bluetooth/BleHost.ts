import BleManager from './BleManager';
import { Question } from '../types/quiz';
import { TeamSummary } from '../types/team';

class BleHost {
  private clientAnswers: Map<string, { answerIndex: number; timestamp: number }> = new Map();
  private answerCallbacks: ((teamId: string, answerIndex: number, timestamp: number) => void)[] = [];

  async start(): Promise<void> {
    await BleManager.startAsHost();

    BleManager.onMessage((msg) => {
      if (msg.type === 'answer') {
        this.clientAnswers.set(msg.teamId, {
          answerIndex: msg.answerIndex,
          timestamp: msg.timestamp,
        });
        this.answerCallbacks.forEach(cb =>
          cb(msg.teamId, msg.answerIndex, msg.timestamp),
        );
      }
    });
  }

  broadcastState(state: 'lobby' | 'generating' | 'playing' | 'results'): void {
    BleManager.sendToClients({ type: 'state', state });
  }

  broadcastTeams(teams: TeamSummary[]): void {
    BleManager.sendToClients({ type: 'teams', teams });
  }

  broadcastQuestion(index: number, total: number, question: Question): void {
    this.clientAnswers.clear();
    BleManager.sendToClients({
      type: 'question',
      index,
      total,
      question,
      startAt: Date.now(),
    });
  }

  broadcastReveal(correctIndex: number, scores: Record<string, number>): void {
    BleManager.sendToClients({ type: 'reveal', correctIndex, scores });
  }

  onClientAnswer(
    cb: (teamId: string, answerIndex: number, timestamp: number) => void,
  ): () => void {
    this.answerCallbacks.push(cb);
    return () => {
      this.answerCallbacks = this.answerCallbacks.filter(f => f !== cb);
    };
  }

  getConnectedCount(): number {
    return BleManager.getConnectedCount();
  }
}

export default new BleHost();
