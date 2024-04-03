import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {Text, Button} from 'react-native-paper';
import useBLE, {BLEDevice} from './../services/BLEScan';
import {auth, db} from '../services/Config';
import PushNotification from 'react-native-push-notification';
import {useNavigation} from '@react-navigation/native';
import {collection, getDocs} from 'firebase/firestore';

export class Coupon {
  id: string;
  name: string;
  end: Date;
  description: string;
  promocode: string;
  x: number;
  y: number;

  constructor(
    id: string,
    name: string,
    end: Date,
    description: string,
    promocode: string,
    x: number,
    y: number,
  ) {
    this.id = id;
    this.name = name;
    this.end = end;
    this.description = description;
    this.promocode = promocode;
    this.x = x;
    this.y = y;
  }
}

class fireBaseBeacon {
  uuid: string;
  name: string;
  x: number;
  y: number;

  constructor(uuid: string, name: string, x: number, y: number) {
    this.uuid = uuid;
    this.name = name;
    this.x = x;
    this.y = y;
  }
}

class Beacon {
  id: string;
  x: number;
  y: number;
  name: string;
  rssi: number;
  distance: number;

  static MEASURING_POWER: number = -47;
  static N: number = 2;

  constructor(id: string, name: string, rssi: number, x: number, y: number) {
    this.id = id;
    this.name = name;
    this.rssi = rssi;
    this.x = x;
    this.y = y;
    this.distance = this.calculateDistance();
  }

  calculateDistance(): number {
    return Math.pow(
      10,
      (BLEDevice.MEASURING_POWER - this.rssi) / (10 * BLEDevice.N),
    );
  }
}

