import { useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { BleManager, Device } from 'react-native-ble-plx';
var KalmanFilter = require('kalmanjs')

type PermissionCallback = (result: boolean) => void;

const bleManager = new BleManager();

export class BLEDevice {
  static MEASURING_POWER: number = -69;
  static N: number = 2;

  uuid: string;
  name: string;
  rssi: number[];

  constructor(uuid: string, name: string, initialRSSI: number) {
    this.uuid = uuid;
    this.name = name;
    this.rssi = [initialRSSI];
  }

  static compareDistance(deviceA: BLEDevice, deviceB: BLEDevice) {
    const distanceA = deviceA.getDistance(); // Calculate distance for object a
    const distanceB = deviceB.getDistance(); // Calculate distance for object b

    // Compare distances and return result for sorting
    if (distanceA < distanceB) {
      return -1; // a should come before b
    } else if (distanceA > distanceB) {
      return 1; // a should come after b
    } else {
      return 0; // distances are equal, maintain current order
    }
  }
  appendRSSI(newRSSI: number): void {
    if (newRSSI < 0) {
      this.rssi.push(newRSSI);
    }
  }

  getRSSIAvg(): number {
    if (this.rssi.length === 0) {
      return 0; // Return 0 if no RSSI values available to avoid division by zero
    }

    const sum = this.rssi.reduce((acc, value) => acc + value, 0);
    return sum / this.rssi.length;
  }

  getRSSIKalman(): number {
    console.log('This is kalman 1')
    const kf = new KalmanFilter({R: 0.01, Q: 3});
    console.log('This is kalman 2')
    const kalmans = this.rssi.map(rssi => kf.filter(rssi));
    console.log('This is kalman 3', kalmans)
    return kalmans[kalmans.length - 1];
  }

  getDistance(): number {
    return Math.pow(
      10,
      (BLEDevice.MEASURING_POWER - this.getRSSIAvg()) / (10 * BLEDevice.N),
    );
  }

  getDistanceKalman(): number {
    return Math.pow(
      10,
      (BLEDevice.MEASURING_POWER - this.getRSSIKalman()) / (10 * BLEDevice.N),
    );
  }
}

interface BluetoothLowEnergyAPI {
  requestPermissions(callback: PermissionCallback): Promise<void>;
  scanForDevices(): void;
  allBeacons: BLEDevice[];
  clearDevices(): void;
  deviceScan(): Promise<void>;
}

export default function useBLE(): BluetoothLowEnergyAPI {
  const [allBeacons, setAllBeacons] = useState<BLEDevice[]>([]);

  // Checking if permission have been granted. IOS handles BLE scanning permissions internally, while Android, you have to explicitly ask
  const requestPermissions = async (callback: PermissionCallback) => {
    if (Platform.OS === 'android') {
      const grantedStatus = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'Bluetooth Low Energy Needs Location Permission',
          buttonNegative: 'Cancel',
          buttonPositive: 'Ok',
        },
      );
      callback(grantedStatus === PermissionsAndroid.RESULTS.GRANTED);
    } else {
      callback(true);
    }
  };

  // Starts the scanning process to look for "Closetify Beacon [x]" where x can be some number which can correspond to the map
  const scanForDevices = () => {
    // TODO Might have to clear the list before every scan depending on if the beacon is accessible everywhere in the room or not.
    // If the beacon cant be scanned but still shows up on the list, we might use that value in the location calculation and will get the wrong location
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(error);
      }
      // Filter the scannable devices with the ones what have Closetify Beacon in its name
      if (device && device.name?.includes('Closetify Beacon')) {
        // if (device) {
        setAllBeacons(prevState => {
          // Checking if its in the list already. If it is, update it, if not, add it.
          console.log(device.name)
          const indexToReplace = prevState.findIndex(
            currentDevice => currentDevice.uuid === device.id,
          );
          if (indexToReplace == -1) {
            const new_device: BLEDevice = new BLEDevice(
              device.id,
              device.name!,
              device.rssi!,
            );
            return [...prevState, new_device];
          } else {
            const updatedDevices = [...prevState];
            const updated_device = updatedDevices[indexToReplace];
            updated_device.appendRSSI(device.rssi!);
            return updatedDevices;
          }
        });
        // Debug
        console.log('device found stopping scan')
        bleManager.stopDeviceScan()
      }
    });

    console.log('Scanning Complete');
  };


  const deviceScan = async () => {
    await bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.warn('Error scanning')
      }
      else if (device!.id === "00:00:00:00:00:05") {
        bleManager.stopDeviceScan()
        console.log('found', device!.id)
        console.log('rssi found', device!.rssi)
        return device!.rssi
      }
    })
  }

  const clearDevices = () => {
    setAllBeacons([]);
    console.log("Beacons Cleared");
  };

  return {
    requestPermissions,
    scanForDevices,
    allBeacons,
    clearDevices,
    deviceScan
  };
}
