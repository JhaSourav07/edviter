"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";
import api from "../lib/axios";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [dbUser, setDbUser] = useState(null); // The user data from MongoDB
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // We will fetch their MongoDB profile here later
      } else {
        setUser(null);
        setDbUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Notice how we require a 'role' when they sign up!
  const loginWithGoogle = async (role = "editor") => {
    try {
      const result = await signInWithPopup(auth, googleProvider);

      // The moment they log into Firebase, we sync them to our Node.js backend!
      // Since we use our custom 'api' instance, the token is automatically attached.
      const response = await api.post("/auth/sync", {
        role: role,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
      });

      setDbUser(response.data.user);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setDbUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, dbUser, loading, loginWithGoogle, logout }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
