import { alpha } from '@mui/material/styles'

// ----------------------------------------------------------------------

function createGradient(color1, color2) {
    return `linear-gradient(to bottom, ${color1}, ${color2})`
}

// SETUP COLORS
const PRIMARY = {
    lighter: 'rgba(139, 187, 244, 0.4)',
    light: '#73AEF2',
    main: '#2F86EB',
    dark: '#146CD1',
    darker: '#146CD1',
}
const SECONDARY = {
    lighter: 'rgba(139, 187, 244, 0.4)',
    light: '#73AEF2',
    main: '#2F86EB',
    dark: '#146CD1',
    darker: '#146CD1',
}
const INFO = {
    lighter: '#828d9b',
    light: '#687789',
    main: '#53647A',
    dark: '#3d4e63',
    darker: '#29394c',
}
const SUCCESS = {
    lighter: '#E9FCD4',
    light: '#AAF27F',
    main: '#14B842',
    dark: '#14B842',
    darker: '#08660D',
}
const WARNING = {
    lighter: '#FFF7CD',
    light: '#FFE16A',
    main: '#FFB400',
    dark: '#B78103',
    darker: '#7A4F01',
}
const ERROR = {
    lighter: '#FFA48D',
    light: '#FB8500',
    main: '#EE3737',
    dark: '#B72136',
    darker: '#7A0C2E',
}

const MUTED = {
    lighter: '#919EAB',
    light: '#6D7B8F',
    main: '#466485',
    dark: '#2B4057',
    darker: '#161C24',
}

const GREY = {
    0: '#FFFFFF',
    100: '#F9FAFB',
    200: '#F4F6F8',
    300: '#DFE3E8',
    400: '#C4CDD5',
    500: '#95A3B8',
    600: '#6D7B8F',
    700: '#454F5B',
    800: '#2B4057',
    900: '#161C24',
    500_8: alpha('#919EAB', 0.08),
    500_12: alpha('#919EAB', 0.12),
    500_16: alpha('#919EAB', 0.16),
    500_24: alpha('#919EAB', 0.24),
    500_32: alpha('#919EAB', 0.32),
    500_48: alpha('#919EAB', 0.48),
    500_56: alpha('#919EAB', 0.56),
    500_80: alpha('#919EAB', 0.8),
}

const GRADIENTS = {
    primary: createGradient(PRIMARY.light, PRIMARY.main),
    info: createGradient(INFO.light, INFO.main),
    success: createGradient(SUCCESS.light, SUCCESS.main),
    warning: createGradient(WARNING.light, WARNING.main),
    error: createGradient(ERROR.light, ERROR.main),
    muted: createGradient(MUTED.light, MUTED.main),
}

const CHART_COLORS = {
    violet: ['#826AF9', '#9E86FF', '#D0AEFF', '#F7D2FF'],
    blue: ['#2D99FF', '#83CFFF', '#A5F3FF', '#CCFAFF'],
    green: ['#2CD9C5', '#60F1C8', '#A4F7CC', '#C0F2DC'],
    yellow: ['#FFE700', '#FFEF5A', '#FFF7AE', '#FFF3D6'],
    red: ['#FF6C40', '#FF8F6D', '#FFBD98', '#FFF2D4'],
}

const COMMON = {
    common: { black: '#000', white: '#fff' },
    primary: { ...PRIMARY, contrastText: '#fff' },
    secondary: { ...SECONDARY, contrastText: '#fff' },
    info: { ...INFO, contrastText: '#fff' },
    success: { ...SUCCESS, contrastText: GREY[800] },
    warning: { ...WARNING, contrastText: GREY[800] },
    error: { ...ERROR, contrastText: '#fff' },
    muted: { ...MUTED, contrastText: '#fff', text: '#597CA4' },
    text: { primary: 'red' },
    grey: GREY,
    gradients: GRADIENTS,
    chart: CHART_COLORS,
    divider: GREY[500_24],
    action: {
        hover: GREY[500_8],
        selected: GREY[500_16],
        disabled: GREY[500_80],
        disabledBackground: GREY[500_24],
        focus: GREY[500_24],
        hoverOpacity: 0.08,
        disabledOpacity: 0.48,
    },
}

const palette = {
    light: {
        ...COMMON,
        mode: 'light',
        text: { primary: GREY[800], secondary: GREY[600], disabled: GREY[500] },
        background: { paper: '#fff', default: '#F5F7FA', neutral: GREY[200] },
        action: { active: GREY[600], ...COMMON.action },
    },
    athlete: {
        ...COMMON,
        mode: 'light',
        text: { primary: GREY[800], secondary: GREY[600], disabled: GREY[500] },
        background: { paper: '#fff', default: '#F5F7FA', neutral: GREY[200] },
        action: { active: GREY[600], ...COMMON.action },
        primary: { ...SECONDARY, contrastText: '#fff' },
        secondary: { ...SECONDARY, contrastText: '#fff' },
    },
    instructor: {
        ...COMMON,
        mode: 'light',
        text: { primary: GREY[800], secondary: GREY[600], disabled: GREY[500] },
        background: { paper: '#fff', default: '#F5F7FA', neutral: GREY[200] },
        action: { active: GREY[600], ...COMMON.action },
    },
    dark: {
        ...COMMON,
        mode: 'dark',
        text: { primary: '#fff', secondary: GREY[500], disabled: GREY[600] },
        background: {
            paper: GREY[800],
            default: GREY[900],
            neutral: GREY[500_16],
        },
        action: { active: GREY[500], ...COMMON.action },
    },
}

export default palette
