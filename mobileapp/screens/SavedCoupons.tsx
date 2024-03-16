import React, {useCallback, useEffect, useState} from 'react';
import {ScrollView, Text, View} from 'react-native';
import {Card, Chip, Paragraph, Searchbar, Title} from 'react-native-paper';
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
import {Timestamp} from 'react-native-reanimated/lib/typescript/reanimated2/commonTypes';
import {useNavigation} from '@react-navigation/native';

interface Coupon {
  id: string;
  name: string;
  end: Timestamp;
  description: string;
}

const SavedCoupons = () => {
  const [savedCoupons, setSavedCoupons] = useState<Coupon[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
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
        console.log(savedCouponIds);
        const couponsRef = collection(db, 'Coupons');
        const queryRef = query(couponsRef);
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
        setSavedCoupons(fetchedCoupons);
      }

      // const user = auth.currentUser;
      // if (user) {
      //   const userId = user.uid;
      //
      //   // Fetch the coupon IDs saved by the user
      //   const savedCouponQuerySnapshot = await getDocs(
      //     query(collection(db, 'Saved Coupons'), where('userId', '==', userId)),
      //   );
      //
      //   // Extract coupon IDs from the query snapshot
      //   const savedCouponIds = savedCouponQuerySnapshot.docs.map(
      //     doc => doc.data().couponId,
      //   );
      //
      //   // Fetch coupons from the "Coupons" collection using the saved coupon IDs
      //   const couponsQuerySnapshot = await getDocs(
      //     query(
      //       collection(db, 'Coupons'),
      //       where('__name__', 'in', savedCouponIds),
      //     ),
      //   );
      //
      //   let fetchedSavedCoupons: Coupon[];
      //   fetchedSavedCoupons = couponsQuerySnapshot.docs.map(doc => ({
      //     id: doc.id,
      //     name: doc.data().name, // Make sure to replace 'name', 'end', and 'description' with the correct keys in your Firestore document
      //     end: doc.data().end,
      //     description: doc.data().description,
      //   }));
      //   setSavedCoupons(fetchedSavedCoupons);
      // }
    } catch (error) {
      console.error('Error fetching saved coupons:', error);
    }
  };

  const handleRedeemChipPress = async (couponId: string) => {
    // Implement logic to save the coupon
    try {
      const user = auth.currentUser;
      if (user) {
        const userId = user.uid;

        // Add a new document with a generated ID to the "Redemptions" collection
        await addDoc(collection(db, 'Redemptions'), {
          userId: userId,
          couponId: couponId,
          redeemedAt: new Date().toISOString(), // Store the redemption timestamp
        });
        // Delete the coupon from the "Saved Coupons" collection
        const querySnapshot = await getDocs(
          query(
            collection(db, 'Saved Coupons'),
            where('userId', '==', userId),
            where('couponId', '==', couponId),
          ),
        );
        // Check if there's a matching document
        if (!querySnapshot.empty) {
          // Get the document reference and delete it
          const docRef = querySnapshot.docs[0].ref;
          await deleteDoc(docRef);
          console.log('Coupon removed from Saved Coupons successfully');
        }

        fetchSavedCoupons();
        console.log('Coupon redeemed successfully');
      } else {
        console.error('No user signed in');
      }
    } catch (error) {
      console.error('Error redeeming coupon:', error);
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
      <ScrollView style={{flex: 1}}>
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
                  marginTop: 10,
                }}>
                <Chip
                  icon="gift"
                  mode="outlined"
                  onPress={() => handleRedeemChipPress(coupon.id)}>
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
    </View>
  );
};

export default SavedCoupons;
