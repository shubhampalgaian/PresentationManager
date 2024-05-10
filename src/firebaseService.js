import { initializeApp } from "firebase/app";import { getFirestore, collection, addDoc, doc, setDoc, getDocs, getDoc, query, where, deleteDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAyezd2fLKRHaHQDFgBGtZGA4sLPa8n3jo",
  authDomain: "presentation-manager-b9bf8.firebaseapp.com",
  projectId: "presentation-manager-b9bf8",
  storageBucket: "presentation-manager-b9bf8.appspot.com",
  messagingSenderId: "879003706980",
  appId: "1:879003706980:web:d89e9b0122860c811ea171"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const firebaseService = {
  saveColumnsToFirestore: async (columns) => {
    try { 
      await Promise.all(columns.map(async (column) => {
        // Check if document with same ID exists
        const q = query(collection(db, "columns"), where("id", "==", column.id));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.size > 0) {
          // If document exists, update it
          querySnapshot.forEach(async (doc) => {
            await setDoc(doc.ref, column);
            console.log("Document updated with ID: ", column.id);
          });
        } else {
          // If document doesn't exist, add new document
          const docRef = await addDoc(collection(db, "columns"), column);
          console.log("New document added with ID: ", docRef.id);
        }
      }));
      console.log("Data saved to Firebase successfully!");
    } catch (error) {
      console.error("Error adding/updating document: ", error);
    }
  },

  getColumnsFromFirestore: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "columns"));
      const columns = [];
      querySnapshot.forEach((doc) => {
        columns.push(doc.data());
      });
      console.log("Columns retrieved from Firebase:", columns);
      return columns;
    } catch (error) {
      console.error("Error getting documents: ", error);
      return [];
    }
  },
  
  deleteColumnFromFirestore: async (columnId) => {
    try {
      const q = query(collection(db, "columns"), where("id", "==", columnId));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.size > 0) {
        
        querySnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
          console.log("Document deleted with ID: ", columnId);
        });

        return "deleted";
      }  else {
        console.log("Document with ID does not exist: ", columnId);
      }
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  },

  addDevices: async (devices) => {
    try {
      await Promise.all(devices.map(async (device) => {
        const docRef = await addDoc(collection(db, "devices"), device);
        console.log("New document added with ID: ", docRef.id);
      }));
      console.log("Data saved to Firebase successfully!");
    } catch (error) {
      console.error("Error adding/updating document: ", error);
    }
  },

  getDeviceFromFireStore: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "devices"));
      const devices = [];
      querySnapshot.forEach((doc) => {
        devices.push(doc.data());
      });
      console.log("Columns retrieved from Firebase:", devices);
      return devices;
    } catch (error) {
      console.error("Error getting documents: ", error);
      return [];
    }
  },
  
};


export default firebaseService;


