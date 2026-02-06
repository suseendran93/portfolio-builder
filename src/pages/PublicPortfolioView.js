import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { PortfolioContext } from '../context/PortfolioContext';
import PortfolioView from './PortfolioView';

const PublicPortfolioView = () => {
    const { userId } = useParams();
    const [portfolioData, setPortfolioData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Create a dummy update function since public view is read-only
    const updatePortfolioData = () => {
        console.warn("Attempted to update portfolio in public view");
    };

    useEffect(() => {
        const fetchPortfolio = async () => {
            if (!userId) {
                setError("Invalid URL.");
                setLoading(false);
                return;
            }

            try {
                // STRATEGY: 
                // 1. Assume 'userId' param is a Custom Slug -> Attempt Query
                // 2. If no result -> Assume 'userId' is a raw Doc ID -> Attempt Direct Fetch

                let foundData = null;

                // Step 1: Query by customSlug
                const q = query(collection(db, "portfolios"), where("customSlug", "==", userId));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    // Match found by slug!
                    foundData = querySnapshot.docs[0].data();
                    console.log("Found portfolio by Slug lookup.");
                } else {
                    // Step 2: Fallback to Direct ID fetch (Legacy support or if slug == uid)
                    console.log("Slug lookup failed. Trying direct Doc ID lookup...");
                    const docRef = doc(db, "portfolios", userId);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        foundData = docSnap.data();
                        console.log("Found portfolio by Direct ID lookup.");
                    }
                }

                if (foundData) {
                    setPortfolioData(foundData);
                } else {
                    setError("Portfolio not found.");
                }

            } catch (err) {
                console.error("Error fetching portfolio:", err);
                setError("Failed to load portfolio.");
            } finally {
                setLoading(false);
            }
        };

        fetchPortfolio();
    }, [userId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
                <div className="bg-red-50 text-red-600 p-6 rounded-lg max-w-md w-full text-center border border-red-200 shadow-md">
                    <p className="font-semibold text-lg mb-2">Error</p>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <PortfolioContext.Provider value={{ portfolioData, updatePortfolioData }}>
            <PortfolioView publicMode={true} />
        </PortfolioContext.Provider>
    );
};

export default PublicPortfolioView;
