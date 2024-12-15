import { createContext, useState, useEffect, useContext } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { getDoc, doc, updateDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            role: userDoc.data().role || 'user',
            username: userDoc.data().username || '',
            cccd: userDoc.data().cccd || '',
            address: userDoc.data().address || '',
            age: userDoc.data().age || '',
            phone: userDoc.data().phone || '',
          };
          setUser(userData);
        } else {
          setUser(null);
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

      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (userDoc.exists()) {
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          role: userDoc.data().role || 'user',
          username: userDoc.data().username || '',
          cccd: userDoc.data().cccd || '',
          address: userDoc.data().address || '',
          age: userDoc.data().age || '',
          phone: userDoc.data().phone || '',
        };
        setUser(userData);
        return userData;
      } else {
        throw new Error('User data not found.');
      }
    } catch (error) {
      console.error('Login error:', error.message);
      throw error;
    }
  };

  const updateUser = async (updatedData) => {
    try {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, updatedData);
        setUser((prevUser) => ({
          ...prevUser,
          ...updatedData,
        }));
      } else {
        throw new Error('User is not authenticated.');
      }
    } catch (error) {
      console.error('Error updating user:', error.message);
      throw error;
    }
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Error sending password reset email:', error.message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, login, updateUser, resetPassword }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
