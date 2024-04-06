import React, {useCallback, useEffect, useState} from 'react';
import {ScrollView, Text, View} from 'react-native';
import {
  Button,
  Card,
  Chip,
  Modal,
  Paragraph,
  Portal,
  Searchbar,
  Title,
} from 'react-native-paper';
import {auth, db} from '../services/Config';
import {collection, getDocs, query, where} from 'firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import {
  handleRedeemChipPress,
  Coupon,
  handleUnSaveChipPress,
} from '../services/couponService';

const SavedCoupons = () => {
  const [savedCoupons, setSavedCoupons] = useState<Coupon[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);
  const [promocode, setPromocode] = useState('');
  const [promoname, setPromoname] = useState('');
  const navigation = useNavigation();

  const fetchSavedCoupons = async () => {
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
          ...savedCouponQuerySnapshot.docs.map(doc1 => doc1.data().couponId),
        );
        // console.log(savedCouponIds);
        const couponsRef = collection(db, 'Coupons');
        const queryRef = query(
          couponsRef,
          where('start', '<=', new Date()),
          where('end', '>=', new Date()),
        );
        const querySnapshot = await getDocs(queryRef);

        const fetchedCoupons: Coupon[] = [];
        for (const doc1 of querySnapshot.docs) {
          const data = doc1.data() as Coupon;
          const couponId = doc1.id;

          // Check if the coupon has been saved by the current user
          if (savedCouponIds.includes(couponId)) {
            fetchedCoupons.push({...data, id: couponId});
          }
        }
        fetchedCoupons.sort((a, b) => a.end.seconds - b.end.seconds);
        setSavedCoupons(fetchedCoupons);
      }
    } catch (error) {
      console.error('Error fetching saved coupons:', error);
    }
  };

  const fetchCouponsOnFocus = useCallback(() => {
    fetchSavedCoupons();
  }, []);

  // Add a listener for the tab focus event
  useEffect(() => {
    // Clean up the listener when component unmounts
    return navigation.addListener('focus', fetchCouponsOnFocus);
  }, [navigation, fetchCouponsOnFocus]);

  useEffect(() => {
    fetchSavedCoupons();
  }, []);

  return (
    <View style={{flex: 1}}>
      <ScrollView style={{flex: 1}} testID="savedCouponList">
        {savedCoupons.map(coupon => (
          <Card key={coupon.id} style={{margin: 10}}>
            <Card.Content>
              <Title>{coupon.name}</Title>
              <Paragraph>{coupon.description}</Paragraph>
              <Text>
                Expires:{' '}
                {new Date(1000 * coupon.end.seconds).toLocaleDateString()}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 10,
                }}>
                <Chip
                  testID={'unsave' + coupon.id}
                  icon="heart"
                  mode="outlined"
                  onPress={async () => {
                    await handleUnSaveChipPress(coupon.id);
                    await fetchSavedCoupons();
                  }}>
                  Remove from Saved list
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
                    await fetchSavedCoupons();
                  }}>
                  Redeem
                </Chip>
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
      {/*<Searchbar*/}
      {/*  placeholder="Search"*/}
      {/*  onChangeText={search => setSearchQuery(search)}*/}
      {/*  value={searchQuery}*/}
      {/*  style={{margin: 10}}*/}
      {/*/>*/}
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

export default SavedCoupons;
