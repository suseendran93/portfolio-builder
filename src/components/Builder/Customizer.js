import React, { useState } from 'react';
import { FaPalette, FaDesktop, FaFileAlt, FaCheck, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import './Customizer.scss';

const Customizer = ({ localData, setLocalData, onComplete, onBack }) => {
    const [step, setStep] = useState(1); // 1: Portfolio, 2: Resume

    const portfolioOptions = {
        layouts: [
            { id: 'modern', name: 'Modern', description: 'Clean and professional with 70/30 split' },
            { id: 'classic', name: 'Classic', description: 'Traditional centered layout' },
            { id: 'creative', name: 'Creative', description: 'Bold typography and dynamic shapes' }
        ],
        themes: [
            { id: 'light', name: 'Light', bg: 'bg-slate-50', text: 'text-slate-900' },
            { id: 'dark', name: 'Dark', bg: 'bg-slate-900', text: 'text-slate-50' },
            { id: 'royal', name: 'Royal', bg: 'bg-indigo-900', text: 'text-white' }
        ]
    };

    const resumeOptions = {
        layouts: [
            { id: 'standard', name: 'Standard', description: 'Best for ATS compatibility' },
            { id: 'executive', name: 'Executive', description: 'Sleek design for senior roles' },
            { id: 'minimal', name: 'Minimal', description: 'Elegant and whitespace-focused' }
        ]
    };

    const updatePortfolio = (field, value) => {
        setLocalData(prev => ({
            ...prev,
            customization: {
                ...prev.customization,
                portfolio: {
                    ...prev.customization.portfolio,
                    [field]: value
                }
            }
        }));
    };

    const updateResume = (field, value) => {
        setLocalData(prev => ({
            ...prev,
            customization: {
                ...prev.customization,
                resume: {
                    ...prev.customization.resume,
                    [field]: value
                }
            }
        }));
    };

    return (
        <div className="customizer">
            <div className="customizer__header">
                <div>
                    <h2 className="customizer__title">Customize Your Style</h2>
                    <p className="customizer__subtitle">
                        {step === 1 ? 'Design your online portfolio' : 'Style your downloadable resume'}
                    </p>
                </div>
                <div className="customizer__progress">
                    <div className={`customizer__progress-bar ${step >= 1 ? 'customizer__progress-bar--active' : ''}`} />
                    <div className={`customizer__progress-bar ${step >= 2 ? 'customizer__progress-bar--active' : ''}`} />
                </div>
            </div>

            {step === 1 ? (
                <div className="customizer__body">
                    {/* Portfolio Layouts */}
                    <section className="customizer__section">
                        <h3 className="customizer__section-title">
                            <FaDesktop className="customizer__section-icon" /> Choose Portfolio Layout
                        </h3>
                        <div className="customizer__option-grid">
                            {portfolioOptions.layouts.map(layout => (
                                <button
                                    key={layout.id}
                                    onClick={() => updatePortfolio('layout', layout.id)}
                                    className={`customizer__option-card ${localData.customization.portfolio.layout === layout.id
                                            ? 'customizer__option-card--selected'
                                            : 'customizer__option-card--default'
                                        }`}
                                >
                                    <div className="customizer__option-meta">
                                        <span className="customizer__option-name">{layout.name}</span>
                                        {localData.customization.portfolio.layout === layout.id && <FaCheck className="customizer__check" size={12} />}
                                    </div>
                                    <p className="customizer__option-description">{layout.description}</p>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Portfolio Themes */}
                    <section className="customizer__section">
                        <h3 className="customizer__section-title">
                            <FaPalette className="customizer__section-icon" /> Select Theme
                        </h3>
                        <div className="customizer__option-grid">
                            {portfolioOptions.themes.map(theme => (
                                <button
                                    key={theme.id}
                                    onClick={() => updatePortfolio('theme', theme.id)}
                                    className={`customizer__theme-card ${localData.customization.portfolio.theme === theme.id
                                            ? 'customizer__theme-card--selected'
                                            : 'customizer__theme-card--default'
                                        } ${theme.id === 'light' ? 'customizer__theme-card--light' : theme.id === 'dark' ? 'customizer__theme-card--dark' : 'customizer__theme-card--royal'}`}
                                >
                                    <div className="customizer__theme-content">
                                        <span className={`customizer__theme-name ${theme.id === 'light' ? 'customizer__theme-name--light' : 'customizer__theme-name--dark'}`}>{theme.name}</span>
                                        {localData.customization.portfolio.theme === theme.id && <FaCheck className="customizer__theme-check" />}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Color Picker */}
                    <section className="customizer__section">
                        <h3 className="customizer__section-title">
                            <span className="customizer__section-chip">#</span> Portfolio Accent Color
                        </h3>
                        <div className="customizer__color-card">
                            <input
                                type="color"
                                value={localData.customization.portfolio.accentColor}
                                onChange={(e) => updatePortfolio('accentColor', e.target.value)}
                                className="customizer__color-input"
                            />
                            <div className="customizer__color-field">
                                <input
                                    type="text"
                                    value={localData.customization.portfolio.accentColor}
                                    onChange={(e) => updatePortfolio('accentColor', e.target.value)}
                                    className="customizer__color-text"
                                    placeholder="#000000"
                                />
                            </div>
                            <p className="customizer__color-help">This color will be used for buttons, links, and highlights.</p>
                        </div>
                    </section>
                </div>
            ) : (
                <div className="customizer__body">
                    {/* Resume Layouts */}
                    <section className="customizer__section">
                        <h3 className="customizer__section-title">
                            <FaFileAlt className="customizer__section-icon" /> Choose Resume Layout
                        </h3>
                        <div className="customizer__option-grid">
                            {resumeOptions.layouts.map(layout => (
                                <button
                                    key={layout.id}
                                    onClick={() => updateResume('layout', layout.id)}
                                    className={`customizer__option-card ${localData.customization.resume.layout === layout.id
                                            ? 'customizer__option-card--selected'
                                            : 'customizer__option-card--default'
                                        }`}
                                >
                                    <div className="customizer__option-meta">
                                        <span className="customizer__option-name">{layout.name}</span>
                                        {localData.customization.resume.layout === layout.id && <FaCheck className="customizer__check" size={12} />}
                                    </div>
                                    <p className="customizer__option-description">{layout.description}</p>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Resume Accent Color */}
                    <section className="customizer__section">
                        <h3 className="customizer__section-title">
                            <span className="customizer__section-chip">#</span> Resume Accent Color
                        </h3>
                        <div className="customizer__color-card">
                            <input
                                type="color"
                                value={localData.customization.resume.accentColor}
                                onChange={(e) => updateResume('accentColor', e.target.value)}
                                className="customizer__color-input"
                            />
                            <div className="customizer__color-field">
                                <input
                                    type="text"
                                    value={localData.customization.resume.accentColor}
                                    onChange={(e) => updateResume('accentColor', e.target.value)}
                                    className="customizer__color-text"
                                    placeholder="#000000"
                                />
                            </div>
                            <p className="customizer__color-help">Used for resume headings and section dividers.</p>
                        </div>
                    </section>
                </div>
            )}

            {/* Navigation */}
            <div className="customizer__footer">
                <button
                    onClick={step === 1 ? onBack : () => setStep(1)}
                    className="customizer__footer-action customizer__footer-action--secondary"
                >
                    <FaArrowLeft /> {step === 1 ? 'Back to Data' : 'Portfolio Setup'}
                </button>
                <button
                    onClick={step === 1 ? () => setStep(2) : onComplete}
                    className="customizer__footer-action customizer__footer-action--primary"
                >
                    {step === 1 ? 'Next: Resume Style' : 'Complete Selection'} <FaArrowRight />
                </button>
            </div>
        </div>
    );
};

export default Customizer;
