import React, { useState } from 'react';
import { FaPalette, FaDesktop, FaFileAlt, FaCheck, FaArrowRight, FaArrowLeft } from 'react-icons/fa';

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
        <div className="max-w-4xl mx-auto py-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900">Customize Your Style</h2>
                    <p className="text-slate-500 mt-1">
                        {step === 1 ? 'Design your online portfolio' : 'Style your downloadable resume'}
                    </p>
                </div>
                <div className="flex gap-2">
                    <div className={`h-2 w-12 rounded-full ${step >= 1 ? 'bg-indigo-600' : 'bg-slate-200'}`} />
                    <div className={`h-2 w-12 rounded-full ${step >= 2 ? 'bg-indigo-600' : 'bg-slate-200'}`} />
                </div>
            </div>

            {step === 1 ? (
                <div className="space-y-8">
                    {/* Portfolio Layouts */}
                    <section>
                        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                            <FaDesktop className="text-indigo-600" /> Choose Portfolio Layout
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {portfolioOptions.layouts.map(layout => (
                                <button
                                    key={layout.id}
                                    onClick={() => updatePortfolio('layout', layout.id)}
                                    className={`p-4 rounded-xl border-2 text-left transition-all hover:shadow-md ${localData.customization.portfolio.layout === layout.id
                                            ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600'
                                            : 'border-slate-200 hover:border-slate-300 bg-white'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-bold text-slate-900">{layout.name}</span>
                                        {localData.customization.portfolio.layout === layout.id && <FaCheck className="text-indigo-600" size={12} />}
                                    </div>
                                    <p className="text-xs text-slate-500">{layout.description}</p>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Portfolio Themes */}
                    <section>
                        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                            <FaPalette className="text-indigo-600" /> Select Theme
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {portfolioOptions.themes.map(theme => (
                                <button
                                    key={theme.id}
                                    onClick={() => updatePortfolio('theme', theme.id)}
                                    className={`p-4 rounded-xl border-2 transition-all hover:shadow-md ${localData.customization.portfolio.theme === theme.id
                                            ? 'border-indigo-600 ring-1 ring-indigo-600'
                                            : 'border-slate-200 hover:border-slate-300'
                                        } ${theme.bg}`}
                                >
                                    <div className="flex flex-col items-center">
                                        <span className={`font-bold ${theme.text}`}>{theme.name}</span>
                                        {localData.customization.portfolio.theme === theme.id && <FaCheck className="mt-2 text-indigo-400" />}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Color Picker */}
                    <section>
                        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2 text-slate-800">
                            <span className="p-1 px-2 border rounded-md">#</span> Portfolio Accent Color
                        </h3>
                        <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <input
                                type="color"
                                value={localData.customization.portfolio.accentColor}
                                onChange={(e) => updatePortfolio('accentColor', e.target.value)}
                                className="w-12 h-12 rounded cursor-pointer border-none bg-transparent"
                            />
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={localData.customization.portfolio.accentColor}
                                    onChange={(e) => updatePortfolio('accentColor', e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="#000000"
                                />
                            </div>
                            <p className="text-xs text-slate-400">This color will be used for buttons, links, and highlights.</p>
                        </div>
                    </section>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Resume Layouts */}
                    <section>
                        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                            <FaFileAlt className="text-indigo-600" /> Choose Resume Layout
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {resumeOptions.layouts.map(layout => (
                                <button
                                    key={layout.id}
                                    onClick={() => updateResume('layout', layout.id)}
                                    className={`p-4 rounded-xl border-2 text-left transition-all hover:shadow-md ${localData.customization.resume.layout === layout.id
                                            ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600'
                                            : 'border-slate-200 hover:border-slate-300 bg-white'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-bold text-slate-900">{layout.name}</span>
                                        {localData.customization.resume.layout === layout.id && <FaCheck className="text-indigo-600" size={12} />}
                                    </div>
                                    <p className="text-xs text-slate-500">{layout.description}</p>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Resume Accent Color */}
                    <section>
                        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                            <span className="p-1 px-2 border rounded-md">#</span> Resume Accent Color
                        </h3>
                        <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <input
                                type="color"
                                value={localData.customization.resume.accentColor}
                                onChange={(e) => updateResume('accentColor', e.target.value)}
                                className="w-12 h-12 rounded cursor-pointer border-none bg-transparent"
                            />
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={localData.customization.resume.accentColor}
                                    onChange={(e) => updateResume('accentColor', e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="#000000"
                                />
                            </div>
                            <p className="text-xs text-slate-400">Used for resume headings and section dividers.</p>
                        </div>
                    </section>
                </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-12 pt-8 border-t border-slate-100">
                <button
                    onClick={step === 1 ? onBack : () => setStep(1)}
                    className="flex items-center gap-2 px-6 py-2 text-slate-600 font-medium hover:text-slate-900 transition-colors"
                >
                    <FaArrowLeft /> {step === 1 ? 'Back to Data' : 'Portfolio Setup'}
                </button>
                <button
                    onClick={step === 1 ? () => setStep(2) : onComplete}
                    className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                >
                    {step === 1 ? 'Next: Resume Style' : 'Complete Selection'} <FaArrowRight />
                </button>
            </div>
        </div>
    );
};

export default Customizer;
