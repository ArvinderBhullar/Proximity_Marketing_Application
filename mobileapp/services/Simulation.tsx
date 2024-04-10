import {auth, db} from '../services/Config';
import {collection, getDocs} from 'firebase/firestore';

export class SimCoupon {
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
  distance: number;
  rssi: number;

  static MEASURING_POWER: number = -47;
  static N: number = 2.75;

  constructor(
    id: string,
    name: string,
    x: number,
    y: number,
    distance: number,
  ) {
    this.id = id;
    this.name = name;
    this.x = x;
    this.y = y;
    this.rssi = this.getRSSI(distance);
    this.distance = this.calculateDistance();
  }

  getRSSI(distance: number): number {
    return Beacon.MEASURING_POWER - Math.log10(distance) * 10 * Beacon.N;
  }
  calculateDistance(): number {
    return Math.pow(10, (Beacon.MEASURING_POWER - this.rssi) / (10 * Beacon.N));
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

const firebaseBeacons: fireBaseBeacon[] = [];
const allCoupons: SimCoupon[] = [];
let nearestCoupons: SimCoupon[] = [];
export const CHANNEL_ID = 'com.mobileapp.NotifyUserCoupons';

const findCouponsInRadius = (x: Number, y: Number) => {
  const couponsInRadius = allCoupons.filter(coupon => {
    const distance = Math.sqrt(
      Math.pow(Number(x) - coupon.x, 2) + Math.pow(Number(y) - coupon.y, 2),
    );
    return distance <= 1;
  });

  return couponsInRadius;
};

const fetchDatabase = async () => {
  const user = auth.currentUser;
  firebaseBeacons.length = 0;
  nearestCoupons.length = 0;
  const beaconQuerySnapshot = await getDocs(collection(db, 'Beacons'));

  beaconQuerySnapshot.forEach(doc => {
    const data = doc.data();
    if (data.name.includes('Closetify')) {
      firebaseBeacons.push(
        new fireBaseBeacon(data.uuid, data.name, data.x, data.y),
      );
    }
  });
  allCoupons.length = 0;

  const couponQuerySnapshot = await getDocs(collection(db, 'Coupons'));
  const redemptionsQuerySnapshot = await getDocs(collection(db, 'Redemptions'));
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
    if (data.x && data.y) {
      allCoupons.push(
        new SimCoupon(
          doc.id,
          data.name,
          data.end.toDate(),
          data.description,
          data.promocode,
          data.x,
          data.y,
        ),
      );
    }
  });
};

const get_distance = (beacon: fireBaseBeacon, x: Number, y: Number) => {
  return Math.sqrt(
    (Number(beacon.x) - Number(x)) ** 2 + (Number(beacon.y) - Number(y)) ** 2,
  );
};

export const sim = async (userx: Number, usery: Number, fetch = false) => {
  if (fetch) {
    await fetchDatabase();
  }

  const beacons: Beacon[] = [];

  const closestBeacons = firebaseBeacons
    .map(beacon => ({
      beacon,
      distance: get_distance(beacon, userx, usery),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 3)
    .map(item => item.beacon);

  beacons.push(
    ...closestBeacons.map(
      beacon =>
        new Beacon(
          beacon.uuid,
          beacon.name,
          beacon.x,
          beacon.y,
          get_distance(beacon, userx, usery),
        ),
    ),
  );

  const [x, y] = user_moving(beacons);
  const temp = findCouponsInRadius(x, y);
  return temp;
};

const user_moving = (beacons: Beacon[]) => {
  const [x, y] = trilateration(beacons);
  console.log('User moved to:', Math.round(x), Math.round(y));
  return [x, y];
};
