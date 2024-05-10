import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

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
        const docRef = await addDoc(collection(db, "columns"), column);
        console.log("Document written with ID: ", docRef.id);
      }));
      console.log("Data saved to Firebase successfully!");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  }
};

export default firebaseService;
