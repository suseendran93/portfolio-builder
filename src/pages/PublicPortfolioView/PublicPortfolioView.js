import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PortfolioContext } from '../../context/PortfolioContext';
import PortfolioView from '../PortfolioView/PortfolioView';
import { loadPublicPortfolioBySlug } from '../../utils/portfolioStorage';
import './PublicPortfolioView.scss';

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
            <div className="public-portfolio-view public-portfolio-view--loading">
                <div className="public-portfolio-view__spinner"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="public-portfolio-view public-portfolio-view--error">
                <div className="public-portfolio-view__error-card">
                    <p className="public-portfolio-view__error-title">Error</p>
                    <p className="public-portfolio-view__error-text">{error}</p>
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
