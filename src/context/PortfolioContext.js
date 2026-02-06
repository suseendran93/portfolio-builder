import React, { createContext, useState, useEffect, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export const PortfolioContext = createContext();

const initialState = {
  about: "",
  name: "",
  title: "",
  profilePic: null,
  work: [],
  education: [],
  skills: [],
  contact: {
    phone: "",
    email: "",
    github: "",
    linkedin: ""
  }
};

export const PortfolioProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [portfolioData, setPortfolioData] = useState(initialState);

  // Fetch data when user logs in or changes
  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        try {
          const docRef = doc(db, "portfolios", currentUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            console.log("PortfolioContext: Loaded user data");
            setPortfolioData(docSnap.data());
          } else {
            console.log("PortfolioContext: No existing data, using empty state");
            setPortfolioData(initialState);
          }
        } catch (error) {
          console.error("Error fetching portfolio data:", error);
        }
      } else {
        // User is logged out, reset state
        console.log("PortfolioContext: User logged out, clearing state");
        setPortfolioData(initialState);
      }
    };

    fetchData();
  }, [currentUser]);

  const updatePortfolioData = (section, data) => {
    setPortfolioData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  const value = useMemo(() => ({
    portfolioData,
    updatePortfolioData
  }), [portfolioData]);

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
};
