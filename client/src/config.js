// API
// ----------------------------------------------------------------------

export const HOST_API = import.meta.env.VITE_APP_HOST_API_KEY || '';

export const FIREBASE_API = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_APP_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_APP_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_FIREBASE_APPID,
  measurementId: import.meta.env.VITE_APP_FIREBASE_MEASUREMENT_ID,
};

export const COGNITO_API = {
  userPoolId: import.meta.env.VITE_APP_AWS_COGNITO_USER_POOL_ID,
  clientId: import.meta.env.VITE_APP_AWS_COGNITO_CLIENT_ID,
};

export const AUTH0_API = {
  clientId: import.meta.env.VITE_APP_AUTH0_CLIENT_ID,
  domain: import.meta.env.VITE_APP_AUTH0_DOMAIN,
};

export const MAPBOX_API = import.meta.env.VITE_APP_MAPBOX;

export const GOOGLE_ANALYTICS_API = import.meta.env.VITE_APP_GA_MEASUREMENT_ID;

// LAYOUT
// ----------------------------------------------------------------------

export const DRAWER_WIDTH = 260;

export const DASHBOARD_HEADER_MOBILE = 64;
export const DASHBOARD_HEADER_DESKTOP = 92;
export const DASHBOARD_NAVBAR_WIDTH = 280;
export const DASHBOARD_NAVBAR_COLLAPSE_WIDTH = 88;

export const DASHBOARD_NAVBAR_ROOT_ITEM_HEIGHT = 48;
export const DASHBOARD_NAVBAR_SUB_ITEM_HEIGHT = 40;
export const DASHBOARD_NAVBAR_ICON_ITEM_SIZE = 22;

export const MAIN_HEADER_DESKTOP = 88;
export const MAIN_HEADER_MOBILE = 64;

// SETTINGS
// ----------------------------------------------------------------------

export const defaultSettings = {
  themeMode: 'light',
  themeDirection: 'ltr',
  themeColorPresets: 'default',
  themeStretch: false,
};
