import React, { createContext, useState, useEffect, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { loadPortfolioForUser } from '../utils/portfolioStorage';
import { createDefaultPortfolioData, normalizePortfolioData } from '../utils/customization';

export const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [portfolioData, setPortfolioData] = useState(createDefaultPortfolioData);

  // Fetch data when user logs in or changes
  useEffect(() => {
        const fetchData = async () => {
      if (currentUser) {
        console.log("PortfolioContext: Fetching data for user:", currentUser.uid);
        try {
          const storedPortfolio = await loadPortfolioForUser(currentUser.uid);

          if (storedPortfolio) {
            console.log("PortfolioContext: Loaded portfolio data from Firestore");
            setPortfolioData(normalizePortfolioData(storedPortfolio));
          } else {
            console.log("PortfolioContext: No existing data in Firestore, using empty state");
            setPortfolioData(createDefaultPortfolioData());
          }
        } catch (error) {
          console.error("PortfolioContext: Error fetching portfolio data:", error);
        }
      } else {
        // User is logged out, reset state
        console.log("PortfolioContext: User logged out, clearing state");
        setPortfolioData(createDefaultPortfolioData());
      }
    };

    fetchData();
  }, [currentUser]);

  const replacePortfolioData = (nextData) => {
    setPortfolioData(normalizePortfolioData(nextData));
  };

  const updatePortfolioData = (section, data) => {
    setPortfolioData(prev => normalizePortfolioData({
      ...prev,
      [section]: data
    }));
  };

  const value = useMemo(() => ({
    portfolioData,
    updatePortfolioData,
    replacePortfolioData
  }), [portfolioData]);

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
};
