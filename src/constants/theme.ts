export const Colors = {
  bgPrimary: '#08080F',
  bgSurface: '#111120',
  bgSurface2: '#191930',
  bgSurface3: '#22223A',

  accentPrimary: '#F0C93A',
  accentSecondary: '#3A8EF0',
  accentDanger: '#E8453C',
  accentSuccess: '#2ECC71',

  textPrimary: '#F2F2F8',
  textSecondary: '#8888AA',
  textTertiary: '#55556A',

  border: 'rgba(255,255,255,0.06)',
  borderActive: 'rgba(240,201,58,0.3)',

  transparent: 'transparent',
};

export const Typography = {
  fontDisplay: 'Syne-Bold',
  fontBody: 'DMSans-Regular',
  fontBodyMedium: 'DMSans-Medium',

  sizeDisplay: 32,
  sizeH1: 24,
  sizeH2: 20,
  sizeH3: 16,
  sizeBody: 15,
  sizeCaption: 12,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  card: 12,
  button: 8,
  pill: 999,
};

export const Shadow = {
  card: {
    shadowColor: Colors.accentPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
};
