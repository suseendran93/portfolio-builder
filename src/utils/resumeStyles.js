import { DEFAULT_RESUME_CUSTOMIZATION } from "./customization";

const textDark = '#1e293b';
const textMuted = '#475569';
const borderLight = '#e2e8f0';

export const getResumeStyles = (accentColor, layout = DEFAULT_RESUME_CUSTOMIZATION.layout) => {
  const normalizedLayout = {
    standard: 'ats-classic',
    executive: 'ats-structured',
    minimal: 'ats-compact',
  }[layout] || layout;

  const baseStyles = {
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
    entryDivider: {
      height: '1px',
      backgroundColor: '#e2e8f0',
      margin: '8px 20px 12px 10px',
    },
    skillsGrid: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '6px',
    },
    skillTag: {
      fontSize: '10px',
      fontWeight: '600',
      lineHeight: '1.2',
      color: accentColor,
      backgroundColor: `${accentColor}11`,
      padding: '4px 12px',
      borderRadius: '14px',
      border: `1px solid ${accentColor}33`,
      display: 'inline-block',
      textAlign: 'center',
      verticalAlign: 'middle',
      whiteSpace: 'nowrap',
    },
  };

  if (normalizedLayout === 'ats-structured') {
    return {
      ...baseStyles,
      page: {
        ...baseStyles.page,
        padding: '42px',
        borderTop: `10px solid ${accentColor}`,
      },
      profilePic: {
        ...baseStyles.profilePic,
        borderRadius: '12px',
        width: '74px',
        height: '74px',
        boxShadow: 'none',
      },
      name: {
        ...baseStyles.name,
        fontSize: '27px',
        letterSpacing: '-0.6px',
      },
      title: {
        ...baseStyles.title,
        textTransform: 'uppercase',
        letterSpacing: '0.9px',
      },
      headerDivider: {
        ...baseStyles.headerDivider,
        height: '3px',
        borderRadius: '2px',
        margin: '12px 0 20px 0',
      },
      sectionTitle: {
        ...baseStyles.sectionTitle,
        letterSpacing: '1.8px',
        borderBottom: `2px solid ${accentColor}44`,
        paddingBottom: '6px',
        marginBottom: '12px',
      },
      entry: {
        ...baseStyles.entry,
        paddingLeft: '12px',
        borderLeft: `2px solid ${accentColor}33`,
      },
      entrySubtitle: {
        ...baseStyles.entrySubtitle,
        fontSize: '11px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
      },
      dateBadge: {
        ...baseStyles.dateBadge,
        color: textDark,
        backgroundColor: `${accentColor}14`,
        borderRadius: '6px',
      },
      skillTag: {
        ...baseStyles.skillTag,
        color: textDark,
        backgroundColor: '#ffffff',
        border: `1px solid ${accentColor}44`,
        borderRadius: '8px',
        padding: '4px 10px',
      },
    };
  }

  if (normalizedLayout === 'ats-compact') {
    return {
      ...baseStyles,
      page: {
        ...baseStyles.page,
        padding: '32px',
        borderTop: `2px solid ${accentColor}44`,
      },
      profilePic: {
        ...baseStyles.profilePic,
        borderRadius: '8px',
        border: `1px solid ${accentColor}33`,
      },
      title: {
        ...baseStyles.title,
        color: textMuted,
        letterSpacing: '0',
      },
      headerDivider: {
        ...baseStyles.headerDivider,
        height: '1px',
        background: `${accentColor}22`,
        margin: '10px 0 14px 0',
      },
      section: {
        ...baseStyles.section,
        marginBottom: '12px',
      },
      sectionTitle: {
        ...baseStyles.sectionTitle,
        fontSize: '12px',
        color: textDark,
        letterSpacing: '1px',
        borderBottom: 'none',
        paddingBottom: '0',
        marginBottom: '7px',
      },
      entry: {
        ...baseStyles.entry,
        paddingLeft: '0',
        borderLeft: 'none',
        marginBottom: '7px',
      },
      dateBadge: {
        ...baseStyles.dateBadge,
        backgroundColor: 'transparent',
        borderRadius: '0',
        padding: '0',
        color: textMuted,
      },
      subHeading: {
        ...baseStyles.subHeading,
        color: textDark,
        letterSpacing: '0.6px',
      },
      text: {
        ...baseStyles.text,
        fontSize: '10px',
        lineHeight: '1.45',
      },
      entryDivider: {
        ...baseStyles.entryDivider,
        margin: '5px 0 8px 0',
        backgroundColor: `${accentColor}22`,
      },
      skillTag: {
        ...baseStyles.skillTag,
        color: textDark,
        backgroundColor: 'transparent',
        border: `1px solid ${accentColor}22`,
        borderRadius: '6px',
        padding: '3px 8px',
      },
    };
  }

  return baseStyles;
};
