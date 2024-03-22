import { db, auth } from "../FirebaseConfig";
import { collection, addDoc, doc, updateDoc, deleteDoc, query, where, getDocs} from "firebase/firestore";
import { DocumentReference } from 'firebase/firestore';
import { useContext } from "react";


class CouponService {

  static async fetchCoupons(): Promise<any> {
    const q = query(
      collection(db, "Coupons"),
      where("userId", "==", doc(db, "Organizations/" + auth.currentUser.uid))
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => {
      return {
        'id': doc.id,
        ...doc.data()
      };
    });
  };
  
  // Add a new coupon to the database
  static async addCoupon(couponData: any): Promise<void> {
    try {
      await addDoc(collection(db, "Coupons"),  { ...couponData }); 
      console.log("Coupon created successfully!");
    } catch (error) {
      console.error("Error creating Coupon:", error);
    }
  }

  // Update a coupon in the database
  static async updateCoupon(coupon): Promise<void> {
    try {
      const couponRef = doc(db, "Coupons", coupon.uid);
      await updateDoc(couponRef, { ...coupon }); 
      console.log("Coupon updated successfully!");
    } catch (error) {
      console.error("Error updating Coupon:", error);
    } 
  }

  // Delete a coupon from the database
  static async deleteCoupon(couponId: string): Promise<void> {
    try {
      const couponRef = doc(db, "Coupons", couponId);
      await deleteDoc(couponRef); 
      console.log("Coupon deleted successfully!");
    } catch (error) {
      console.error("Error deleting Coupon:", error);
    }
  }
}

export default CouponService;