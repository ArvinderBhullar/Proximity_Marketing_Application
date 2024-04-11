import { db, auth } from "../FirebaseConfig";
import { collection, doc, query, where, getDocs} from "firebase/firestore";


/**
 * Service class for fetching redeemed coupons within a specified date range.
 */
class ReportService {

  /**
   * Fetches redeemed coupons within the specified date range.
   * @param startDate - The start date of the range.
   * @param endDate - The end date of the range.
   * @returns A promise that resolves to an array of redeemed coupons.
   */
  static async fetchRedeemed(startDate: string, endDate: string): Promise<any> { 
    const redeemCollectionRef = collection(db, "Redemptions");
    const q = query(
      redeemCollectionRef,
      where("redeemedAt", ">=", startDate),
      where("redeemedAt", "<=", endDate),
    );
    const fetchedRedeemed = await getDocs(q);

    const couponCollectionRef = collection(db, "Coupons");
    const couponQuery = query(couponCollectionRef, where("userId", "==", doc(db, "Organizations/" + auth.currentUser.uid)));
    const fetchedCoupons = await getDocs(couponQuery);
    
    const newCouponIds = fetchedCoupons.docs.map((doc) => doc.id);
    const filteredRedeemed = fetchedRedeemed.docs.filter((doc) => newCouponIds.includes(doc.data().couponId));

    const redeemedCoupons = [];
    filteredRedeemed.forEach((doc) => {
      const redeemDoc = doc.data();
      redeemedCoupons.push({
        id: doc.id,
        userId: redeemDoc.userId,
        couponId: redeemDoc.couponId,
        redeemedAt: new Date(redeemDoc.redeemedAt).toLocaleDateString(),
        name: redeemDoc.couponName,
      });
    });

    return redeemedCoupons;
  }
 
}

export default ReportService;