// Theme configuration with requested palette:
// Primary: #89ABD2
// Secondary: #E0E8F0

export const PALETTE = {
  primary: '#89ABD2',        // User requested color 1
  secondary: '#E0E8F0',      // User requested color 2
  primaryDark: '#5E88B3',
  primaryLight: '#B1C9E4',
  secondaryDark: '#C7D7E6',
  secondaryLight: '#F3F7FA',

  // Accent & Functional colors
  accent: '#5A8BB8',
  success: '#10B981',
  successBg: '#D1FAE5',
  warning: '#F59E0B',
  warningBg: '#FEF3C7',
  danger: '#EF4444',
  dangerBg: '#FEE2E2',
  info: '#3B82F6',
  infoBg: '#DBEAFE',

  // Neutral tones
  white: '#FFFFFF',
  black: '#0F172A',
  gray50: '#F8FAFC',
  gray100: '#F1F5F9',
  gray200: '#E2E8F0',
  gray300: '#CBD5E1',
  gray400: '#94A3B8',
  gray500: '#64748B',
  gray600: '#475569',
  gray700: '#334155',
  gray800: '#1E293B',
  gray900: '#0F172A',
};

export const getTheme = (isDark: boolean) => ({
  isDark,
  colors: {
    primary: PALETTE.primary,
    primaryDark: PALETTE.primaryDark,
    primaryLight: PALETTE.primaryLight,
    secondary: PALETTE.secondary,
    secondaryDark: PALETTE.secondaryDark,
    secondaryLight: PALETTE.secondaryLight,

    background: isDark ? '#0B1120' : '#F4F7FB',
    surface: isDark ? '#1E293B' : '#FFFFFF',
    surfaceElevated: isDark ? '#27354A' : '#FFFFFF',
    surfaceSubtle: isDark ? '#162234' : PALETTE.secondaryLight,

    text: isDark ? '#F8FAFC' : '#1E293B',
    textSecondary: isDark ? '#94A3B8' : '#64748B',
    textMuted: isDark ? '#64748B' : '#94A3B8',
    textInverse: isDark ? '#0F172A' : '#FFFFFF',

    border: isDark ? '#2B3B52' : PALETTE.secondary,
    borderStrong: isDark ? '#3E516D' : '#CBD5E1',
    divider: isDark ? '#1E293B' : PALETTE.secondary,

    cardHeaderBg: isDark ? '#1A2638' : PALETTE.secondaryLight,
    badgeBg: isDark ? '#27364D' : PALETTE.secondary,
    badgeText: isDark ? PALETTE.primaryLight : '#3B6A99',

    inputBg: isDark ? '#141E2D' : '#FFFFFF',
    inputBorder: isDark ? '#2A3C54' : PALETTE.secondaryDark,
    inputPlaceholder: isDark ? '#64748B' : '#94A3B8',

    success: PALETTE.success,
    successBg: isDark ? '#064E3B' : PALETTE.successBg,
    danger: PALETTE.danger,
    dangerBg: isDark ? '#7F1D1D' : PALETTE.dangerBg,
    warning: PALETTE.warning,
    warningBg: isDark ? '#78350F' : PALETTE.warningBg,

    tabBarBg: isDark ? '#131D2D' : '#FFFFFF',
    tabBarBorder: isDark ? '#1F2E45' : PALETTE.secondary,
    tabBarActive: PALETTE.primary,
    tabBarInactive: isDark ? '#64748B' : '#94A3B8',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  radii: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999,
  },
  shadows: isDark
    ? {
        card: {
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 4,
        },
        button: {
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 2,
        },
      }
    : {
        card: {
          shadowColor: '#89ABD2',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 10,
          elevation: 3,
        },
        button: {
          shadowColor: '#89ABD2',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.35,
          shadowRadius: 8,
          elevation: 4,
        },
      },
});

export type AppTheme = ReturnType<typeof getTheme>;
