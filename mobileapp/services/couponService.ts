import {auth, db} from './Config';
import {
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import {Timestamp} from 'react-native-reanimated/lib/typescript/reanimated2/commonTypes';

export interface Coupon {
  id: string;
  name: string;
  end: Timestamp;
  description: string;
  promocode: string;
}

export const handleRedeemChipPress = async (
  couponId: string,
  name: string,
  promo: string,
  setPromocode: React.Dispatch<React.SetStateAction<string>>,
  setPromoname: React.Dispatch<React.SetStateAction<string>>,
  setPopupVisible: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  // Implementation of handleRedeemChipPress function
  try {
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      setPromocode(promo);
      setPromoname(name);
      setPopupVisible(true);

      // Add a new document with a generated ID to the "Redemptions" collection
      await addDoc(collection(db, 'Redemptions'), {
        userId: userId,
        couponId: couponId,
        couponName: name,
        redeemedAt: new Date().toISOString(), // Store the redemption timestamp
      });

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
      console.log('Coupon redeemed successfully');
    } else {
      console.error('No user signed in');
    }
  } catch (error) {
    console.error('Error redeeming coupon:', error);
  }
};

export const handleSaveChipPress = async (couponId: string) => {
  // Implementation of handleSaveChipPress function
  try {
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;

      // Add a new document with a generated ID to the "Redemptions" collection
      await addDoc(collection(db, 'Saved Coupons'), {
        userId: userId,
        couponId: couponId,
        savedOn: new Date().toISOString(), // Store the redemption timestamp
      });
      console.log('Coupon saved successfully');
    } else {
      console.error('No user signed in');
    }
  } catch (error) {
    console.error('Error saving coupon:', error);
  }
};

export const handleUnSaveChipPress = async (couponId: string) => {
  // Implement logic to unsave the coupon
  try {
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;

      // Delete the coupon from the "Saved Coupons" collection
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
    } else {
      console.error('No user signed in');
    }
  } catch (error) {
    console.error('Error saving coupon:', error);
  }
};
