import { Platform, PermissionsAndroid } from 'react-native';

export async function requestBlePermissions(): Promise<boolean> {
  if (Platform.OS === 'ios') {
    return true;
  }

  if (Number(Platform.Version) < 31) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }

  const results = await PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
  ]);

  return Object.values(results).every(r => r === PermissionsAndroid.RESULTS.GRANTED);
}
