//  https://medium.com/@jackpritomsoren/building-a-firebase-authentication-and-private-route-system-in-a-react-app-98113229ad67

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import {auth, db} from "./FirebaseConfig";

export const AuthContext = createContext(null);

/**
 * Provides authentication functionality for the application.
 * Contributes to FR-1 and FR-2
 * @param children - The child components to be wrapped by the AuthProvider.
 * @returns The AuthProvider component.
 */
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Creates a new user with the specified email and password.
   * @param email - The email of the user.
   * @param password - The password of the user.
   * @returns A promise that resolves when the user is created.
   */
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  /**
   * Logs in a user with the specified email and password.
   * @param email - The email of the user.
   * @param password - The password of the user.
   * @returns A promise that resolves when the user is logged in.
   */
  const loginUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  /**
   * Logs out the currently authenticated user.
   * @returns A promise that resolves when the user is logged out.
   */
  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  useEffect(() => {
    /**
     * Subscribes to changes in the authentication state.
     * @param currentUser - The current authenticated user.
     */
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const authValue = {
    createUser,
    user,
    loginUser,
    logOut,
    loading,
  };

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;