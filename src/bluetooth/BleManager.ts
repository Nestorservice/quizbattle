import { BleManager as BleManagerLib, Device, Characteristic, BleError } from 'react-native-ble-plx';
import { BleMessage, BleClientMessage, BleDevice, BleMode } from '../types/ble';
import { BLE } from '../constants/ble';
import { encodeMessage, decodeMessage, base64ToUtf8, utf8ToBase64 } from './BleProtocol';
import { requestBlePermissions } from '../utils/permissions';
import { Config } from '../constants/config';

type MessageCallback = (msg: BleMessage | BleClientMessage, deviceId: string) => void;
type DeviceFoundCallback = (device: BleDevice) => void;

class BleManagerSingleton {
  private manager: BleManagerLib;
  private mode: BleMode = 'idle';
  private connectedDevices: Map<string, Device> = new Map();
  private messageCallbacks: MessageCallback[] = [];
  private deviceFoundCallbacks: DeviceFoundCallback[] = [];
  private scanSubscription: ReturnType<BleManagerLib['startDeviceScan']> | null = null;

  constructor() {
    this.manager = new BleManagerLib();
  }

  async requestPermissions(): Promise<boolean> {
    return requestBlePermissions();
  }

  // ─── HOST ──────────────────────────────────────────────────────────────────

  async startAsHost(): Promise<void> {
    const granted = await this.requestPermissions();
    if (!granted) throw new Error('Permissions BLE refusées');
    this.mode = 'host';
  }

  sendToClients(message: BleMessage): void {
    if (this.mode !== 'host') return;
    const encoded = utf8ToBase64(encodeMessage(message));

    this.connectedDevices.forEach(async (device) => {
      try {
        await this.manager.writeCharacteristicWithResponseForDevice(
          device.id,
          BLE.SERVICE_UUID,
          BLE.QUESTION_CHAR,
          encoded,
        );
      } catch {
        // Client peut être déconnecté
      }
    });
  }

  // ─── CLIENT ────────────────────────────────────────────────────────────────

  async startScanAsClient(onFound: DeviceFoundCallback): Promise<void> {
    const granted = await this.requestPermissions();
    if (!granted) throw new Error('Permissions BLE refusées');

    this.deviceFoundCallbacks = [onFound];
    this.mode = 'client';

    this.manager.startDeviceScan(
      [BLE.SERVICE_UUID],
      { allowDuplicates: false },
      (error: BleError | null, device: Device | null) => {
        if (error || !device) return;
        if (device.name?.includes(BLE.DEVICE_NAME)) {
          onFound({
            id: device.id,
            name: device.name ?? 'QuizBattle Host',
            rssi: device.rssi ?? -80,
          });
        }
      },
    );

    setTimeout(() => this.stopScan(), Config.bleConnectionTimeout * 3);
  }

  stopScan(): void {
    this.manager.stopDeviceScan();
  }

  async connectToHost(deviceId: string): Promise<void> {
    this.stopScan();

    const device = await Promise.race([
      this.manager.connectToDevice(deviceId),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Timeout connexion BLE')), Config.bleConnectionTimeout),
      ),
    ]);

    await device.discoverAllServicesAndCharacteristics();
    this.connectedDevices.set(deviceId, device);

    device.monitorCharacteristicForService(
      BLE.SERVICE_UUID,
      BLE.QUESTION_CHAR,
      (error: BleError | null, char: Characteristic | null) => {
        if (error || !char?.value) return;
        const raw = base64ToUtf8(char.value);
        const msg = decodeMessage(raw);
        if (msg) this.messageCallbacks.forEach(cb => cb(msg, deviceId));
      },
    );

    device.onDisconnected(() => {
      this.connectedDevices.delete(deviceId);
    });
  }

  async sendToHost(message: BleClientMessage, hostDeviceId: string): Promise<void> {
    if (this.mode !== 'client') return;
    const device = this.connectedDevices.get(hostDeviceId);
    if (!device) return;

    const encoded = utf8ToBase64(encodeMessage(message));
    await this.manager.writeCharacteristicWithResponseForDevice(
      hostDeviceId,
      BLE.SERVICE_UUID,
      BLE.ANSWER_CHAR,
      encoded,
    );
  }

  // ─── COMMUN ────────────────────────────────────────────────────────────────

  onMessage(cb: MessageCallback): () => void {
    this.messageCallbacks.push(cb);
    return () => {
      this.messageCallbacks = this.messageCallbacks.filter(f => f !== cb);
    };
  }

  getMode(): BleMode {
    return this.mode;
  }

  getConnectedCount(): number {
    return this.connectedDevices.size;
  }

  destroy(): void {
    this.stopScan();
    this.connectedDevices.forEach(d => d.cancelConnection());
    this.connectedDevices.clear();
    this.mode = 'idle';
    this.messageCallbacks = [];
    this.manager.destroy();
  }
}

export default new BleManagerSingleton();