function trilateration(closestBeacons: Beacon[]): [number, number] {
  if (closestBeacons.length < 3) {
    console.log('Not enough beacons to trilaterate');
    return [0, 0];
  }
  const beacon1 = closestBeacons[0];
  const beacon2 = closestBeacons[1];
  const beacon3 = closestBeacons[2];

  const dx12 = beacon1.x - beacon2.x;
  const dy12 = beacon1.y - beacon2.y;
  const dx21 = Math.pow(beacon2.x, 2) - Math.pow(beacon1.x, 2);
  const dy21 = Math.pow(beacon2.y, 2) - Math.pow(beacon1.y, 2);
  const dr21 = Math.pow(beacon2.distance, 2) - Math.pow(beacon1.distance, 2);

  const dx13 = beacon1.x - beacon3.x;
  const dy13 = beacon1.y - beacon3.y;
  const dx31 = Math.pow(beacon3.x, 2) - Math.pow(beacon1.x, 2);
  const dy31 = Math.pow(beacon3.y, 2) - Math.pow(beacon1.y, 2);
  const dr31 = Math.pow(beacon3.distance, 2) - Math.pow(beacon1.distance, 2);

  const factorA = (dr21 * dx13) / dx12;
  const factorB = (dx21 * dx13) / dx12;
  const factorC = (dy21 * dx13) / dx12;
  const factorD = (dy12 * dx13) / dx12;

  const y =
    (dr31 - dy31 - dx31 - factorA + factorB + factorC) / (2 * (dy13 - factorD));
  const x = (dr21 - dx21 - dy21 - 2 * y * dy12) / (2 * dx12);
  return [x, y];
}
const NotifyScreen = () => {
  let beacons: Beacon[] = [];
  const firebaseBeacons: fireBaseBeacon[] = [];
  const allCoupons: Coupon[] = [];
  let nearestCoupons: Coupon[] = [];
  const CHANNEL_ID = 'com.mobileapp.NotifyUserCoupons';

  let userMoved = false;
  const navigation = useNavigation();

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (userMoved) {
  //       console.log('User has moved');
  //       userMoved = false;
  //       const [x, y] = user_moving();
  //       pushNotification(x, y);
  //     } else {
  //       console.log('User has not moved');
  //     }
  //   }, 2000);

  //   return () => clearInterval(interval);
  // }, []);

  PushNotification.createChannel(
    {
      channelId: CHANNEL_ID, // (required)
      channelName: 'Notify Coupons', // (required)
      channelDescription: 'A channel to notify the user for nearby coupons', // (optional) default: undefined.
      playSound: false, // (optional) default: true
      soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
      importance: 4, // (optional) default: 4. Int value of the Android notification importance
      vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
    },
    created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
  );

  PushNotification.configure({
    onNotification: function (notification) {
      let coupons = nearestCoupons.map(coupon => ({
        ...coupon,
        end: coupon.end.getTime(), // convert Date to timestamp
      }));
      navigation.navigate('Nearest', {nearestCoupons: coupons}); // Navigate to NearestCouponScreen
    },

    popInitialNotification: true,
    requestPermissions: true,
  });

  const pushNotification = async (x: Number, y: Number) => {
    console.log(`User is at x: ${x}, y: ${y}`);

    const findCouponsInRadius = () => {
      const couponsInRadius = allCoupons.filter(coupon => {
        const distance = Math.sqrt(
          Math.pow(Number(x) - coupon.x, 2) + Math.pow(Number(y) - coupon.y, 2),
        );
        return distance <= 1;
      });

      nearestCoupons = couponsInRadius;
    };

    findCouponsInRadius();

    if (nearestCoupons.length != 0) {
      PushNotification.localNotification({
        /* Android Only Properties */
        channelId: CHANNEL_ID, // (required) channelId, if the channel doesn't exist, notification will not trigger.
        ticker: 'THERE IS A COUPON NEAR YOU', // (optional)
        showWhen: true, // (optional) default: true
        autoCancel: true, // (optional) default: true
        bigText: 'Expand to see the message', // (optional) default: "message" prop
        subText: new Date().toLocaleTimeString(), // (optional) default: none
        color: 'red', // (optional) default: system default
        vibrate: true, // (optional) default: true
        vibration: 300, // vibration length in milliseconds, (optional) default: 1000

        /* iOS and Android properties */
        title: 'There are coupons near you', // (optional)
        message: 'Click to view the coupons', // (required)
        playSound: false, // (optional) default: true
        soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
        number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
      });
    } else {
      console.log('No coupons nearby');
    }
  };

  const fetchDatabase = async () => {
    console.log('Fetching database');
    const user = auth.currentUser;
    firebaseBeacons.length = 0;
    nearestCoupons.length = 0;
    const beaconQuerySnapshot = await getDocs(collection(db, 'Beacons'));

    beaconQuerySnapshot.forEach(doc => {
      const data = doc.data();
      firebaseBeacons.push(
        new fireBaseBeacon(data.uuid, data.name, data.x, data.y),
      );
    });

    allCoupons.length = 0;

    const couponQuerySnapshot = await getDocs(collection(db, 'Coupons'));
    const redemptionsQuerySnapshot = await getDocs(
      collection(db, 'Redemptions'),
    );
    class Redemption {
      userId: string;
      couponId: string;
      redeemedAt: string;

      constructor(userId: string, couponId: string, redeemedAt: string) {
        this.userId = userId;
        this.couponId = couponId;
        this.redeemedAt = redeemedAt;
      }
    }
    const tempRedemption: Redemption[] = [];
    redemptionsQuerySnapshot.forEach(doc => {
      const data = doc.data();
      tempRedemption.push(
        new Redemption(data.userId, data.couponId, data.redeemedAt),
      );
    });

    couponQuerySnapshot.forEach(doc => {
      const data = doc.data();
      const isRedeemed = tempRedemption.some(
        redemption =>
          redemption.couponId == doc.id && redemption.userId == user!.uid,
      );
      if (isRedeemed) {
        return;
      }

      allCoupons.push(
        new Coupon(
          doc.id,
          data.name,
          data.end.toDate(),
          data.description,
          data.promocode,
          data.x,
          data.y,
        ),
      );
    });
  };

  const demo1 = () => {
    fetchDatabase();
    const beacon1 = new Beacon(
      '00:00:00:00:00:01',
      'Closetify Beacon 1',
      -50,
      1,
      1,
    );
    const beacon2 = new Beacon(
      '00:00:00:00:00:02',
      'Closetify Beacon 2',
      -60,
      3,
      0,
    );
    const beacon3 = new Beacon(
      '00:00:00:00:00:03',
      'Closetify Beacon 3',
      -20,
      2,
      5,
    );
    const beacon4 = new Beacon(
      '00:00:00:00:00:04',
      'Closetify Beacon 4',
      -40,
      6,
      2,
    );
    beacons = [beacon1, beacon2, beacon3, beacon4];
    beacons.sort((a, b) => a.distance - b.distance);
    beacons.pop();
    userMoved = true;
    const [x, y] = user_moving();
    pushNotification(x, y);
  };
  const demo2 = () => {
    fetchDatabase();
    const beacon1 = new Beacon(
      '00:00:00:00:00:01',
      'Closetify Beacon 1',
      -30,
      1,
      1,
    );
    const beacon2 = new Beacon(
      '00:00:00:00:00:02',
      'Closetify Beacon 2',
      -60,
      3,
      0,
    );
    const beacon3 = new Beacon(
      '00:00:00:00:00:03',
      'Closetify Beacon 3',
      -70,
      2,
      5,
    );
    const beacon4 = new Beacon(
      '00:00:00:00:00:04',
      'Closetify Beacon 4',
      -40,
      6,
      2,
    );
    beacons = [beacon1, beacon2, beacon3, beacon4];
    beacons.sort((a, b) => a.distance - b.distance);
    beacons.pop();
    userMoved = true;
    const [x, y] = user_moving();
    pushNotification(x, y);
  };

  const demo3 = () => {
    fetchDatabase();
    const beacon1 = new Beacon(
      '00:00:00:00:00:01',
      'Closetify Beacon 1',
      -50,
      1,
      1,
    );
    const beacon2 = new Beacon(
      '00:00:00:00:00:02',
      'Closetify Beacon 2',
      -60,
      3,
      0,
    );
    const beacon3 = new Beacon(
      '00:00:00:00:00:03',
      'Closetify Beacon 3',
      -70,
      2,
      5,
    );
    const beacon4 = new Beacon(
      '00:00:00:00:00:04',
      'Closetify Beacon 4',
      -40,
      6,
      2,
    );
    beacons = [beacon1, beacon2, beacon3, beacon4];
    beacons.sort((a, b) => a.distance - b.distance);
    beacons.pop();
    userMoved = true;
    const [x, y] = user_moving();
    pushNotification(x, y);
  };

  const printDatabase = () => {
    console.log('Beacons:');
    firebaseBeacons.forEach(beacon => {
      console.log(beacon);
    });

    console.log('Coupons:');
    allCoupons.forEach(coupon => {
      console.log(coupon);
    });
  };

  const user_moving = () => {
    const [x, y] = trilateration(beacons);
    return [x, y];
  };
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Scanning Testing</Text>
      <Button onPress={demo1}>Demo #1</Button>
      <Button onPress={demo2}>Demo #2</Button>
      <Button onPress={demo3}>Demo #3</Button>
    </View>
  );
};

export default NotifyScreen;
