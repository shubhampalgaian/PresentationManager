import { initializeApp } from "firebase/app";import { getFirestore, collection, addDoc, doc, setDoc, getDocs, arrayRemove, query, where, deleteDoc, updateDoc } from "firebase/firestore";

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

  removeTV: async (tvNumber, columnId) => {
    try {
      // console.log("tvNumber : ", tvNumber, " columnId : ", columnId);
      const q = query(collection(db, "columns"), where("id", "==", columnId));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.size > 0) {
        // console.log("querySnapshot : ", querySnapshot);
  
        querySnapshot.forEach(async (docSnapshot) => {
          // console.log("doc : ", docSnapshot);
          const columnData = docSnapshot.data();
          // console.log("columnData: ", columnData);
          
          if (columnData.tvs && columnData.tvs.length > 0) {
            const tvToRemove = columnData.tvs.find(tv => tv.tvNumber === tvNumber);
            if (tvToRemove) {
              const docRef = doc(db, "columns", docSnapshot.id);
              await updateDoc(docRef, {
                tvs: arrayRemove(tvToRemove)
              });
  
              console.log(`TV with number ${tvNumber} removed successfully.`);
              return "deleted";
            } else {
              console.log(`TV with number ${tvNumber} not found in column ${columnId}.`);
            }
          } else {
            console.log("No TVs found in the specified column.");
          }
        });
      } else {
        console.log("Document with ID does not exist: ", columnId);
      }
    } catch (error) {
      console.error("Error deleting TV from document: ", error);
    }
  },

  removeCategory: async(category) => {
    try {
      console.log("indside ategory delete");
      const q = query(collection(db, "urls"), where("category", "==", category));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.size > 0) {
        
        querySnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
          console.log("Document deleted with ID: ", category);
        });

        return "deleted";
      }  else {
        console.log("Document with ID does not exist: ", category);
      }
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  },

  saveURLs: async (urls) => {
    try {
      
      const querySnapshot = await getDocs(collection(db, "urls"));
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
      
      await Promise.all(
        Object.entries(urls).map(async ([category, urlArray]) => {
          await addDoc(collection(db, "urls"), { category, urlArray });
        })
      );

      console.log("URLs saved to Firebase successfully!");
    } catch (error) {
      console.error("Error saving URLs to Firebase: ", error);
    }
  },

  getURLsFromFireStore: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "urls"));
      const urls = {};
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        urls[data.category] = data.urlArray;
      });
      console.log("URLs retrieved from Firebase:", urls);
      return urls;
    } catch (error) {
      console.error("Error getting URLs from Firebase: ", error);
      return {};
    }
  },

  removeURL: async (url, category) => {
    try {
        console.log("url:", url, "category:", category);
        const q = query(collection(db, "urls"), where("category", "==", category));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.size > 0) {
            querySnapshot.forEach(async (docSnapshot) => {
                const categoryData = docSnapshot.data();

                if (categoryData && categoryData.urlArray.length > 0) {
                    const updatedUrlArray = categoryData.urlArray.filter(urlEntry => {
                      return !(url in urlEntry);
                  });

                    const docRef = doc(db, "urls", docSnapshot.id);
                    await updateDoc(docRef, { urlArray: updatedUrlArray });

                    console.log(`URL ${url} removed from category ${category}`);
                }
            });
        } else {
            console.log(`No document found for category ${category}`);
        }
    } catch (error) {
        console.log("Error in removing URL from Firebase:", error);
    }
  }
  
};


export default firebaseService;


