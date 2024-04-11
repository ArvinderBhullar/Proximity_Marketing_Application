import { db, auth } from "../FirebaseConfig";
import { collection, addDoc, doc, updateDoc, query, where, getDocs} from "firebase/firestore";


/**
 * Service class for interacting with maps in the database.
 * Contributes to FR-5
 */
class MapService {

  /**
   * Fetches all maps from the database.
   * @returns A Promise that resolves to an array of maps.
   */
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
  
  /**
   * Adds a new map to the database.
   * @param mapData - The data of the map to be added.
   * @returns A Promise that resolves when the map is added successfully.
   */
  static async addMap(mapData: any): Promise<void> {
    try {
      await addDoc(collection(db, "Maps"),  { ...mapData , userId: doc(db, "Organizations/" + auth.currentUser.uid)}); 
      console.log("Map created successfully!");
    } catch (error) {
      console.error("Error creating Map:", error);
    }
  }

  /**
   * Updates a map in the database.
   * @param map - The updated map data.
   * @param mapId - The ID of the map to be updated.
   * @returns A Promise that resolves when the map is updated successfully.
   */
  static async updateMap(map: any, mapId: string): Promise<void> {
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