import React, { useState, useEffect, useCallback } from 'react';
import BleManager from './BleManager';
import BleHost from './BleHost';
import BleClient from './BleClient';
import { BleDevice, BleMessage, BleMode } from '../types/ble';
import { TeamSummary } from '../types/team';

interface UseBluetoothHostResult {
  mode: 'host';
  connectedCount: number;
  startHost: () => Promise<void>;
  broadcastTeams: (teams: TeamSummary[]) => void;
  broadcastQuestion: (index: number, total: number, question: unknown) => void;
  broadcastReveal: (correctIndex: number, scores: Record<string, number>) => void;
}

interface UseBluetoothClientResult {
  mode: 'client';
  devices: BleDevice[];
  scanning: boolean;
  startScan: () => Promise<void>;
  connectTo: (deviceId: string, teamId: string, teamName: string) => Promise<void>;
  lastMessage: BleMessage | null;
}

export function useBluetoothHost(): UseBluetoothHostResult {
  const [connectedCount, setConnectedCount] = useState(0);

  const startHost = useCallback(async (): Promise<void> => {
    await BleHost.start();
    const interval = setInterval(() => {
      setConnectedCount(BleManager.getConnectedCount());
    }, 2000);
    // Cleanup stocké en ref, non retourné
    _hostIntervalRef.current = interval;
  }, []);

  const _hostIntervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (_hostIntervalRef.current) clearInterval(_hostIntervalRef.current);
    };
  }, []);

  return {
    mode: 'host',
    connectedCount,
    startHost,
    broadcastTeams: (teams) => BleHost.broadcastTeams(teams),
    broadcastQuestion: (i, total, q) => BleHost.broadcastQuestion(i, total, q as never),
    broadcastReveal: (ci, scores) => BleHost.broadcastReveal(ci, scores),
  };
}

export function useBluetoothClient(): UseBluetoothClientResult {
  const [devices, setDevices] = useState<BleDevice[]>([]);
  const [scanning, setScanning] = useState(false);
  const [lastMessage, setLastMessage] = useState<BleMessage | null>(null);

  const startScan = useCallback(async () => {
    setScanning(true);
    setDevices([]);
    await BleClient.scan((device) => {
      setDevices(prev => {
        if (prev.find(d => d.id === device.id)) return prev;
        return [...prev, device];
      });
    });
    setTimeout(() => setScanning(false), 10000);
  }, []);

  const connectTo = useCallback(
    async (deviceId: string, teamId: string, teamName: string) => {
      await BleClient.connect(deviceId, teamId, teamName);
      BleClient.onServerMessage((msg) => setLastMessage(msg));
    },
    [],
  );

  useEffect(() => {
    return () => {
      BleClient.disconnect();
    };
  }, []);

  return { mode: 'client', devices, scanning, startScan, connectTo, lastMessage };
}
