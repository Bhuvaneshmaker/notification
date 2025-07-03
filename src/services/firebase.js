import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDocs, deleteDoc, query, orderBy } from 'firebase/firestore';

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const employeeService = {
  // Add employee in the database
  async addEmployee(employee) {
    try {
      const id = String(employee.id || Date.now());
      const docRef = doc(db, 'employees', id);
      await setDoc(docRef, {
        ...employee,
        createdAt: new Date().toISOString(),
      });
      return { id, ...employee };
    } catch (error) {
      console.error('Error adding employee:', error);
      throw error;
    }
  },

  // Get all employees from the database
  async getEmployees() {
    try {
      const q = query(collection(db, 'employees'), orderBy('id'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  },

  // Delete employee from the database
  async deleteEmployee(employeeId) {
    try {
      const docRef = doc(db, 'employees', employeeId);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error('Error deleting employee:', error);
      throw error;
    }
  },
};
