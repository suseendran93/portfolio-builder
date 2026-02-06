import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PortfolioContext } from '../../context/PortfolioContext';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { FaUser, FaGraduationCap, FaBriefcase, FaCode, FaEnvelope, FaImage, FaTrash, FaPlus, FaCheck, FaEye, FaSignOutAlt, FaMagic, FaCopy, FaTimes } from 'react-icons/fa';

const Builder = () => {
    const { portfolioData, updatePortfolioData } = useContext(PortfolioContext);
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('about');
    const [showModal, setShowModal] = useState(false);
    const [generatedUrl, setGeneratedUrl] = useState('');
    const [generating, setGenerating] = useState(false);

    // Validation State
    const [validationErrors, setValidationErrors] = useState([]);
    const [isPortfolioReady, setIsPortfolioReady] = useState(false);

    // Local state for form data
    const [localData, setLocalData] = useState({
        name: "",
        title: "",
        profilePic: null,
        about: "",
        education: [],
        work: [],
        skills: [],
        contact: { phone: "", email: "", linkedin: "", github: "" }
    });

    const [hasChanges, setHasChanges] = useState({});

    // Check validation whenever data changes
    useEffect(() => {
        validatePortfolio(localData);
    }, [localData]);

    const validatePortfolio = (data) => {
        const errors = [];
        if (!data.name?.trim()) errors.push("Full Name");
        if (!data.title?.trim()) errors.push("Job Title");
        if (!data.about?.trim()) errors.push("About/Bio");
        if (!data.profilePic) errors.push("Profile Picture");
        if (!data.contact?.email?.trim()) errors.push("Email");
        if (!data.contact?.phone?.trim()) errors.push("Phone");

        if (data.education?.length === 0) errors.push("Education (at least one)");
        if (data.work?.length === 0) errors.push("Work Experience (at least one)");
        if (data.skills?.length === 0) errors.push("Skills (at least one)");

        setValidationErrors(errors);
        setIsPortfolioReady(errors.length === 0);
    };

    useEffect(() => {
        if (portfolioData) {
            setLocalData({
                name: portfolioData.name || "",
                title: portfolioData.title || "",
                profilePic: portfolioData.profilePic || null,
                about: portfolioData.about || "",
                education: portfolioData.education || [],
                work: portfolioData.work || [],
                skills: portfolioData.skills || [],
                contact: portfolioData.contact || { phone: "", email: "", linkedin: "", github: "" }
            });
        }
    }, [portfolioData]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
            toast.success("Logged out successfully");
        } catch (error) {
            console.error("Logout Error:", error);
            toast.error('Failed to log out: ' + error.message);
        }
    };

    const handlePreview = () => {
        if (!isPortfolioReady) {
            toast.error("Please fill in all required fields to preview.");
            return;
        }
        navigate('/preview');
    };

    const handleGeneratePortfolio = async () => {
        if (!currentUser) return toast.error("Please log in to publish.");
        if (!isPortfolioReady) return toast.error("Please fill in all required fields before publishing.");

        setGenerating(true);
        try {
            const cleanData = JSON.parse(JSON.stringify(portfolioData));
            let urlSlug = cleanData.customSlug;
            if (!urlSlug) {
                const namePart = (cleanData.name || "user").toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                const randomPart = Math.floor(1000 + Math.random() * 9000);
                urlSlug = `${namePart}-${randomPart}`;
                cleanData.customSlug = urlSlug;
                updatePortfolioData('customSlug', urlSlug);
            }
            await setDoc(doc(db, "portfolios", currentUser.uid), cleanData);
            const baseUrl = window.location.href.split('#')[0].replace(/\/$/, "");
            setGeneratedUrl(`${baseUrl}/#/p/${urlSlug}`);
            setShowModal(true);
            toast.success("Portfolio published successfully!");
        } catch (error) {
            toast.error("Failed to generate portfolio: " + error.message);
        } finally {
            setGenerating(false);
        }
    };

    const handleSave = (section) => {
        if (section === 'about') {
            updatePortfolioData('name', localData.name);
            updatePortfolioData('title', localData.title);
            updatePortfolioData('profilePic', localData.profilePic);
            updatePortfolioData('about', localData.about);

            setHasChanges(prev => ({
                ...prev,
                name: false,
                title: false,
                profilePic: false,
                about: false
            }));
        } else {
            updatePortfolioData(section, localData[section]);
            setHasChanges(prev => ({ ...prev, [section]: false }));
        }

        const sectionName = section === 'about' ? 'Profile' : section.charAt(0).toUpperCase() + section.slice(1);
        toast.success(`${sectionName} saved!`);
    };

    const handleLocalChange = (section, newData) => {
        setLocalData(prev => ({ ...prev, [section]: newData }));
        setHasChanges(prev => ({ ...prev, [section]: true }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => handleLocalChange('profilePic', reader.result);
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <div className="bg-indigo-600 text-white p-2 rounded-lg">
                                <FaMagic />
                            </div>
                            <h1 className="text-xl font-bold text-slate-900 hidden sm:block">BuildFolio</h1>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="text-sm text-slate-500 hidden md:block">
                                {currentUser?.email}
                            </span>
                            <div className="h-6 w-px bg-slate-200 hidden md:block"></div>

                            <button
                                onClick={handleGeneratePortfolio}
                                disabled={generating || !isPortfolioReady}
                                className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors text-sm font-medium ${generating || !isPortfolioReady
                                    ? 'bg-slate-300 cursor-not-allowed'
                                    : 'bg-emerald-600 hover:bg-emerald-700'
                                    }`}
                                title={!isPortfolioReady ? `Missing: ${validationErrors.join(', ')}` : "Publish to live URL"}
                            >
                                <FaMagic className={generating ? "animate-spin" : ""} />
                                {generating ? 'Building...' : 'Publish'}
                            </button>

                            <button
                                onClick={handlePreview}
                                disabled={!isPortfolioReady}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${!isPortfolioReady
                                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                    : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                                    }`}
                                title={!isPortfolioReady ? "Complete required fields to preview" : "Preview Portfolio"}
                            >
                                <FaEye /> <span className="hidden sm:inline">Preview</span>
                            </button>

                            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-slate-800 transition-colors text-sm">
                                <FaSignOutAlt />
                            </button>
                        </div >
                    </div >
                </div >
            </header >

            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Sidebar Tabs */}
                    <div className="lg:col-span-3">
                        <nav className="space-y-1">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all
                                        ${activeTab === tab.id
                                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                            : 'text-slate-600 hover:bg-white hover:text-indigo-600'}`}
                                >
                                    {tab.icon} {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Content Area */}
                    <div className="lg:col-span-9">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 min-h-[600px]">

                            {/* Profile Tab */}
                            {activeTab === 'about' && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-4 mb-6">Profile Details</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InputGroup label="Full Name" value={localData.name} onChange={(e) => handleLocalChange('name', e.target.value)} />
                                        <InputGroup label="Job Title" value={localData.title} onChange={(e) => handleLocalChange('title', e.target.value)} />
                                    </div>

                                    <div className="mb-6">
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Profile Picture</label>
                                        <div className="flex items-center gap-6">
                                            <div className="w-24 h-24 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden shrink-0">
                                                {localData.profilePic ? (
                                                    <img src={localData.profilePic} alt="Profile" className="w-full h-full object-cover" />
                                                ) : (
                                                    <FaImage className="text-slate-400 text-2xl" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                                />
                                                <p className="mt-1 text-xs text-slate-500">Recommended: Square JPG or PNG, max 2MB.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <InputGroup label="Bio / About Me" value={localData.about} onChange={(e) => handleLocalChange('about', e.target.value)} as="textarea" rows={6} />

                                    <div className="pt-4 border-t border-slate-100">
                                        <SaveButton onSave={() => handleSave('about')} hasChange={hasChanges.name || hasChanges.title || hasChanges.profilePic || hasChanges.about} />
                                    </div>
                                </div>
                            )}

                            {/* Education Tab */}
                            {activeTab === 'education' && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
                                        <h2 className="text-2xl font-bold text-slate-900">Education</h2>
                                        <button
                                            onClick={() => handleLocalChange('education', [...localData.education, { degree: "", school: "", date: "", description: "" }])}
                                            className="text-sm flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
                                        >
                                            <FaPlus /> Add New
                                        </button>
                                    </div>

                                    {localData.education.map((edu, index) => (
                                        <div key={index} className="bg-slate-50 rounded-xl p-6 border border-slate-200 relative group">
                                            <button
                                                onClick={() => {
                                                    const newEdu = localData.education.filter((_, i) => i !== index);
                                                    handleLocalChange('education', newEdu);
                                                }}
                                                className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors p-2"
                                            >
                                                <FaTrash size={14} />
                                            </button>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                <InputGroup label="Degree" value={edu.degree || ''}
                                                    onChange={(e) => {
                                                        const newEdu = [...localData.education];
                                                        newEdu[index] = { ...newEdu[index], degree: e.target.value };
                                                        handleLocalChange('education', newEdu);
                                                    }}
                                                />
                                                <InputGroup label="School / University" value={edu.school || ''}
                                                    onChange={(e) => {
                                                        const newEdu = [...localData.education];
                                                        newEdu[index] = { ...newEdu[index], school: e.target.value };
                                                        handleLocalChange('education', newEdu);
                                                    }}
                                                />
                                                <InputGroup label="Date / Period" value={edu.date || ''}
                                                    onChange={(e) => {
                                                        const newEdu = [...localData.education];
                                                        newEdu[index] = { ...newEdu[index], date: e.target.value };
                                                        handleLocalChange('education', newEdu);
                                                    }}
                                                />
                                            </div>
                                            <InputGroup label="Description" value={edu.description || ''} as="textarea" rows={2}
                                                onChange={(e) => {
                                                    const newEdu = [...localData.education];
                                                    newEdu[index] = { ...newEdu[index], description: e.target.value };
                                                    handleLocalChange('education', newEdu);
                                                }}
                                            />
                                        </div>
                                    ))}

                                    <div className="pt-4 border-t border-slate-100">
                                        <SaveButton onSave={() => handleSave('education')} hasChange={hasChanges.education} />
                                    </div>
                                </div>
                            )}

                            {/* Work Tab */}
                            {activeTab === 'work' && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
                                        <h2 className="text-2xl font-bold text-slate-900">Work Experience</h2>
                                        <button
                                            onClick={() => handleLocalChange('work', [...localData.work, { company: "", role: "", date: "", description: "" }])}
                                            className="text-sm flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
                                        >
                                            <FaPlus /> Add New
                                        </button>
                                    </div>

                                    {localData.work.map((wk, index) => (
                                        <div key={index} className="bg-slate-50 rounded-xl p-6 border border-slate-200 relative group">
                                            <button
                                                onClick={() => {
                                                    const newWork = localData.work.filter((_, i) => i !== index);
                                                    handleLocalChange('work', newWork);
                                                }}
                                                className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors p-2"
                                            >
                                                <FaTrash size={14} />
                                            </button>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                <InputGroup label="Company" value={wk.company || ''}
                                                    onChange={(e) => {
                                                        const newWork = [...localData.work];
                                                        newWork[index] = { ...newWork[index], company: e.target.value };
                                                        handleLocalChange('work', newWork);
                                                    }}
                                                />
                                                <InputGroup label="Role / Position" value={wk.role || ''}
                                                    onChange={(e) => {
                                                        const newWork = [...localData.work];
                                                        newWork[index] = { ...newWork[index], role: e.target.value };
                                                        handleLocalChange('work', newWork);
                                                    }}
                                                />
                                                <InputGroup label="Date / Period" value={wk.date || ''}
                                                    onChange={(e) => {
                                                        const newWork = [...localData.work];
                                                        newWork[index] = { ...newWork[index], date: e.target.value };
                                                        handleLocalChange('work', newWork);
                                                    }}
                                                />
                                            </div>
                                            <InputGroup label="Description" value={wk.description || ''} as="textarea" rows={2}
                                                onChange={(e) => {
                                                    const newWork = [...localData.work];
                                                    newWork[index] = { ...newWork[index], description: e.target.value };
                                                    handleLocalChange('work', newWork);
                                                }}
                                            />
                                        </div>
                                    ))}

                                    <div className="pt-4 border-t border-slate-100">
                                        <SaveButton onSave={() => handleSave('work')} hasChange={hasChanges.work} />
                                    </div>
                                </div>
                            )}

                            {/* Skills Tab */}
                            {activeTab === 'skills' && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
                                        <h2 className="text-2xl font-bold text-slate-900">Skills</h2>
                                        <button
                                            onClick={() => handleLocalChange('skills', [...localData.skills, { name: "New Skill", percent: 50 }])}
                                            className="text-sm flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
                                        >
                                            <FaPlus /> Add New
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {localData.skills.map((skill, index) => (
                                            <div key={index} className="bg-slate-50 p-4 rounded-xl border border-slate-200 relative">
                                                <button
                                                    onClick={() => {
                                                        const newSkills = localData.skills.filter((_, i) => i !== index);
                                                        handleLocalChange('skills', newSkills);
                                                    }}
                                                    className="absolute top-2 right-2 text-slate-400 hover:text-red-500 p-1"
                                                >
                                                    <FaTrash size={12} />
                                                </button>

                                                <div className="mt-2 space-y-3">
                                                    <div>
                                                        <label className="text-xs font-semibold text-slate-500 uppercase">Skill Name</label>
                                                        <input
                                                            type="text"
                                                            className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-sm mt-1 focus:ring-1 focus:ring-indigo-500 outline-none"
                                                            value={skill.name || ''}
                                                            onChange={(e) => {
                                                                const newSkills = [...localData.skills];
                                                                newSkills[index] = { ...newSkills[index], name: e.target.value };
                                                                handleLocalChange('skills', newSkills);
                                                            }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs font-semibold text-slate-500 uppercase flex justify-between">
                                                            <span>Proficiency</span>
                                                            <span>{skill.percent}%</span>
                                                        </label>
                                                        <input
                                                            type="range"
                                                            min="0" max="100"
                                                            className="w-full mt-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                                            value={skill.percent || 0}
                                                            onChange={(e) => {
                                                                const newSkills = [...localData.skills];
                                                                newSkills[index] = { ...newSkills[index], percent: e.target.value };
                                                                handleLocalChange('skills', newSkills);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-4 border-t border-slate-100">
                                        <SaveButton onSave={() => handleSave('skills')} hasChange={hasChanges.skills} />
                                    </div>
                                </div>
                            )}

                            {/* Contact Tab */}
                            {activeTab === 'contact' && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-4 mb-6">Contact Information</h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InputGroup label="Phone Number" value={localData.contact.phone || ''} onChange={(e) => handleLocalChange('contact', { ...localData.contact, phone: e.target.value })} />
                                        <InputGroup label="Email Address" type="email" value={localData.contact.email || ''} onChange={(e) => handleLocalChange('contact', { ...localData.contact, email: e.target.value })} />
                                        <InputGroup label="LinkedIn URL" value={localData.contact.linkedin || ''} onChange={(e) => handleLocalChange('contact', { ...localData.contact, linkedin: e.target.value })} />
                                        <InputGroup label="GitHub URL" value={localData.contact.github || ''} onChange={(e) => handleLocalChange('contact', { ...localData.contact, github: e.target.value })} />
                                    </div>

                                    <div className="pt-4 border-t border-slate-100">
                                        <SaveButton onSave={() => handleSave('contact')} hasChange={hasChanges.contact} />
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </main>

            {/* Generated URL Modal */}
            {
                showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all scale-100">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-bold text-slate-900">🚀 Portfolio Published!</h3>
                                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                                    <FaTimes />
                                </button>
                            </div>

                            <p className="text-slate-600 mb-6">
                                Your portfolio is now live and ready to share with the world.
                            </p>

                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6 break-all">
                                <a href={generatedUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline font-medium text-sm">
                                    {generatedUrl}
                                </a>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(generatedUrl);
                                        toast.success("Link copied!");
                                    }}
                                    className="flex-1 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    <FaCopy /> Copy Link
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

// UI Components Helpers
const InputGroup = ({ label, value, onChange, type = "text", placeholder = "", as = "input", rows }) => (
    <div className="mb-4">
        <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
        {as === "textarea" ? (
            <textarea
                rows={rows || 4}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-900 bg-white"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />
        ) : (
            <input
                type={type}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-900 bg-white"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />
        )}
    </div>
);

const SaveButton = ({ onSave, hasChange, label = "Save Changes", savedLabel = "Saved" }) => (
    <button
        onClick={onSave}
        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all shadow-sm
            ${hasChange
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
    >
        <FaCheck /> {hasChange ? label : savedLabel}
    </button>
);

const tabs = [
    { id: 'about', label: 'Profile', icon: <FaUser /> },
    { id: 'education', label: 'Education', icon: <FaGraduationCap /> },
    { id: 'work', label: 'Experience', icon: <FaBriefcase /> },
    { id: 'skills', label: 'Skills', icon: <FaCode /> },
    { id: 'contact', label: 'Contact', icon: <FaEnvelope /> },
];

export default Builder;
