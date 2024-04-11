import { db, auth } from "../FirebaseConfig";
import { collection, addDoc, doc, updateDoc, deleteDoc, query, where, getDocs} from "firebase/firestore";
import { DocumentReference } from 'firebase/firestore';
import { useContext } from "react";


/**
 * Service class for managing beacons in the database.
 */
class BeaconService {

  /**
   * Fetches all beacons from the database.
   * @returns A promise that resolves to an array of beacon objects.
   */
  static async fetchBeacons(): Promise<any> {
    const q = query(
      collection(db, "Beacons"),
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
   * Adds a new beacon to the database.
   * @param beaconData - The data of the beacon to be added.
   * @returns A promise that resolves when the beacon is added successfully.
   */
  static async addBeacon(beaconData: any): Promise<void> {
    try {
      await addDoc(collection(db, "Beacons"),  { ...beaconData }); 
      console.log("Beacon created successfully!");
    } catch (error) {
      console.error("Error creating Beacon:", error);
    }
  }

  /**
   * Updates a beacon in the database.
   * @param beacon - The updated beacon object.
   * @returns A promise that resolves when the beacon is updated successfully.
   */
  static async updateBeacon(beacon): Promise<void> {
    console.log('updating', beacon)
    try {
      const beaconRef = doc(db, "Beacons", beacon.id);
      delete beacon.id;
      await updateDoc(beaconRef, { ...beacon }); 
      console.log("Beacon updated successfully!");
    } catch (error) {
      console.error("Error updating Beacon:", error);
    } 
  }

  /**
   * Deletes a beacon from the database.
   * @param beaconId - The ID of the beacon to be deleted.
   * @returns A promise that resolves when the beacon is deleted successfully.
   */
  static async deleteBeacon(beaconId: string): Promise<void> {
    try {
      const beaconRef = doc(db, "Beacons", beaconId);
      await deleteDoc(beaconRef); 
      console.log("Beacon deleted successfully!");
    } catch (error) {
      console.error("Error deleting Beacon:", error);
    }
  }
}

export default BeaconService;