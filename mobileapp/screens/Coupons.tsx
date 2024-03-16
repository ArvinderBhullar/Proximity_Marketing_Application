import React, {useEffect, useState} from 'react';
import {View, ScrollView, TouchableOpacity, Modal, Text} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Searchbar,
  Chip,
  ProgressBar,
} from 'react-native-paper';
import {db, auth} from '../services/Config';
import {
  query,
  collection,
  getDocs,
  DocumentData,
  addDoc,
  where,
} from 'firebase/firestore';
import {Timestamp} from 'react-native-reanimated/lib/typescript/reanimated2/commonTypes';
import styles from '../cssStyles/styles';
import LinearGradient from 'react-native-linear-gradient';
interface Coupon {
  id: string;
  name: string;
  end: Timestamp;
  description: string;
}

const Coupons = () => {
  const [coupons, setCoupons] = useState<DocumentData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [progress, setProgress] = useState(0);

  const fetchCoupons = async () => {
    try {
      const user = auth.currentUser;
      let userId = null;
      if (user) {
        userId = user.uid;
      }

      const couponsRef = collection(db, 'Coupons');
      const queryRef = query(couponsRef);

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
          if (redemptionQuerySnapshot.empty) {
            fetchedCoupons.push({...data, id: couponId});
          }
        } else {
          fetchedCoupons.push({...data, id: couponId});
        }
      }
      setCoupons(fetchedCoupons);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    }
  };
  // const fetchCoupons = async () => {
  //   const q = query(collection(db, 'Coupons'));
  //
  //   const querySnapshot = await getDocs(q);
  //   const fetchedCoupons: Coupon[] = querySnapshot.docs.map(doc => {
  //     const data = doc.data() as Coupon; // Assuming your document data matches the Coupon interface
  //     return {...data, id: doc.id};
  //   });
  //   setCoupons(fetchedCoupons);
  // };
  //
  useEffect(() => {
    fetchCoupons();
  }, []);
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

        console.log('Coupon redeemed successfully');
      } else {
        console.error('No user signed in');
      }
    } catch (error) {
      console.error('Error redeeming coupon:', error);
    }
  };

  const handleSaveChipPress = () => {
    // Implement logic to start the progress bar when the "Save" chip is pressed
    setProgress(0);

    // Increment progress every second until it reaches 100% after 30 seconds
    const interval = setInterval(() => {
      setProgress(prevProgress => {
        const newProgress = prevProgress + (1 / 30);
        if (newProgress >= 1) {
          clearInterval(interval);
        }
        return newProgress;
      });
    }, 1000);
  };

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
                  onPress={() => handleSaveChipPress}>
                  Save
                </Chip>
                <Chip
                  icon="gift"
                  mode="outlined"
                  onPress={() => handleRedeemChipPress(coupon.id)}>
                  Redeem
                </Chip>
              </View>
              {progress > 0 && (
                <View style={{marginTop: 10}}>
                  <ProgressBar progress={progress} />
                </View>
              )}
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

export default Coupons;
