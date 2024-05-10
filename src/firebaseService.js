import { initializeApp } from "firebase/app";import { getFirestore, collection, addDoc, doc, setDoc, getDocs,query, where } from "firebase/firestore";

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
  }
};


export default firebaseService;


