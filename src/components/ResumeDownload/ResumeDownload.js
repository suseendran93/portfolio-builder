import React, { useRef, useContext, useState } from 'react';
import { PortfolioContext } from '../../context/PortfolioContext';
import { FaDownload } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import html2pdf from 'html2pdf.js/dist/html2pdf.bundle.min.js';

const ResumeDownload = ({ className = '', variant = 'primary', showWatermark = false }) => {
    const { portfolioData } = useContext(PortfolioContext);
    const resumeRef = useRef(null);
    const [downloading, setDownloading] = useState(false);

    const handleDownload = async () => {
        if (!resumeRef.current) return;
        setDownloading(true);

        const toastId = toast.loading('Generating your resume PDF…');

        try {
            const opt = {
                margin: [12, 14, 12, 14],
                filename: `${(portfolioData.name || 'Resume').replace(/\s+/g, '_')}_Resume.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, logging: false, windowWidth: 794 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
                pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
            };

            await html2pdf().set(opt).from(resumeRef.current).save();
            toast.success('Resume downloaded!', { id: toastId });
        } catch (error) {
            console.error('PDF generation error:', error);
            toast.error('Failed to generate PDF. Please try again.', { id: toastId });
        } finally {
            setDownloading(false);
        }
    };

    const buttonStyles = variant === 'primary'
        ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700 shadow-lg shadow-indigo-200'
        : 'bg-white text-indigo-600 border border-indigo-100 hover:bg-indigo-50 shadow-sm';

    const workEntries = portfolioData.work || [];

    // Watermark SVG Pattern
    const watermarkSvg = `
        <svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'>
            <text x='50%' y='50%' font-size='60' font-weight='bold' fill='rgba(0,0,0,0.03)' 
            transform='rotate(-45, 200, 200)' text-anchor='middle' font-family='Arial'>DRAFT</text>
        </svg>
    `;
    const watermarkUrl = `data:image/svg+xml;base64,${btoa(watermarkSvg)}`;

    return (
        <>
            {/* Download Button */}
            <button
                onClick={handleDownload}
                disabled={downloading}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${downloading ? 'opacity-60 cursor-wait' : ''} ${buttonStyles} ${className}`}
            >
                <FaDownload className={downloading ? 'animate-bounce' : ''} />
                {downloading ? 'Generating…' : 'Download Resume'}
            </button>

            {/* Hidden Resume Template — rendered off-screen for html2pdf.js */}
            <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
                <div
                    ref={resumeRef}
                    style={{
                        ...styles.page,
                        position: 'relative',
                        backgroundImage: showWatermark ? `url("${watermarkUrl}")` : 'none',
                        backgroundRepeat: 'repeat'
                    }}
                >

                    {/* ─── Header ─── */}
                    <table style={styles.headerTable}>
                        <tbody>
                            <tr>
                                {portfolioData.profilePic && (
                                    <td style={styles.profilePicCell}>
                                        <img
                                            src={portfolioData.profilePic}
                                            alt={portfolioData.name}
                                            style={styles.profilePic}
                                        />
                                    </td>
                                )}
                                <td style={styles.headerLeftCell}>
                                    <div style={styles.name}>{portfolioData.name || 'Your Name'}</div>
                                    <div style={styles.title}>{portfolioData.title || 'Professional Title'}</div>
                                </td>
                                <td style={styles.headerRightCell}>
                                    {portfolioData.contact?.email && (
                                        <div style={styles.contactItem}>✉ {portfolioData.contact.email}</div>
                                    )}
                                    {portfolioData.contact?.phone && (
                                        <div style={styles.contactItem}>☎ {portfolioData.contact.phone}</div>
                                    )}
                                    {portfolioData.contact?.linkedin && (
                                        <div style={styles.contactItem}>🔗 {portfolioData.contact.linkedin}</div>
                                    )}
                                    {portfolioData.contact?.github && (
                                        <div style={styles.contactItem}>⌨ {portfolioData.contact.github}</div>
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div style={styles.headerDivider}></div>

                    {/* ─── Professional Summary ─── */}
                    {portfolioData.about && (
                        <div style={styles.section}>
                            <div style={styles.sectionTitle}>Professional Summary</div>
                            <div style={styles.text}>{portfolioData.about}</div>
                        </div>
                    )}

                    {/* ─── Work Experience ─── */}
                    {workEntries.length > 0 && (
                        <div style={styles.section}>
                            <div style={styles.sectionTitle}>Work Experience</div>
                            {workEntries.map((item, idx) => (
                                <div key={idx}>
                                    <div style={styles.entry}>
                                        <table style={styles.entryHeaderTable}>
                                            <tbody>
                                                <tr>
                                                    <td style={styles.entryHeaderLeft}>
                                                        <div style={styles.entryTitle}>
                                                            {typeof item === 'string' ? item : (item.company || 'Company')}
                                                        </div>
                                                        {typeof item !== 'string' && (
                                                            <div style={styles.entrySubtitle}>{item.role || 'Role'}</div>
                                                        )}
                                                    </td>
                                                    {typeof item !== 'string' && item.date && (
                                                        <td style={styles.entryHeaderRight}>
                                                            <span style={styles.dateBadge}>{item.date}</span>
                                                        </td>
                                                    )}
                                                </tr>
                                            </tbody>
                                        </table>
                                        {typeof item !== 'string' && item.responsibilities && (
                                            <div style={styles.subSection}>
                                                <div style={styles.subHeading}>Roles & Responsibilities</div>
                                                <div style={styles.text}>{item.responsibilities}</div>
                                            </div>
                                        )}
                                        {typeof item !== 'string' && item.accomplishments && (
                                            <div style={styles.subSection}>
                                                <div style={styles.subHeading}>Work Accomplishments</div>
                                                <div style={styles.text}>{item.accomplishments}</div>
                                            </div>
                                        )}
                                        {/* Legacy fallback */}
                                        {typeof item !== 'string' && !item.responsibilities && !item.accomplishments && item.description && (
                                            <div style={styles.text}>{item.description}</div>
                                        )}
                                    </div>
                                    {/* Divider between work entries */}
                                    {idx < workEntries.length - 1 && (
                                        <div style={styles.entryDivider}></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ─── Education ─── */}
                    {portfolioData.education && portfolioData.education.length > 0 && (
                        <div style={styles.section}>
                            <div style={styles.sectionTitle}>Education</div>
                            {portfolioData.education.map((item, idx) => (
                                <div key={idx} style={styles.entry}>
                                    <table style={styles.entryHeaderTable}>
                                        <tbody>
                                            <tr>
                                                <td style={styles.entryHeaderLeft}>
                                                    <div style={styles.entryTitle}>{item.school || 'School'}</div>
                                                    <div style={styles.entrySubtitle}>{item.degree || 'Degree'}</div>
                                                </td>
                                                {item.date && (
                                                    <td style={styles.entryHeaderRight}>
                                                        <span style={styles.dateBadge}>{item.date}</span>
                                                    </td>
                                                )}
                                            </tr>
                                        </tbody>
                                    </table>
                                    {item.description && (
                                        <div style={styles.text}>{item.description}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ─── Skills ─── */}
                    {portfolioData.skills && portfolioData.skills.length > 0 && (
                        <div style={styles.section}>
                            <div style={styles.sectionTitle}>Skills</div>
                            <div style={styles.skillsGrid}>
                                {portfolioData.skills.map((skill, idx) => (
                                    <span key={idx} style={styles.skillTag}>
                                        {skill.name || skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

/* ─── Inline Styles for PDF Rendering ─── */
const accentColor = '#4f46e5';
const textDark = '#1e293b';
const textMuted = '#475569';
const borderLight = '#e2e8f0';

const styles = {
    page: {
        width: '100%',
        maxWidth: '794px',
        fontFamily: "Arial, Helvetica, sans-serif",
        color: textDark,
        backgroundColor: '#ffffff',
        lineHeight: '1.55',
        boxSizing: 'border-box',
        wordBreak: 'break-word',
        overflowWrap: 'break-word',
    },
    /* ── Header (using table for reliable layout) ── */
    headerTable: {
        width: '100%',
        borderCollapse: 'collapse',
        tableLayout: 'fixed',
    },
    profilePicCell: {
        width: '85px',
        verticalAlign: 'top',
        paddingRight: '14px',
    },
    profilePic: {
        width: '72px',
        height: '72px',
        borderRadius: '50%',
        objectFit: 'cover',
        border: `3px solid ${accentColor}`,
        display: 'block',
    },
    headerLeftCell: {
        verticalAlign: 'top',
        paddingRight: '12px',
    },
    headerRightCell: {
        verticalAlign: 'top',
        textAlign: 'right',
        width: '200px',
        wordBreak: 'break-all',
        overflowWrap: 'break-word',
    },
    name: {
        fontSize: '26px',
        fontWeight: '700',
        color: textDark,
        margin: '0 0 3px 0',
        letterSpacing: '-0.3px',
        lineHeight: '1.2',
    },
    title: {
        fontSize: '14px',
        fontWeight: '600',
        color: accentColor,
        margin: '0',
        letterSpacing: '0.3px',
    },
    contactItem: {
        fontSize: '10px',
        color: textMuted,
        margin: '1px 0',
        lineHeight: '1.5',
        wordBreak: 'break-all',
        overflowWrap: 'break-word',
    },
    headerDivider: {
        height: '3px',
        background: `linear-gradient(to right, ${accentColor}, #7c3aed)`,
        borderRadius: '2px',
        margin: '10px 0 16px 0',
    },
    /* ── Sections ── */
    section: {
        marginBottom: '16px',
    },
    sectionTitle: {
        fontSize: '13px',
        fontWeight: '700',
        color: accentColor,
        textTransform: 'uppercase',
        letterSpacing: '1.5px',
        borderBottom: `2px solid ${borderLight}`,
        paddingBottom: '5px',
        marginBottom: '10px',
    },
    /* ── Entries ── */
    entry: {
        marginBottom: '10px',
        paddingLeft: '10px',
        borderLeft: `3px solid ${borderLight}`,
    },
    entryHeaderTable: {
        width: '100%',
        borderCollapse: 'collapse',
        tableLayout: 'fixed',
        marginBottom: '3px',
    },
    entryHeaderLeft: {
        verticalAlign: 'top',
        paddingRight: '10px',
    },
    entryHeaderRight: {
        verticalAlign: 'top',
        textAlign: 'right',
        width: '180px',
        whiteSpace: 'nowrap',
    },
    entryTitle: {
        fontSize: '13px',
        fontWeight: '700',
        color: textDark,
        margin: '0',
        lineHeight: '1.3',
    },
    entrySubtitle: {
        fontSize: '12px',
        fontWeight: '600',
        color: accentColor,
        margin: '1px 0 0 0',
    },
    dateBadge: {
        fontSize: '10px',
        fontWeight: '600',
        color: textMuted,
        backgroundColor: '#f1f5f9',
        padding: '2px 8px',
        borderRadius: '10px',
        whiteSpace: 'nowrap',
        display: 'inline-block',
    },
    /* ── Text & Sub-sections ── */
    subSection: {
        marginTop: '5px',
    },
    subHeading: {
        fontSize: '10px',
        fontWeight: '700',
        color: textDark,
        margin: '0 0 1px 0',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    text: {
        fontSize: '11px',
        color: textMuted,
        margin: '4px 0 0 0',
        lineHeight: '1.6',
        wordBreak: 'break-word',
        overflowWrap: 'break-word',
        whiteSpace: 'pre-line',
    },
    /* ── Work Entry Divider ── */
    entryDivider: {
        height: '1px',
        backgroundColor: '#e2e8f0',
        margin: '8px 20px 12px 10px',
    },
    /* ── Skills ── */
    skillsGrid: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px',
    },
    skillTag: {
        fontSize: '10px',
        fontWeight: '600',
        color: accentColor,
        backgroundColor: '#eef2ff',
        padding: '4px 12px',
        borderRadius: '14px',
        border: `1px solid #c7d2fe`,
        display: 'inline-block',
    },
};

export default ResumeDownload;
