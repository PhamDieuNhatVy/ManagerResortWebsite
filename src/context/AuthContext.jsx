// src/context/AuthContext.js
import { createContext, useState, useEffect, useContext } from 'react';
import { auth } from '../firebase'; // Cấu hình Firebase
import { onAuthStateChanged } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase'; // Firestore configuration

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Lấy role từ Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            role: userDoc.data().role, // Lấy role từ Firestore
          };
          setUser(userData);
        } else {
          setUser(null); // Nếu không có user, set null
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
