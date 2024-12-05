import { createContext, useState, useEffect, useContext } from 'react';
import { auth, db } from '../firebase'; // Firebase configuration
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            role: userDoc.data().role || 'user', // Default 'user' role if not found
            username: userDoc.data().username || '',
            cccd: userDoc.data().cccd || '',
            address: userDoc.data().address || '',
            age: userDoc.data().age || '',
            phone: userDoc.data().phone || '',
          };
          setUser(userData);
        } else {
          setUser(null); // If no user data found in Firestore
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (userDoc.exists()) {
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          role: userDoc.data().role || 'user', // Default 'user' role if not found
          username: userDoc.data().username || '',
          cccd: userDoc.data().cccd || '',
          address: userDoc.data().address || '',
          age: userDoc.data().age || '',
          phone: userDoc.data().phone || '',
        };
        setUser(userData);
        return userData; // Return user data, including role
      } else {
        throw new Error('User data not found.');
      }
    } catch (error) {
      console.error('Login error:', error.message);
      throw error; // Rethrow error to be handled in components
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, login }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
