import React, {useCallback, useEffect, useState, useRef} from 'react';
import {View, ScrollView} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Chip,
  Text,
  Button,
  Modal,
  Portal,
} from 'react-native-paper';
import {db, auth} from '../services/Config';
import {
  query,
  collection,
  getDocs,
  DocumentData,
  where,
} from 'firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import {
  handleRedeemChipPress,
  Coupon,
  handleSaveChipPress,
} from '../services/couponService';
import {sim, CHANNEL_ID, SimCoupon} from '../services/Simulation';
import PushNotification from 'react-native-push-notification';

let start_Sim = false;

export const toggleSimulation = () => {
  start_Sim = !start_Sim;
};
// FR - 12: 12.2 Coupon display
const Coupons = () => {
  const [coupons, setCoupons] = useState<DocumentData[]>([]);
  const [nearestCoupons, setNearestCoupons] = useState<SimCoupon[]>([]);
  const [popupVisible, setPopupVisible] = useState(false);
  const [promocode, setPromocode] = useState('');
  const [promoname, setPromoname] = useState('');
  const navigation = useNavigation();
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
    created => {}, // (optional) callback returns whether the channel was created, false means it already existed.
  );

  PushNotification.configure({
    onNotification: function (notification) {
      let my_coupons = nearestCoupons.map(coupon => ({
        ...coupon,
        end: coupon.end.getTime(), // convert Date to timestamp
      }));
      navigation.navigate('Nearest', {my_coupons}); // Navigate to NearestCouponScreen
    },

    popInitialNotification: true,
    requestPermissions: true,
  });

  const pushNotification = async () => {
    if (nearestCoupons.length > 0) {
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
    }
  };

  // FR - 12: 12.2 Coupon display
  // FR - 15: 15.1 Coupon display
  const fetchCoupons = async () => {
    try {
      const user = auth.currentUser;
      let userId = null;
      if (user) {
        userId = user.uid;
      }
      const savedCouponIds: string[] = [];
      // Fetch the coupon IDs saved by the user
      if (userId) {
        const savedCouponQuerySnapshot = await getDocs(
          query(collection(db, 'Saved Coupons'), where('userId', '==', userId)),
        );

        savedCouponIds.push(
          ...savedCouponQuerySnapshot.docs.map(doc => doc.data().couponId),
        );
      }

      const couponsRef = collection(db, 'Coupons');
      const queryRef = query(
        couponsRef,
        where('start', '<=', new Date()),
        where('end', '>=', new Date()),
      );
      const querySnapshot = await getDocs(queryRef);

      const fetchedCoupons: Coupon[] = [];
      for (const doc of querySnapshot.docs) {
        const data = doc.data() as Coupon;
        const couponId = doc.id;

        // Check if the coupon has been redeemed by the current user
        if (userId) {
          const redemptionQuerySnapshot = await getDocs(
            query(
              collection(db, 'Redemptions'),
              where('userId', '==', userId),
              where('couponId', '==', couponId),
            ),
          );
          if (
            redemptionQuerySnapshot.empty &&
            !savedCouponIds.includes(couponId)
          ) {
            fetchedCoupons.push({...data, id: couponId});
          }
        } else {
          fetchedCoupons.push({...data, id: couponId});
        }
      }
      fetchedCoupons.sort((a, b) => a.end.seconds - b.end.seconds);
      setCoupons(fetchedCoupons);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    }
  };

  const fetchCouponsOnFocus = useCallback(() => {
    fetchCoupons();
  }, []);

  // Add a listener for the tab focus event
  useEffect(() => {
    // Clean up the listener when component unmounts
    return navigation.addListener('focus', fetchCouponsOnFocus);
  }, [navigation, fetchCouponsOnFocus]);

  useEffect(() => {
    fetchCoupons();
  }, []);

  // -------------------------------------------------------This is the main logic for the simulation-------------------------------------------------------
  const [counter, setCounter] = useState(0);
  const counterRef = useRef(counter);
  /**
   * Represents the moves made by a user for Simulation 1.
   */
  const sim1_moves: {x: number; y: number}[] = [
    {x: 1, y: 1},
    {x: 3, y: 1},
    {x: 6, y: 1},
    {x: 8, y: 1},
    {x: 10, y: 1},
    {x: 10, y: 3},
    {x: 10, y: 5},
    {x: 8, y: 5},
    {x: 3, y: 5},
    {x: 1, y: 5},
    {x: 1, y: 8},
    {x: 1, y: 9},
    {x: 3, y: 9},
    {x: 6, y: 9},
    {x: 10, y: 9},
    {x: 8, y: 8},
    {x: 3, y: 3},
  ];

  /**
   * Represents the moves made by a user for Simulation 2.
   */
  const sim2_moves: {x: number; y: number}[] = [
    {x: 1, y: 1},
    {x: 1, y: 2},
    {x: 1, y: 3},
    {x: 1, y: 4},
    {x: 4, y: 4},
    {x: 4, y: 3},
    {x: 4, y: 2},
  ];

  const [simMoves, setSimMoves] = useState(sim2_moves);

  useEffect(() => {
    if (start_Sim) {
      counterRef.current = counter; // Update the ref whenever counter changes
      if (counterRef.current >= userMovesRef.current.length) {
        setSimMoves(
          userMovesRef.current.length == sim1_moves.length
            ? sim2_moves
            : sim1_moves,
        );
        console.log('Sim moves updated');
      }
    }
  }, [counter]);

  const userMovesRef = useRef(simMoves);

  useEffect(() => {
    if (start_Sim) {
      userMovesRef.current = simMoves;
      console.log('Sim Moves:', userMovesRef.current);
      setCounter(0);
    }
  }, [simMoves]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (start_Sim) {
        if (counterRef.current >= userMovesRef.current.length) {
          // Do nothing
        } else {
          const {x, y} = userMovesRef.current[counterRef.current];
          sim(x, y, counterRef.current == 0).then(result => {
            setNearestCoupons(result);
            setCounter(prevCounter => prevCounter + 1);
          });
        }
      }
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (start_Sim) {
      console.log('Nearest Coupons:', nearestCoupons);
      pushNotification();
    }
  }, [nearestCoupons]);
  // -------------------------------------------------------This is the main logic for the simulation-------------------------------------------------------

  return (
    <View style={{flex: 1}}>
      <ScrollView style={{flex: 1}} testID="couponList">
        {/*FR - 12: 12.2 Coupon display*/}
        {coupons.map(coupon => (
          <Card key={coupon.id} style={{margin: 10}}>
            <Card.Content>
              <Title>{coupon.name}</Title>
              <Paragraph>{coupon.description}</Paragraph>
              <Text>
                Expires:{' '}
                {new Date(coupon.end.seconds * 1000).toLocaleDateString()}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 10,
                }}>
                {/*FR - 14: 14.2 Save button*/}
                <Chip
                  testID={'save' + coupon.id}
                  icon="heart"
                  mode="outlined"
                  onPress={async () => {
                    await handleSaveChipPress(coupon.id);
                    await fetchCoupons();
                  }}>
                  Save
                </Chip>
                {/*FR - 15: 15.2 Coupon redemption*/}
                <Chip
                  testID={'redeem' + coupon.id}
                  icon="gift"
                  mode="outlined"
                  onPress={async () => {
                    await handleRedeemChipPress(
                      coupon.id,
                      coupon.name,
                      coupon.promocode,
                      setPromocode,
                      setPromoname,
                      setPopupVisible,
                    );
                    await fetchCoupons();
                  }}>
                  Redeem
                </Chip>
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
      <Portal>
        <Modal
          visible={popupVisible}
          onDismiss={() => setPopupVisible(false)}
          contentContainerStyle={{
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 10,
          }}>
          <Text>Promotion: {promoname}</Text>
          <Text testID={promocode}>Promo code: {promocode}</Text>
          <Button
            testID="closePopupButton"
            onPress={() => setPopupVisible(false)}>
            Close
          </Button>
        </Modal>
      </Portal>
    </View>
  );
};

export default Coupons;
