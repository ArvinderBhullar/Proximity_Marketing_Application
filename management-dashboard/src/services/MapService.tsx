import { db, auth } from "../FirebaseConfig";
import { collection, addDoc, doc, updateDoc, query, where, getDocs} from "firebase/firestore";


class MapService {

  static async fetchMap(): Promise<any> {
    const q = query(
      collection(db, "Maps"),
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
  
  // Add a new map to the database
  static async addMap(mapData: any): Promise<void> {
    try {
      await addDoc(collection(db, "Maps"),  { ...mapData , userId: doc(db, "Organizations/" + auth.currentUser.uid)}); 
      console.log("Map created successfully!");
    } catch (error) {
      console.error("Error creating Map:", error);
    }
  }

  // Update a map in the database
  static async updateMap(map, mapId): Promise<void> {
    console.log('updating', map)
    try {
      const mapRef = doc(db, "Maps", mapId);
      await updateDoc(mapRef, { ...map }); 
      console.log("Map updated successfully!");
    } catch (error) {
      console.error("Error updating Map:", error);
    } 
  }
}

export default MapService;