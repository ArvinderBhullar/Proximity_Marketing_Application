import { db, auth } from "../FirebaseConfig";
import { collection, addDoc, doc, updateDoc, deleteDoc, query, where, getDocs} from "firebase/firestore";
import { DocumentReference } from 'firebase/firestore';
import { useContext } from "react";


class BeaconService {

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
  
  // Add a new beacon to the database
  static async addBeacon(beaconData: any): Promise<void> {
    try {
      await addDoc(collection(db, "Beacons"),  { ...beaconData }); 
      console.log("Beacon created successfully!");
    } catch (error) {
      console.error("Error creating Beacon:", error);
    }
  }

  // Update a beacon in the database
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

  // Delete a beacon from the database
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