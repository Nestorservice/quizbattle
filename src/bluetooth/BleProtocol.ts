import { BLE } from '../constants/ble';
import { BleMessage, BleClientMessage } from '../types/ble';

export function encodeMessage(msg: BleMessage | BleClientMessage): string {
  const json = JSON.stringify(msg);
  if (json.length > 512) {
    throw new Error(`Message BLE trop grand : ${json.length} bytes`);
  }
  return json;
}

export function decodeMessage(raw: string): BleMessage | BleClientMessage | null {
  try {
    return JSON.parse(raw) as BleMessage | BleClientMessage;
  } catch {
    return null;
  }
}

export function base64ToUtf8(base64: string): string {
  // Décodage base64 compatible React Native (global.atob disponible via JavaScriptCore)
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder('utf-8').decode(bytes);
}

export function utf8ToBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  bytes.forEach(b => { binary += String.fromCharCode(b); });
  return btoa(binary);
}

export { BLE };
