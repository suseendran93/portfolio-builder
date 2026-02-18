import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "firebase/auth";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore"; // Import directly
import { db } from "../firebase"; // Import db directly

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userData, setUserData] = useState({ tier: 'BASIC' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let userDocUnsubscribe = null;

        const authUnsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);

            // Cleanup previous document listener if it exists
            if (userDocUnsubscribe) {
                userDocUnsubscribe();
                userDocUnsubscribe = null;
            }

            if (user) {
                const userRef = doc(db, "users", user.uid);

                // Set up real-time listener for user data
                userDocUnsubscribe = onSnapshot(userRef, (snapshot) => {
                    if (snapshot.exists()) {
                        setUserData(snapshot.data());
                    } else {
                        // If no doc exists, create it
                        const initialData = { tier: 'BASIC', email: user.email };
                        setDoc(userRef, initialData);
                        setUserData(initialData);
                    }
                }, (error) => {
                    console.error("Error listening to user data:", error);
                });
            } else {
                setUserData({ tier: 'BASIC' });
            }
            setLoading(false);
        });

        return () => {
            authUnsubscribe();
            if (userDocUnsubscribe) userDocUnsubscribe();
        };
    }, []);

    // Helper functions...
    function signup(email, password) {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    function logout() {
        return signOut(auth);
    }

    const value = {
        currentUser,
        userData, // Expose tier data
        login,
        signup,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
