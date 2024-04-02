import React, {useCallback, useEffect, useState} from 'react';
import {View, ScrollView} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Searchbar,
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

const Coupons = () => {
  const [coupons, setCoupons] = useState<DocumentData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);
  const [promocode, setPromocode] = useState('');
  const [promoname, setPromoname] = useState('');
  const navigation = useNavigation();

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

  return (
    <View style={{flex: 1}}>
      <ScrollView style={{flex: 1}}>
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
                <Chip
                  icon="heart"
                  mode="outlined"
                  onPress={async () => {
                    await handleSaveChipPress(coupon.id);
                    await fetchCoupons();
                  }}>
                  Save
                </Chip>
                <Chip
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
      <Searchbar
        placeholder="Search"
        onChangeText={search => setSearchQuery(search)}
        value={searchQuery}
        style={{margin: 10}}
      />
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
          <Text>Promo code: {promocode}</Text>
          <Button onPress={() => setPopupVisible(false)}>Close</Button>
        </Modal>
      </Portal>
    </View>
  );
};

export default Coupons;
