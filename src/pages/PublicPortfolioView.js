import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PortfolioContext } from '../context/PortfolioContext';
import PortfolioView from './PortfolioView';
import { loadPublicPortfolioBySlug } from '../utils/portfolioStorage';

const PublicPortfolioView = () => {
    const { slug } = useParams();
    const [portfolioData, setPortfolioData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Create a dummy update function since public view is read-only
    const updatePortfolioData = () => {
        console.warn("Attempted to update portfolio in public view");
    };

    useEffect(() => {
        const fetchPortfolio = async () => {
            if (!slug) {
                setError("Invalid URL.");
                setLoading(false);
                return;
            }

            try {
                const foundData = await loadPublicPortfolioBySlug(slug);

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
    }, [slug]);

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
