// DEPRECATED FILE
// This file was used for testing purposes to scan for BLE devices and print their RSSI values.
import React, {useEffect} from 'react';
import {View, Text, Alert} from 'react-native';
import {Button} from 'react-native-paper';
import useBLE, {BLEDevice} from './../services/BLEScan';
import {auth, db} from '../services/Config';
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from 'firebase/firestore';

// Class is used for the Beacon information from Firebase, and the distance calculated from the RSSI
class Beacon {
  uuid: string;
  name: string;
  x: number;
  y: number;
  r: number;

  constructor(uuid: string, name: string, x: number, y: number, r: number) {
    this.uuid = uuid;
    this.name = name;
    this.x = x;
    this.y = y;
    this.r = r;
  }
}

// Function is used to triangulate the user's location using the 3 beacons x, y and r values.
function trilateration(beacons: Beacon[]): [number, number] {
  const beacon1 = beacons[0];
  const beacon2 = beacons[1];
  const beacon3 = beacons[2];

  const dx12 = beacon1.x - beacon2.x;
  const dy12 = beacon1.y - beacon2.y;
  const dx21 = Math.pow(beacon2.x, 2) - Math.pow(beacon1.x, 2);
  const dy21 = Math.pow(beacon2.y, 2) - Math.pow(beacon1.y, 2);
  const dr21 = Math.pow(beacon2.r, 2) - Math.pow(beacon1.r, 2);

  const dx13 = beacon1.x - beacon3.x;
  const dy13 = beacon1.y - beacon3.y;
  const dx31 = Math.pow(beacon3.x, 2) - Math.pow(beacon1.x, 2);
  const dy31 = Math.pow(beacon3.y, 2) - Math.pow(beacon1.y, 2);
  const dr31 = Math.pow(beacon3.r, 2) - Math.pow(beacon1.r, 2);

  const factorA = (dr21 * dx13) / dx12;
  const factorB = (dx21 * dx13) / dx12;
  const factorC = (dy21 * dx13) / dx12;
  const factorD = (dy12 * dx13) / dx12;

  const y =
    (dr31 - dy31 - dx31 - factorA + factorB + factorC) / (2 * (dy13 - factorD));
  const x = (dr21 - dx21 - dy21 - 2 * y * dy12) / (2 * dx12);
  return [x, y];
}

// Fetches the beacon information from Firebase of the 3 closest beacons. Also creates an array of Beacon objects to be used for trilateration function
const fetchBeacons = async (closetBeacons: BLEDevice[]) => {
  let beacons: Beacon[] = [];
  console.log('Fetching beacons...');
  await Promise.all(
    closetBeacons.map(async beacon => {
      console.log(`Fetching data for beacon with ID: ${beacon.uuid}`);
      const beaconQuerySnapshot = await getDocs(
        query(collection(db, 'Beacons'), where('uuid', '==', beacon.uuid)),
      );

      beaconQuerySnapshot.forEach(doc => {
        const data = doc.data();
        beacons.push(
          new Beacon(
            data.uuid,
            data.name,
            data.x,
            data.y,
            beacon.getDistance(),
          ),
        );
      });
      console.log(`Data fetched for beacon with ID: ${beacon.uuid}`);
    }),
  );

  return beacons;
};

const Scanning = () => {
  const {
    requestPermissions,
    scanForDevices,
    allBeacons,
    clearDevices,
    deviceScan,
  } = useBLE();

  // Functionality to scan for new devices every 10 seconds
  // useEffect(() => {
  //   const fetchDevicesInterval = setInterval(() => {
  //     fetchAllDevices();
  //   }, 5000); // Fetch devices every 10 seconds

  //   return () => clearInterval(fetchDevicesInterval);
  // }, []);

  // Function to scan for devices if permission was granted by the user to do so
  const fetchAllDevices = () => {
    requestPermissions(isGranted => {
      console.log(isGranted ? 'Granted' : 'Not Granted');
      if (isGranted) {
        scanForDevices();
      }
    });
  };

  // DEBUG: simple code just to print the name and RSSI of the device
  const printAllDevices = async () => {
    console.log('ALL BEACONS', allBeacons);
    allBeacons.forEach(b => {
      console.log('avg rssi', b.getRSSIAvg());
      console.log('kalman', b.getRSSIKalman());
      console.log('Distance', b.getDistance());
      console.log('Distance Kalman', b.getDistanceKalman());
    });
    // allBeacons.forEach(device => {
    //   console.log(
    //     `Device Name: ${device.name}, ID: ${
    //       device.uuid
    //     }, RSSI: ${
    //       device.rssi
    //     }, the avg RSSI is ${device.getRSSIAvg()}.
    //     \n\n\n the kalman RSSI is is ${device.getRSSIKalman()} meters.
    //     \n\n\n distance is ${device.getDistance()} meters.`,
    //   );
    // });

    const beacons = await fetchBeacons(allBeacons);
    // allBeacons.sort(BLEDevice.compareDistance).slice(0, 3),
    console.log(beacons.length);
    //   if (beacons.length < 3) {
    //     let s = "";
    //     beacons.forEach(device => {
    //       s+= device.name;
    //     })
    //   const ms = `Not enough Beacons. + ${s}`
    //   Alert.alert("Beacon Err/or", "Not enough beacons");
    //   clearDevices();
    //   return
    // }
    // const [deviceX, deviceY] = trilateration(beacons);

    // console.log(deviceX, deviceY);
    // //
    // const ms = `${deviceX}, ${deviceY},
    // ${beacons[0].name+ " " + Math.round(beacons[0].r)+ ", " + Math.round(allBeacons[0].getRSSIAvg())},
    // ${beacons[1].name + " " +Math.round(beacons[1].r)+ ", " + Math.round(allBeacons[1].getRSSIAvg())},
    // ${beacons[2].name +" " + Math.round(beacons[2].r)+ ", " + Math.round(allBeacons[2].getRSSIAvg())}`
    // Alert.alert("TEst",ms)

    clearDevices();
  };

  const delay = (ms: number | undefined) =>
    new Promise(res => setTimeout(res, ms));

  // clearDevices();
  // let i = 0;

  // while (i < 10) {
  //   scanForDevices();
  //   i++;
  //   await delay(2500)
  // }

  // allBeacons.forEach(b => {
  //   console.log('rssi values', b.rssi)
  //   console.log('rssi avg values', b.getRSSIAvg())
  // })

  const performScan = async () => {
    const results: number[] = [];

    for (let i = 0; i < 10; i++) {
      await delay(1000);
      const rssi = await deviceScan();
      results.push(rssi);
    }

    setScanResults(results);

    console.log('Scan results:', scanResults);
  };

  const [scanResults, setScanResults] = useState<number[]>([]);

  useEffect(() => {
    console.log('Scan results:', scanResults);
  }, [scanResults]);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Scanning Testing</Text>
      <Button onPress={printAllDevices}>Print Devices</Button>
      <Button onPress={performScan}>Scan Devices</Button>
      <Text>Scan Results: {scanResults.join(', ')}</Text>
    </View>
  );
};

export default Scanning;
