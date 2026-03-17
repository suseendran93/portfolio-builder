import React, { useRef, useContext, useState } from 'react';
import { PortfolioContext } from '../../context/PortfolioContext';
import { FaDownload } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import html2pdf from 'html2pdf.js';
import './ResumeDownload.scss';

const ResumeDownload = ({ className = '', variant = 'primary', showWatermark = false }) => {
    const { portfolioData } = useContext(PortfolioContext);
    const resumeRef = useRef(null);
    const [downloading, setDownloading] = useState(false);

    const handleDownload = async () => {
        if (!resumeRef.current) return;
        setDownloading(true);

        const toastId = toast.loading('Generating your resume PDF…');

        try {
            const fileName = `${(portfolioData.name || 'Resume').replace(/\s+/g, '_')}_Resume.pdf`;
            const opt = {
                margin: [10, 15, 10, 15],
                filename: fileName,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    letterRendering: true,
                    width: 794
                },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
                pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
            };

            // Use the worker API explicitly for better control
            await html2pdf().from(resumeRef.current).set(opt).save();
            toast.success('Resume downloaded!', { id: toastId });
        } catch (error) {
            console.error('PDF generation error:', error);
            toast.error('Failed to generate PDF. Please try again.', { id: toastId });
        } finally {
            setDownloading(false);
        }
    };

    const resumeCustom = portfolioData.customization?.resume || { layout: 'standard', accentColor: '#1e293b' };
    const resumeAccent = resumeCustom.accentColor;

    // Watermark SVG Pattern
    const watermarkSvg = `
        <svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'>
            <text x='50%' y='50%' font-size='60' font-weight='bold' fill='rgba(0,0,0,0.03)' 
            transform='rotate(-45, 200, 200)' text-anchor='middle' font-family='Arial'>DRAFT</text>
        </svg>
    `;
    const watermarkUrl = `data:image/svg+xml;base64,${btoa(watermarkSvg)}`;

    const workEntries = portfolioData.work || [];

    // Dynamic Styles for PDF
    const pdfStyles = getStyles(resumeAccent);

    return (
        <>
            {/* Download Button */}
            <button
                onClick={handleDownload}
                disabled={downloading}
                style={{ backgroundColor: variant === 'primary' ? resumeAccent : 'transparent', borderColor: resumeAccent, color: variant === 'primary' ? '#fff' : resumeAccent }}
                className={`resume-download__button ${downloading ? 'resume-download__button--loading' : ''} ${className} ${variant === 'secondary' ? 'resume-download__button--secondary' : 'resume-download__button--primary'}`}
            >
                <FaDownload className={downloading ? 'animate-bounce' : ''} />
                {downloading ? 'Generating…' : 'Download Portfolio Resume'}
            </button>

            {/* Hidden Resume Template — rendered off-screen for html2pdf.js */}
            <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
                <div
                    ref={resumeRef}
                    style={{
                        ...pdfStyles.page,
                        position: 'relative',
                        backgroundImage: showWatermark ? `url("${watermarkUrl}")` : 'none',
                        backgroundRepeat: 'repeat'
                    }}
                >

                    {/* ─── Header ─── */}
                    <table style={pdfStyles.headerTable}>
                        <tbody>
                            <tr>
                                {portfolioData.profilePic && (
                                    <td style={pdfStyles.profilePicCell}>
                                        <img
                                            src={portfolioData.profilePic}
                                            alt={portfolioData.name}
                                            style={pdfStyles.profilePic}
                                        />
                                    </td>
                                )}
                                <td style={pdfStyles.headerLeftCell}>
                                    <div style={pdfStyles.name}>{portfolioData.name || 'Your Name'}</div>
                                    <div style={pdfStyles.title}>{portfolioData.title || 'Professional Title'}</div>
                                </td>
                                <td style={pdfStyles.headerRightCell}>
                                    {portfolioData.contact?.email && (
                                        <div style={pdfStyles.contactItem}>✉ {portfolioData.contact.email}</div>
                                    )}
                                    {portfolioData.contact?.phone && (
                                        <div style={pdfStyles.contactItem}>☎ {portfolioData.contact.phone}</div>
                                    )}
                                    {portfolioData.contact?.linkedin && (
                                        <div style={pdfStyles.contactItem}>🔗 {portfolioData.contact.linkedin}</div>
                                    )}
                                    {portfolioData.contact?.github && (
                                        <div style={pdfStyles.contactItem}>⌨ {portfolioData.contact.github}</div>
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div style={pdfStyles.headerDivider}></div>

                    {/* ─── Professional Summary ─── */}
                    {portfolioData.about && (
                        <div style={pdfStyles.section}>
                            <div style={pdfStyles.sectionTitle}>Professional Summary</div>
                            <div style={pdfStyles.text}>{portfolioData.about}</div>
                        </div>
                    )}

                    {/* ─── Work Experience ─── */}
                    {workEntries.length > 0 && (
                        <div style={pdfStyles.section}>
                            <div style={pdfStyles.sectionTitle}>Work Experience</div>
                            {workEntries.map((item, idx) => (
                                <div key={idx}>
                                    <div style={pdfStyles.entry}>
                                        <table style={pdfStyles.entryHeaderTable}>
                                            <tbody>
                                                <tr>
                                                    <td style={pdfStyles.entryHeaderLeft}>
                                                        <div style={pdfStyles.entryTitle}>
                                                            {typeof item === 'string' ? item : (item.company || 'Company')}
                                                        </div>
                                                        {typeof item !== 'string' && (
                                                            <div style={pdfStyles.entrySubtitle}>{item.role || 'Role'}</div>
                                                        )}
                                                    </td>
                                                    {typeof item !== 'string' && item.date && (
                                                        <td style={pdfStyles.entryHeaderRight}>
                                                            <span style={pdfStyles.dateBadge}>{item.date}</span>
                                                        </td>
                                                    )}
                                                </tr>
                                            </tbody>
                                        </table>
                                        {typeof item !== 'string' && item.responsibilities && (
                                            <div style={pdfStyles.subSection}>
                                                <div style={pdfStyles.subHeading}>Roles & Responsibilities</div>
                                                <div style={pdfStyles.text}>{item.responsibilities}</div>
                                            </div>
                                        )}
                                        {typeof item !== 'string' && item.accomplishments && (
                                            <div style={pdfStyles.subSection}>
                                                <div style={pdfStyles.subHeading}>Work Accomplishments</div>
                                                <div style={pdfStyles.text}>{item.accomplishments}</div>
                                            </div>
                                        )}
                                        {/* Legacy fallback */}
                                        {typeof item !== 'string' && !item.responsibilities && !item.accomplishments && item.description && (
                                            <div style={pdfStyles.text}>{item.description}</div>
                                        )}
                                    </div>
                                    {/* Divider between work entries */}
                                    {idx < workEntries.length - 1 && (
                                        <div style={pdfStyles.entryDivider}></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ─── Education ─── */}
                    {portfolioData.education && portfolioData.education.length > 0 && (
                        <div style={pdfStyles.section}>
                            <div style={pdfStyles.sectionTitle}>Education</div>
                            {portfolioData.education.map((item, idx) => (
                                <div key={idx} style={pdfStyles.entry}>
                                    <table style={pdfStyles.entryHeaderTable}>
                                        <tbody>
                                            <tr>
                                                <td style={pdfStyles.entryHeaderLeft}>
                                                    <div style={pdfStyles.entryTitle}>{item.school || 'School'}</div>
                                                    <div style={pdfStyles.entrySubtitle}>{item.degree || 'Degree'}</div>
                                                </td>
                                                {item.date && (
                                                    <td style={pdfStyles.entryHeaderRight}>
                                                        <span style={pdfStyles.dateBadge}>{item.date}</span>
                                                    </td>
                                                )}
                                            </tr>
                                        </tbody>
                                    </table>
                                    {item.description && (
                                        <div style={pdfStyles.text}>{item.description}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ─── Skills ─── */}
                    {portfolioData.skills && portfolioData.skills.length > 0 && (
                        <div style={pdfStyles.section}>
                            <div style={pdfStyles.sectionTitle}>Skills</div>
                            <div style={pdfStyles.skillsGrid}>
                                {portfolioData.skills.map((skill, idx) => (
                                    <span key={idx} style={pdfStyles.skillTag}>
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
const textDark = '#1e293b';
const textMuted = '#475569';
const borderLight = '#e2e8f0';

const getStyles = (accentColor) => ({
    page: {
        width: '100%',
        maxWidth: '794px',
        fontFamily: "Arial, Helvetica, sans-serif",
        color: textDark,
        backgroundColor: '#ffffff',
        padding: '40px',
        lineHeight: '1.55',
        boxSizing: 'border-box',
        wordBreak: 'break-word',
        overflowWrap: 'break-word',
        borderTop: `8px solid ${accentColor}`,
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
        background: accentColor,
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
        borderBottom: `2px solid ${accentColor}22`,
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
        backgroundColor: `${accentColor}11`,
        padding: '4px 12px',
        borderRadius: '14px',
        border: `1px solid ${accentColor}33`,
        display: 'inline-block',
    },
});

export default ResumeDownload;
