import React, { createContext, useState, useEffect, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { loadPortfolioForUser } from '../utils/portfolioStorage';

export const PortfolioContext = createContext();

const getInitialState = () => ({
  about: "",
  name: "",
  title: "",
  profilePic: null,
  work: [],
  education: [],
  skills: [],
  customSlug: "",
  published: false,
  publishedAt: null,
  contact: {
    phone: "",
    email: "",
    github: "",
    linkedin: ""
  },
  customization: {
    portfolio: {
      layout: "modern",
      theme: "light",
      accentColor: "#4f46e5"
    },
    resume: {
      layout: "standard",
      theme: "classic",
      accentColor: "#1e293b"
    }
  }
});

export const PortfolioProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [portfolioData, setPortfolioData] = useState(getInitialState());

  // Fetch data when user logs in or changes
  useEffect(() => {
        const fetchData = async () => {
      if (currentUser) {
        console.log("PortfolioContext: Fetching data for user:", currentUser.uid);
        try {
          const storedPortfolio = await loadPortfolioForUser(currentUser.uid);

          if (storedPortfolio) {
            console.log("PortfolioContext: Loaded portfolio data from Firestore");
            setPortfolioData(prev => ({
              ...prev,
              ...storedPortfolio
            }));
          } else {
            console.log("PortfolioContext: No existing data in Firestore, using empty state");
            setPortfolioData(getInitialState());
          }
        } catch (error) {
          console.error("PortfolioContext: Error fetching portfolio data:", error);
        }
      } else {
        // User is logged out, reset state
        console.log("PortfolioContext: User logged out, clearing state");
        setPortfolioData(getInitialState());
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
