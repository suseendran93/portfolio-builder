import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PortfolioContext } from '../../context/PortfolioContext';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { FaUser, FaGraduationCap, FaBriefcase, FaCode, FaEnvelope, FaImage, FaTrash, FaPlus, FaCheck, FaEye, FaSignOutAlt, FaMagic, FaCopy, FaTimes, FaCrown, FaPalette, FaArrowRight, FaRocket, FaExternalLinkAlt } from 'react-icons/fa';
import Customizer from './Customizer';
import { savePortfolioForUser } from '../../utils/portfolioStorage';
import { createDefaultPortfolioData, normalizePortfolioData } from '../../utils/customization';
import { isValidExternalUrlInput } from '../../utils/contact';
import { optimizeImageFile } from '../../utils/imageUpload';
import { STARTER_TEMPLATES, hasMeaningfulPortfolioContent } from '../../utils/onboarding';
import { buildPublicPortfolioUrl } from '../../utils/router';
import './Builder.scss';

// Helper: format a date string (YYYY-MM-DD) to DD-MMM-YYYY
const formatDateDisplay = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr; // fallback to raw string
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = String(d.getDate()).padStart(2, '0');
    return `${day}-${months[d.getMonth()]}-${d.getFullYear()}`;
};

const Builder = () => {
    const { portfolioData, isPortfolioLoaded, replacePortfolioData } = useContext(PortfolioContext);
    const { currentUser, userData, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('about');
    const [showModal, setShowModal] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [generatedUrl, setGeneratedUrl] = useState('');
    const [generating, setGenerating] = useState(false);
    const [isCustomizing, setIsCustomizing] = useState(false);
    const [isOnboardingDismissed, setIsOnboardingDismissed] = useState(false);

    const isPremium = userData?.tier === 'PREMIUM';

    // Validation State
    const [fieldErrors, setFieldErrors] = useState({});
    const [showAllErrors, setShowAllErrors] = useState(false);
    const [isPortfolioReady, setIsPortfolioReady] = useState(false);

    // Local state for form data
    const [localData, setLocalData] = useState(createDefaultPortfolioData);


    // Check validation whenever data changes
    useEffect(() => {
        validatePortfolio(localData);
    }, [localData]);

    const validatePortfolio = (data) => {
        const errors = {};
        if (!data.name?.trim()) errors.name = "Full Name is required";
        if (!data.title?.trim()) errors.title = "Job Title is required";
        if (!data.about?.trim()) errors.about = "About/Bio is required";
        if (!data.profilePic) errors.profilePic = "Profile Picture is required";

        if (!data.contact?.email?.trim()) {
            errors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(data.contact.email)) {
            errors.email = "Invalid email format";
        }

        if (!data.contact?.phone?.trim()) errors.phone = "Phone is required";
        if (!isValidExternalUrlInput(data.contact?.linkedin)) {
            errors.linkedin = "Enter a valid LinkedIn URL";
        }
        if (!isValidExternalUrlInput(data.contact?.github)) {
            errors.github = "Enter a valid GitHub URL";
        }

        if (!data.education || data.education.length === 0) {
            errors.education = "At least one education entry is required";
        } else {
            // Validate individual entries if needed, but keeping it simple for now
            data.education.forEach((edu, idx) => {
                if (!edu.degree?.trim() || !edu.school?.trim()) {
                    errors[`education_${idx}`] = "Degree and School are required";
                }
            });
        }

        if (!data.work || data.work.length === 0) {
            errors.work = "At least one work experience is required";
        } else {
            data.work.forEach((wk, idx) => {
                if (!wk.company?.trim() || !wk.role?.trim()) {
                    errors[`work_${idx}`] = "Company and Role are required";
                }
            });
        }

        if (!data.skills || data.skills.length === 0) {
            errors.skills = "At least one skill is required";
        } else {
            data.skills.forEach((skill, idx) => {
                if (!skill.name?.trim()) {
                    errors[`skill_${idx}`] = "Skill name is required";
                }
            });
        }

        setFieldErrors(errors);
        setIsPortfolioReady(Object.keys(errors).length === 0);
    };

    useEffect(() => {
        if (portfolioData) {
            const nextData = normalizePortfolioData(portfolioData);
            setLocalData(nextData);
            setIsOnboardingDismissed(hasMeaningfulPortfolioContent(nextData));
        }
    }, [portfolioData]);

    const syncLocalDraftToContext = (nextData = localData) => {
        replacePortfolioData(nextData);
    };

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
            setShowAllErrors(true);
            toast.error("Please fill in all required fields to preview.");
            return;
        }
        syncLocalDraftToContext();
        navigate('/preview');
    };

    const handleUpgradeToPremium = () => {
        toast.loading("Redirecting to Stripe Checkout...", { id: 'upgrade-toast' });
        if (!currentUser) {
            toast.error("Please log in to upgrade.", { id: 'upgrade-toast' });
            return;
        }

        setDoc(
            doc(db, "users", currentUser.uid),
            {
                ...userData,
                tier: 'PREMIUM',
                premiumActivatedAt: new Date().toISOString()
            },
            { merge: true }
        ).then(() => {
            toast.success("Success! You are now a PREMIUM user.", { id: 'upgrade-toast' });
            setShowUpgradeModal(false);
            navigate('/success');
        }).catch((err) => {
            console.error("Upgrade Error:", err);
            toast.error("Failed to upgrade. Please try again.", { id: 'upgrade-toast' });
        });
    };

    const saveToFirestore = async (dataToSave = localData, { publish = false } = {}) => {
        if (!currentUser) throw new Error("Please log in to save.");

        try {
            const cleanData = JSON.parse(JSON.stringify(normalizePortfolioData(dataToSave)));
            let urlSlug = cleanData.customSlug;

            if (publish && !urlSlug) {
                const namePart = (cleanData.name || "user").toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                const randomPart = Math.floor(1000 + Math.random() * 9000);
                urlSlug = `${namePart}-${randomPart}`;
                cleanData.customSlug = urlSlug;
            }

            if (publish) {
                cleanData.published = true;
                cleanData.publishedAt = cleanData.publishedAt || new Date().toISOString();
            }

            await savePortfolioForUser(currentUser.uid, cleanData, userData);
            return {
                urlSlug,
                cleanData
            };
        } catch (error) {
            console.error("Error saving to Firestore:", error);
            throw error;
        }
    };

    const handleGeneratePortfolio = async () => {
        if (!currentUser) return toast.error("Please log in to publish.");
        if (!isPremium) {
            setShowUpgradeModal(true);
            return;
        }
        if (!isPortfolioReady) {
            setShowAllErrors(true);
            return toast.error("Please fill in all required fields before publishing.");
        }

        setGenerating(true);
        try {
            // Save the latest local data before generating the URL
            const publishData = {
                ...normalizePortfolioData(localData),
                published: true,
                publishedAt: localData.publishedAt || new Date().toISOString()
            };
            const { urlSlug, cleanData } = await saveToFirestore(publishData, { publish: true });
            const nextData = normalizePortfolioData(cleanData);
            setLocalData(nextData);
            replacePortfolioData(nextData);
            setGeneratedUrl(buildPublicPortfolioUrl(urlSlug));
            setShowModal(true);
            toast.success("Portfolio published successfully!");
        } catch (error) {
            toast.error("Failed to generate portfolio: " + error.message);
        } finally {
            setGenerating(false);
        }
    };

    const handleSaveAll = async () => {
        // Run validation check
        validatePortfolio(localData);

        if (!isPortfolioReady) {
            setShowAllErrors(true);
            toast.error("Please fix the validation errors before saving.");
            return;
        }

        // Sync all local sections to PortfolioContext
        const normalizedData = normalizePortfolioData(localData);

        syncLocalDraftToContext(normalizedData);

        try {
            // Sync entire state to Firestore
            await saveToFirestore(normalizedData);
            toast.success("Changes saved.");

        } catch (error) {
            console.error("Auto-sync error:", error);
            toast.error("Saved locally, but failed to sync to database.");
        }

        setShowAllErrors(false); // Reset error display on success
    };

    const handleLocalChange = (section, newData) => {
        setLocalData(prev => ({ ...prev, [section]: newData }));
    };

    const handleApplyStarterTemplate = (templateId) => {
        const template = STARTER_TEMPLATES.find((item) => item.id === templateId);

        if (!template) {
            toast.error("Starter template not found.");
            return;
        }

        setLocalData(template.data);
        replacePortfolioData(template.data);
        setActiveTab('about');
        setIsCustomizing(false);
        setShowAllErrors(false);
        setIsOnboardingDismissed(true);
        toast.success(`${template.label} starter loaded. Replace the sample content with your own.`);
    };

    const handleStartBlank = () => {
        setIsOnboardingDismissed(true);
        setActiveTab('about');
        setIsCustomizing(false);
        toast.success("Blank workspace ready. Start with your profile details.");
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            optimizeImageFile(file)
                .then((optimizedImage) => {
                    handleLocalChange('profilePic', optimizedImage);
                    toast.success("Profile image optimized for upload.");
                })
                .catch((error) => {
                    console.error("Image upload error:", error);
                    toast.error(error.message);
                });
        }
    };

    const shouldShowOnboarding =
        isPortfolioLoaded &&
        !isCustomizing &&
        !isOnboardingDismissed &&
        !hasMeaningfulPortfolioContent(localData);

    return (
        <div className="builder">
            {/* Header */}
            <header className="builder__header">
                <div className="builder__header-shell">
                    <div className="builder__header-row">
                        <div className="builder__brand">
                            <img
                                src={process.env.PUBLIC_URL + "/logo.png"}
                                alt="BuildFolio Logo"
                                className="builder__brand-logo"
                            />
                        </div>

                        <div className="builder__toolbar">
                            <div className="builder__account">
                                <span className={`builder__tier ${isPremium ? 'builder__tier--premium' : 'builder__tier--basic'}`}>
                                    {isPremium ? (
                                        <>
                                            <FaCrown size={10} className="builder__tier-icon" /> PREMIUM
                                        </>
                                    ) : 'BASIC'}
                                </span>
                                <span className="builder__account-email">
                                    {currentUser?.email}
                                </span>
                            </div>

                            <div className="builder__toolbar-divider"></div>

                            <button
                                onClick={handleGeneratePortfolio}
                                disabled={generating || (!isPremium && false)} // Button is enabled for Basic but triggers modal
                                className={`builder__action builder__action--publish ${generating ? 'builder__action--disabled' : ''}`}
                                title={!isPortfolioReady ? "Please complete all required fields" : "Publish to live URL"}
                            >
                                <FaMagic className={`builder__action-icon ${generating ? 'builder__action-icon--spinning' : ''}`} />
                                {generating ? 'Building...' : (isPremium ? 'Publish' : 'Unlock Publish')}
                            </button>

                            <button
                                onClick={handleSaveAll}
                                disabled={generating}
                                className={`builder__action builder__action--save ${generating ? 'builder__action--disabled' : ''}`}
                                title="Save all changes to database"
                            >
                                <FaCheck />
                                {generating ? 'Saving...' : 'Save Changes'}
                            </button>

                            <button
                                onClick={handlePreview}
                                className="builder__action builder__action--preview"
                                title="Preview Portfolio"
                            >
                                <FaEye /> <span className="builder__action-label">Preview</span>
                            </button>

                            <button onClick={handleLogout} className="builder__action builder__action--logout">
                                <FaSignOutAlt />
                            </button>
                        </div >
                    </div >
                </div >
            </header >

            <main className="builder__main">
                <div className="builder__layout">
                    {/* Sidebar Tabs */}
                    <div className="builder__sidebar">
                        <nav className="builder__nav">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        setActiveTab(tab.id);
                                        setIsCustomizing(false);
                                    }}
                                    className={`builder__tab ${activeTab === tab.id && !isCustomizing ? 'builder__tab--active' : ''}`}
                                >
                                    {tab.icon} {tab.label}
                                </button>
                            ))}
                            <button
                                onClick={() => setIsCustomizing(true)}
                                className={`builder__tab ${isCustomizing ? 'builder__tab--active' : ''}`}
                            >
                                <FaPalette /> Styling
                            </button>
                        </nav>
                    </div>

                    {/* Content Area */}
                    <div className="builder__content-column">
                        <div className="builder__panel">
                            {!isPortfolioLoaded ? (
                                <div className="builder__loading-state">
                                    <span className="builder__loading-badge">Loading</span>
                                    <h2 className="builder__loading-title">Restoring your workspace.</h2>
                                    <p className="builder__loading-text">Fetching your saved portfolio, customization, and publishing state.</p>
                                </div>
                            ) : shouldShowOnboarding ? (
                                <div className="builder__onboarding">
                                    <div className="builder__onboarding-hero">
                                        <div className="builder__onboarding-copy">
                                            <span className="builder__onboarding-badge">New here</span>
                                            <h2 className="builder__onboarding-title">Start with a recruiter-ready draft instead of a blank page.</h2>
                                            <p className="builder__onboarding-text">
                                                Choose a starter built for common fresher roles, then replace the sample content with your own projects, experience, and links.
                                            </p>
                                            <div className="builder__onboarding-actions">
                                                <button
                                                    type="button"
                                                    onClick={handleStartBlank}
                                                    className="builder__onboarding-button builder__onboarding-button--secondary"
                                                >
                                                    Start Blank
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleApplyStarterTemplate(STARTER_TEMPLATES[0].id)}
                                                    className="builder__onboarding-button builder__onboarding-button--primary"
                                                >
                                                    Use Recommended Starter <FaArrowRight />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="builder__onboarding-summary">
                                            <div className="builder__onboarding-summary-card">
                                                <div className="builder__onboarding-summary-icon">
                                                    <FaRocket />
                                                </div>
                                                <div>
                                                    <p className="builder__onboarding-summary-title">What you get</p>
                                                    <p className="builder__onboarding-summary-text">Sample portfolio content, role-specific wording, starter styling, and a faster path to preview.</p>
                                                </div>
                                            </div>
                                            <div className="builder__onboarding-steps">
                                                <div className="builder__onboarding-step">
                                                    <span className="builder__onboarding-step-index">1</span>
                                                    <p>Pick a starter that matches the role you are applying for.</p>
                                                </div>
                                                <div className="builder__onboarding-step">
                                                    <span className="builder__onboarding-step-index">2</span>
                                                    <p>Replace the sample copy with your own education, projects, and contact details.</p>
                                                </div>
                                                <div className="builder__onboarding-step">
                                                    <span className="builder__onboarding-step-index">3</span>
                                                    <p>Preview, style, and publish when the draft feels like you.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="builder__onboarding-grid">
                                        {STARTER_TEMPLATES.map((template) => (
                                            <button
                                                key={template.id}
                                                type="button"
                                                onClick={() => handleApplyStarterTemplate(template.id)}
                                                className="builder__onboarding-card"
                                                style={{ "--starter-accent": template.accentColor }}
                                            >
                                                <div className="builder__onboarding-card-head">
                                                    <div>
                                                        <p className="builder__onboarding-card-kicker">{template.audience}</p>
                                                        <h3 className="builder__onboarding-card-title">{template.label}</h3>
                                                    </div>
                                                    <span className="builder__onboarding-card-accent"></span>
                                                </div>
                                                <p className="builder__onboarding-card-text">{template.summary}</p>
                                                <span className="builder__onboarding-card-link">
                                                    Load Starter <FaArrowRight />
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : isCustomizing ? (
                                <Customizer
                                    localData={localData}
                                    setLocalData={setLocalData}
                                    onComplete={() => {
                                        syncLocalDraftToContext(localData);
                                        toast.success("Design preferences saved! You can now preview or publish.");
                                        setIsCustomizing(false);
                                    }}
                                    onBack={() => setIsCustomizing(false)}
                                />
                            ) : (
                                <>
                                    {/* Profile Tab */}
                                    {activeTab === 'about' && (
                                        <div className="builder__section">
                                            <h2 className="builder__section-title builder__section-title--framed">Profile Details</h2>
                                            <div className="builder__section-body">
                                                <div className="builder__form-grid">
                                                    <InputGroup
                                                        label="Full Name"
                                                        value={localData.name}
                                                        onChange={(e) => handleLocalChange('name', e.target.value)}
                                                        error={showAllErrors ? fieldErrors.name : null}
                                                    />
                                                    <InputGroup
                                                        label="Job Title"
                                                        value={localData.title}
                                                        onChange={(e) => handleLocalChange('title', e.target.value)}
                                                        error={showAllErrors ? fieldErrors.title : null}
                                                    />
                                                </div>

                                                <div className="builder__avatar-field">
                                                    <label className={`builder-form-field__label ${showAllErrors && fieldErrors.profilePic ? 'builder-form-field__label--error' : ''}`}>Profile Picture</label>
                                                    <div className="builder__avatar-row">
                                                        <div className={`builder__avatar-preview ${showAllErrors && fieldErrors.profilePic ? 'builder__avatar-preview--error' : ''}`}>
                                                            {localData.profilePic ? (
                                                                <img src={localData.profilePic} alt="Profile" className="builder__avatar-image" />
                                                            ) : (
                                                                <FaImage className="builder__avatar-icon" />
                                                            )}
                                                        </div>
                                                        <div className="builder__avatar-actions">
                                                            {localData.profilePic ? (
                                                                <div className="builder__avatar-action-group">
                                                                    <button
                                                                        onClick={() => handleLocalChange('profilePic', null)}
                                                                        className="builder__avatar-remove"
                                                                    >
                                                                        <FaTrash size={12} />
                                                                    </button>

                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <input
                                                                        type="file"
                                                                        accept="image/*"
                                                                        onChange={handleImageUpload}
                                                                        className="builder__file-input"
                                                                    />
                                                                    <p className="builder__helper-text">Recommended: Square JPG or PNG, max 2MB.</p>
                                                                </>
                                                            )}
                                                            {showAllErrors && fieldErrors.profilePic && (
                                                                <p className="builder__inline-error">{fieldErrors.profilePic}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <InputGroup
                                                    label="Bio / About Me"
                                                    value={localData.about}
                                                    onChange={(e) => handleLocalChange('about', e.target.value)}
                                                    as="textarea"
                                                    rows={6}
                                                    error={showAllErrors ? fieldErrors.about : null}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Education Tab */}
                                    {activeTab === 'education' && (
                                        <div className="builder__section">
                                            <div className="builder__section-header">
                                                <div className="builder__section-heading">
                                                    <h2 className="builder__section-title">Education</h2>
                                                    {showAllErrors && fieldErrors.education && (
                                                        <p className="builder__section-error">{fieldErrors.education}</p>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => handleLocalChange('education', [...localData.education, { degree: "", school: "", startDate: "", endDate: "", description: "" }])}
                                                    className="builder__section-add"
                                                >
                                                    <FaPlus /> Add New
                                                </button>
                                            </div>

                                            {localData.education.map((edu, index) => (
                                                <div key={index} className="builder__entry-card">
                                                    <button
                                                        onClick={() => {
                                                            const newEdu = localData.education.filter((_, i) => i !== index);
                                                            handleLocalChange('education', newEdu);
                                                        }}
                                                        className="builder__entry-remove"
                                                    >
                                                        <FaTrash size={14} />
                                                    </button>

                                                    <div className="builder__entry-grid">
                                                        <InputGroup
                                                            label="Degree"
                                                            value={edu.degree || ''}
                                                            onChange={(e) => {
                                                                const newEdu = [...localData.education];
                                                                newEdu[index] = { ...newEdu[index], degree: e.target.value };
                                                                handleLocalChange('education', newEdu);
                                                            }}
                                                            error={showAllErrors ? (edu.degree ? null : "Required") : null}
                                                        />
                                                        <InputGroup
                                                            label="School / University"
                                                            value={edu.school || ''}
                                                            onChange={(e) => {
                                                                const newEdu = [...localData.education];
                                                                newEdu[index] = { ...newEdu[index], school: e.target.value };
                                                                handleLocalChange('education', newEdu);
                                                            }}
                                                            error={showAllErrors ? (edu.school ? null : "Required") : null}
                                                        />
                                                        <div className="builder-form-field">
                                                            <label className="builder-form-field__label">Start Date</label>
                                                            <input
                                                                type="date"
                                                                className="builder-form-field__control"
                                                                value={edu.startDate || ''}
                                                                onChange={(e) => {
                                                                    const newEdu = [...localData.education];
                                                                    newEdu[index] = { ...newEdu[index], startDate: e.target.value, date: `${formatDateDisplay(e.target.value)} – ${formatDateDisplay(newEdu[index].endDate)}` };
                                                                    handleLocalChange('education', newEdu);
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="builder-form-field">
                                                            <label className="builder-form-field__label">End Date</label>
                                                            <input
                                                                type="date"
                                                                className="builder-form-field__control"
                                                                value={edu.endDate || ''}
                                                                onChange={(e) => {
                                                                    const newEdu = [...localData.education];
                                                                    newEdu[index] = { ...newEdu[index], endDate: e.target.value, date: `${formatDateDisplay(newEdu[index].startDate)} – ${formatDateDisplay(e.target.value)}` };
                                                                    handleLocalChange('education', newEdu);
                                                                }}
                                                            />
                                                        </div>
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
                                        </div>
                                    )}

                                    {/* Work Tab */}
                                    {activeTab === 'work' && (
                                        <div className="builder__section">
                                            <div className="builder__section-header">
                                                <div className="builder__section-heading">
                                                    <h2 className="builder__section-title">Work Experience</h2>
                                                    {showAllErrors && fieldErrors.work && (
                                                        <p className="builder__section-error">{fieldErrors.work}</p>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => handleLocalChange('work', [...localData.work, { company: "", role: "", startDate: "", endDate: "", responsibilities: "", accomplishments: "" }])}
                                                    className="builder__section-add"
                                                >
                                                    <FaPlus /> Add New
                                                </button>
                                            </div>

                                            {localData.work.map((wk, index) => (
                                                <div key={index} className="builder__entry-card">
                                                    <button
                                                        onClick={() => {
                                                            const newWork = localData.work.filter((_, i) => i !== index);
                                                            handleLocalChange('work', newWork);
                                                        }}
                                                        className="builder__entry-remove"
                                                    >
                                                        <FaTrash size={14} />
                                                    </button>

                                                    <div className="builder__entry-grid">
                                                        <InputGroup
                                                            label="Company"
                                                            value={wk.company || ''}
                                                            onChange={(e) => {
                                                                const newWork = [...localData.work];
                                                                newWork[index] = { ...newWork[index], company: e.target.value };
                                                                handleLocalChange('work', newWork);
                                                            }}
                                                            error={showAllErrors ? (wk.company ? null : "Required") : null}
                                                        />
                                                        <InputGroup
                                                            label="Role / Position"
                                                            value={wk.role || ''}
                                                            onChange={(e) => {
                                                                const newWork = [...localData.work];
                                                                newWork[index] = { ...newWork[index], role: e.target.value };
                                                                handleLocalChange('work', newWork);
                                                            }}
                                                            error={showAllErrors ? (wk.role ? null : "Required") : null}
                                                        />
                                                        <div className="builder-form-field">
                                                            <label className="builder-form-field__label">Start Date</label>
                                                            <input
                                                                type="date"
                                                                className="builder-form-field__control"
                                                                value={wk.startDate || ''}
                                                                onChange={(e) => {
                                                                    const newWork = [...localData.work];
                                                                    newWork[index] = { ...newWork[index], startDate: e.target.value, date: `${formatDateDisplay(e.target.value)} – ${formatDateDisplay(newWork[index].endDate)}` };
                                                                    handleLocalChange('work', newWork);
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="builder-form-field">
                                                            <label className="builder-form-field__label">End Date</label>
                                                            <input
                                                                type="date"
                                                                className="builder-form-field__control"
                                                                value={wk.endDate || ''}
                                                                onChange={(e) => {
                                                                    const newWork = [...localData.work];
                                                                    newWork[index] = { ...newWork[index], endDate: e.target.value, date: `${formatDateDisplay(newWork[index].startDate)} – ${formatDateDisplay(e.target.value)}` };
                                                                    handleLocalChange('work', newWork);
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <InputGroup label="Roles & Responsibilities" value={wk.responsibilities || ''} as="textarea" rows={3}
                                                        onChange={(e) => {
                                                            const newWork = [...localData.work];
                                                            newWork[index] = { ...newWork[index], responsibilities: e.target.value };
                                                            handleLocalChange('work', newWork);
                                                        }}
                                                    />
                                                    <InputGroup label="Work Accomplishments" value={wk.accomplishments || ''} as="textarea" rows={3}
                                                        onChange={(e) => {
                                                            const newWork = [...localData.work];
                                                            newWork[index] = { ...newWork[index], accomplishments: e.target.value };
                                                            handleLocalChange('work', newWork);
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Skills Tab */}
                                    {activeTab === 'skills' && (
                                        <div className="builder__section">
                                            <div className="builder__section-header">
                                                <div className="builder__section-heading">
                                                    <h2 className="builder__section-title">Skills</h2>
                                                    {showAllErrors && fieldErrors.skills && (
                                                        <p className="builder__section-error">{fieldErrors.skills}</p>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => handleLocalChange('skills', [...localData.skills, { name: "New Skill" }])}
                                                    className="builder__section-add"
                                                >
                                                    <FaPlus /> Add New
                                                </button>
                                            </div>

                                            <div className="builder__skills-grid">
                                                {localData.skills.map((skill, index) => (
                                                    <div key={index} className="builder__skill-card">
                                                        <button
                                                            onClick={() => {
                                                                const newSkills = localData.skills.filter((_, i) => i !== index);
                                                                handleLocalChange('skills', newSkills);
                                                            }}
                                                            className="builder__skill-remove"
                                                        >
                                                            <FaTrash size={12} />
                                                        </button>

                                                        <div className="builder__skill-body">
                                                            <div className="builder__skill-group">
                                                                <label className="builder__skill-label">Skill Name</label>
                                                                <input
                                                                    type="text"
                                                                    className={`builder__skill-input ${showAllErrors && !skill.name?.trim() ? 'builder__skill-input--error' : ''}`}
                                                                    value={skill.name || ''}
                                                                    onChange={(e) => {
                                                                        const newSkills = [...localData.skills];
                                                                        newSkills[index] = { ...newSkills[index], name: e.target.value };
                                                                        handleLocalChange('skills', newSkills);
                                                                    }}
                                                                />
                                                                {showAllErrors && !skill.name?.trim() && (
                                                                    <p className="builder__skill-error">Required</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Contact Tab */}
                                    {activeTab === 'contact' && (
                                        <div className="builder__section">
                                            <h2 className="builder__section-title builder__section-title--framed">Contact Information</h2>

                                            <div className="builder__form-grid">
                                                <InputGroup
                                                    label="Phone Number"
                                                    value={localData.contact.phone || ''}
                                                    onChange={(e) => handleLocalChange('contact', { ...localData.contact, phone: e.target.value })}
                                                    error={showAllErrors ? fieldErrors.phone : null}
                                                />
                                                <InputGroup
                                                    label="Email Address"
                                                    type="email"
                                                    value={localData.contact.email || ''}
                                                    onChange={(e) => handleLocalChange('contact', { ...localData.contact, email: e.target.value })}
                                                    error={showAllErrors ? fieldErrors.email : null}
                                                />
                                                <InputGroup
                                                    label="LinkedIn URL"
                                                    value={localData.contact.linkedin || ''}
                                                    onChange={(e) => handleLocalChange('contact', { ...localData.contact, linkedin: e.target.value })}
                                                    error={showAllErrors ? fieldErrors.linkedin : null}
                                                />
                                                <InputGroup
                                                    label="GitHub URL"
                                                    value={localData.contact.github || ''}
                                                    onChange={(e) => handleLocalChange('contact', { ...localData.contact, github: e.target.value })}
                                                    error={showAllErrors ? fieldErrors.github : null}
                                                />
                                            </div>

                                            <div className="builder__panel-footer">
                                                <button
                                                    onClick={() => setIsCustomizing(true)}
                                                    className="builder__next-action"
                                                >
                                                    Next: Customize Style <FaPalette />
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                </>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Generated URL Modal */}
            {
                showModal && (
                    <div className="builder-modal">
                        <div className="builder-modal__dialog">
                            <div className="builder-modal__header">
                                <h3 className="builder-modal__title">🚀 Portfolio Published!</h3>
                                <button onClick={() => setShowModal(false)} className="builder-modal__close">
                                    <FaTimes />
                                </button>
                            </div>

                            <p className="builder-modal__text">
                                Your portfolio is now live and ready to share with the world.
                            </p>

                            <div className="builder-modal__link-card">
                                <a href={generatedUrl} target="_blank" rel="noopener noreferrer" className="builder-modal__link">
                                    {generatedUrl}
                                </a>
                            </div>

                            <p className="builder-modal__helper">
                                Recruiters can open this link directly to view your public profile on desktop or mobile.
                            </p>

                            <div className="builder-modal__actions">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="builder-modal__button builder-modal__button--secondary"
                                >
                                    Close
                                </button>
                                <a
                                    href={generatedUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="builder-modal__button builder-modal__button--secondary"
                                >
                                    <FaExternalLinkAlt /> Open Link
                                </a>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(generatedUrl);
                                        toast.success("Link copied!");
                                    }}
                                    className="builder-modal__button builder-modal__button--primary"
                                >
                                    <FaCopy /> Copy Link
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Upgrade to Premium Modal */}
            {
                showUpgradeModal && (
                    <div className="builder-modal">
                        <div className="builder-modal__dialog builder-modal__dialog--upgrade">
                            <div className="builder-modal__hero">
                                <button onClick={() => setShowUpgradeModal(false)} className="builder-modal__hero-close">
                                    <FaTimes />
                                </button>
                                <div className="builder-modal__hero-icon">
                                    <FaCrown size={32} />
                                </div>
                                <h3 className="builder-modal__hero-title">Upgrade to Premium</h3>
                                <p className="builder-modal__hero-subtitle">Unlock the full power of BuildFolio</p>
                            </div>

                            <div className="builder-modal__content">
                                <div className="builder-modal__feature-list">
                                    <div className="builder-modal__feature">
                                        <div className="builder-modal__feature-icon"><FaCheck className="builder-modal__feature-check" size={10} /></div>
                                        <p className="builder-modal__feature-text">Publish your portfolio to a live link</p>
                                    </div>
                                    <div className="builder-modal__feature">
                                        <div className="builder-modal__feature-icon"><FaCheck className="builder-modal__feature-check" size={10} /></div>
                                        <p className="builder-modal__feature-text">Remove 'DRAFT' watermark from resumes</p>
                                    </div>
                                    <div className="builder-modal__feature">
                                        <div className="builder-modal__feature-icon"><FaCheck className="builder-modal__feature-check" size={10} /></div>
                                        <p className="builder-modal__feature-text">Custom subdomains (coming soon)</p>
                                    </div>
                                </div>

                                <div className="builder-modal__price-card">
                                    <span className="builder-modal__price-value">$9</span>
                                    <span className="builder-modal__price-label">one-time</span>
                                </div>

                                <button
                                    onClick={handleUpgradeToPremium}
                                    className="builder-modal__upgrade-button"
                                >
                                    Upgrade Now
                                </button>

                                <p className="builder-modal__secure-note">
                                    🔒 Secure payment via Stripe
                                </p>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

// UI Components Helpers
const InputGroup = ({ label, value, onChange, type = "text", placeholder = "", as = "input", rows, error }) => (
    <div className="builder-form-field">
        <label className={`builder-form-field__label ${error ? 'builder-form-field__label--error' : ''}`}>{label}</label>
        {as === "textarea" ? (
            <textarea
                rows={rows || 4}
                className={`builder-form-field__control builder-form-field__control--textarea ${error ? 'builder-form-field__control--error' : ''}`}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />
        ) : (
            <input
                type={type}
                className={`builder-form-field__control ${error ? 'builder-form-field__control--error' : ''}`}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />
        )}
        {error && <p className="builder-form-field__error">
            <span className="builder-form-field__error-dot"></span>
            {error}
        </p>}
    </div>
);

const tabs = [
    { id: 'about', label: 'Profile', icon: <FaUser /> },
    { id: 'education', label: 'Education', icon: <FaGraduationCap /> },
    { id: 'work', label: 'Experience', icon: <FaBriefcase /> },
    { id: 'skills', label: 'Skills', icon: <FaCode /> },
    { id: 'contact', label: 'Contact', icon: <FaEnvelope /> },
];

export default Builder;
