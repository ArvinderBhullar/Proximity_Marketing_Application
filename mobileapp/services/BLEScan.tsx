import {useState} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import {BleManager, Device} from 'react-native-ble-plx';

type PermissionCallback = (result: boolean) => void;

const bleManager = new BleManager();

interface BluetoothLowEnergyAPI {
  requestPermissions(callback: PermissionCallback): Promise<void>;
  scanForDevices(): void;
  allDevices: Device[];
}

export default function useBLE(): BluetoothLowEnergyAPI {
  const [allDevices, setAllDevices] = useState<Device[]>([]);

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
        console.log(`Device '${device['localName']}' Found`);
        setAllDevices(prevState => {
          // Checking if its in the list already. If it is, update it, if not, add it.
          const indexToReplace = prevState.findIndex(
            currentDevice => currentDevice['localName'] === device['localName'],
          );
          if (indexToReplace == -1) {
            return [...prevState, device];
          } else {
            const updatedDevices = [...prevState];
            updatedDevices[indexToReplace] = device;
            return updatedDevices;
          }
        });
      }
    });

    console.log('Scanning Complete');
  };

  return {
    requestPermissions,
    scanForDevices,
    allDevices,
  };
}
