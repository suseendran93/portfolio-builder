import { DEFAULT_RESUME_CUSTOMIZATION } from "./customization";

const textDark = '#1e293b';
const textMuted = '#475569';
const borderLight = '#e2e8f0';

export const getResumeStyles = (accentColor, layout = DEFAULT_RESUME_CUSTOMIZATION.layout) => {
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
      color: accentColor,
      backgroundColor: `${accentColor}11`,
      padding: '4px 12px',
      borderRadius: '14px',
      border: `1px solid ${accentColor}33`,
      display: 'inline-block',
    },
  };

  if (layout === 'executive') {
    return {
      ...baseStyles,
      page: {
        ...baseStyles.page,
        padding: '44px',
        borderTop: `14px solid ${accentColor}`,
      },
      profilePic: {
        ...baseStyles.profilePic,
        borderRadius: '20px',
        width: '76px',
        height: '76px',
        boxShadow: `0 8px 20px ${accentColor}22`,
      },
      name: {
        ...baseStyles.name,
        fontSize: '28px',
        letterSpacing: '-0.6px',
      },
      title: {
        ...baseStyles.title,
        textTransform: 'uppercase',
        letterSpacing: '1.2px',
      },
      headerDivider: {
        ...baseStyles.headerDivider,
        height: '5px',
        borderRadius: '999px',
        margin: '14px 0 22px 0',
      },
      sectionTitle: {
        ...baseStyles.sectionTitle,
        letterSpacing: '2px',
        borderBottom: `3px solid ${accentColor}`,
        paddingBottom: '7px',
        marginBottom: '14px',
      },
      entry: {
        ...baseStyles.entry,
        paddingLeft: '14px',
        borderLeft: `4px solid ${accentColor}55`,
      },
      entrySubtitle: {
        ...baseStyles.entrySubtitle,
        fontSize: '11px',
        textTransform: 'uppercase',
        letterSpacing: '0.8px',
      },
      dateBadge: {
        ...baseStyles.dateBadge,
        color: '#ffffff',
        backgroundColor: accentColor,
        borderRadius: '999px',
      },
      skillTag: {
        ...baseStyles.skillTag,
        color: '#ffffff',
        backgroundColor: accentColor,
        border: `1px solid ${accentColor}`,
        borderRadius: '999px',
        padding: '5px 12px',
      },
    };
  }

  if (layout === 'minimal') {
    return {
      ...baseStyles,
      page: {
        ...baseStyles.page,
        padding: '36px',
        borderTop: `2px solid ${accentColor}55`,
      },
      profilePic: {
        ...baseStyles.profilePic,
        borderRadius: '14px',
        border: `1px solid ${accentColor}33`,
      },
      title: {
        ...baseStyles.title,
        color: textMuted,
        letterSpacing: '0.1px',
      },
      headerDivider: {
        ...baseStyles.headerDivider,
        height: '1px',
        background: `${accentColor}44`,
        margin: '12px 0 14px 0',
      },
      section: {
        ...baseStyles.section,
        marginBottom: '14px',
      },
      sectionTitle: {
        ...baseStyles.sectionTitle,
        fontSize: '12px',
        color: textDark,
        letterSpacing: '1px',
        borderBottom: 'none',
        paddingBottom: '0',
        marginBottom: '8px',
      },
      entry: {
        ...baseStyles.entry,
        paddingLeft: '0',
        borderLeft: 'none',
        marginBottom: '8px',
      },
      dateBadge: {
        ...baseStyles.dateBadge,
        backgroundColor: 'transparent',
        borderRadius: '0',
        padding: '0',
        color: accentColor,
      },
      subHeading: {
        ...baseStyles.subHeading,
        color: accentColor,
        letterSpacing: '0.8px',
      },
      entryDivider: {
        ...baseStyles.entryDivider,
        margin: '6px 0 10px 0',
        backgroundColor: `${accentColor}22`,
      },
      skillTag: {
        ...baseStyles.skillTag,
        color: textDark,
        backgroundColor: '#f8fafc',
        border: `1px solid ${accentColor}22`,
        borderRadius: '6px',
      },
    };
  }

  return baseStyles;
};
