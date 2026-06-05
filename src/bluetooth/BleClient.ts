import BleManager from './BleManager';
import { BleMessage } from '../types/ble';
import { BleDevice } from '../types/ble';

type StateCallback = (state: BleMessage) => void;

class BleClient {
  private hostDeviceId: string | null = null;
  private stateCallbacks: StateCallback[] = [];
  private unsubscribe: (() => void) | null = null;

  async scan(onFound: (device: BleDevice) => void): Promise<void> {
    await BleManager.startScanAsClient(onFound);
  }

  stopScan(): void {
    BleManager.stopScan();
  }

  async connect(deviceId: string, teamId: string, teamName: string): Promise<void> {
    await BleManager.connectToHost(deviceId);
    this.hostDeviceId = deviceId;

    this.unsubscribe = BleManager.onMessage((msg) => {
      this.stateCallbacks.forEach(cb => cb(msg as BleMessage));
    });

    await BleManager.sendToHost({ type: 'join', teamId, teamName }, deviceId);
  }

  async sendAnswer(teamId: string, answerIndex: number): Promise<void> {
    if (!this.hostDeviceId) return;
    await BleManager.sendToHost(
      { type: 'answer', teamId, answerIndex, timestamp: Date.now() },
      this.hostDeviceId,
    );
  }

  onServerMessage(cb: StateCallback): () => void {
    this.stateCallbacks.push(cb);
    return () => {
      this.stateCallbacks = this.stateCallbacks.filter(f => f !== cb);
    };
  }

  disconnect(): void {
    this.unsubscribe?.();
    this.hostDeviceId = null;
    this.stateCallbacks = [];
  }
}

export default new BleClient();
