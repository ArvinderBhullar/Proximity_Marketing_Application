import { db, auth } from "../FirebaseConfig";
import { collection, addDoc, doc, updateDoc, deleteDoc, query, where, getDocs} from "firebase/firestore";


/**
 * Service class for managing coupons.
 * Contributes to FR-6, FR-7 and FR-8
 */
class CouponService {

  /**
   * Fetches all coupons from the database.
   * @returns A Promise that resolves to an array of coupons.
   */
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
  
  /**
   * Adds a new coupon to the database.
   * @param couponData - The data of the coupon to be added.
   * @returns A Promise that resolves when the coupon is added successfully.
   */
  static async addCoupon(couponData: any): Promise<void> {
    try {
      await addDoc(collection(db, "Coupons"),  { ...couponData }); 
      console.log("Coupon created successfully!");
    } catch (error) {
      console.error("Error creating Coupon:", error);
    }
  }

  /**
   * Updates a coupon in the database.
   * @param coupon - The updated data of the coupon.
   * @returns A Promise that resolves when the coupon is updated successfully.
   */
  static async updateCoupon(coupon): Promise<void> {
    try {
      const couponRef = doc(db, "Coupons", coupon.uid);
      await updateDoc(couponRef, { ...coupon }); 
      console.log("Coupon updated successfully!");
    } catch (error) {
      console.error("Error updating Coupon:", error);
    } 
  }

  /**
   * Deletes a coupon from the database.
   * @param couponId - The ID of the coupon to be deleted.
   * @returns A Promise that resolves when the coupon is deleted successfully.
   */
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