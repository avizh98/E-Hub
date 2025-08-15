// API Configuration
export const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api' 
  : 'https://api.goforme.com/api';

export const SOCKET_URL = __DEV__ 
  ? 'http://localhost:3000' 
  : 'https://api.goforme.com';

// Colors - Accessible color palette
export const Colors = {
  primary: '#007AFF', // Blue
  secondary: '#5AC8FA', // Light Blue
  success: '#34C759', // Green
  warning: '#FF9500', // Orange
  danger: '#FF3B30', // Red
  dark: '#1C1C1E', // Dark Gray
  gray: '#8E8E93', // Gray
  lightGray: '#E5E5EA', // Light Gray
  background: '#F2F2F7', // Background Gray
  white: '#FFFFFF',
  black: '#000000',
  
  // Accessibility colors
  highContrast: {
    primary: '#0051D5',
    text: '#000000',
    background: '#FFFFFF',
  }
};

// Task Categories
export const TASK_CATEGORIES = [
  { id: 'shopping', label: 'Shopping', icon: 'shopping-cart' },
  { id: 'pharmacy', label: 'Pharmacy', icon: 'medical-services' },
  { id: 'pickup-delivery', label: 'Pickup/Delivery', icon: 'local-shipping' },
  { id: 'other', label: 'Other', icon: 'more-horiz' },
];

// Time Options
export const TIME_OPTIONS = [
  { id: 'asap', label: 'ASAP' },
  { id: 'scheduled', label: 'Schedule for Later' },
];

// Payment Methods
export const PAYMENT_METHODS = [
  { id: 'cash', label: 'Cash', icon: 'money' },
  { id: 'card', label: 'Credit/Debit Card', icon: 'credit-card' },
  { id: 'upi', label: 'UPI', icon: 'account-balance' },
  { id: 'wallet', label: 'Digital Wallet', icon: 'account-balance-wallet' },
];

// Map Configuration
export const MAP_CONFIG = {
  INITIAL_REGION: {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  },
  LOCATION_UPDATE_INTERVAL: 5000, // 5 seconds
  LOCATION_DISTANCE_FILTER: 10, // meters
};

// Task Constants
export const TASK_ACCEPTANCE_TIMEOUT = 90; // seconds
export const MAX_TASK_DISTANCE = 10; // km
export const SERVICE_FEE_PERCENTAGE = 0.15; // 15%

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: '@GoForMe:authToken',
  USER_DATA: '@GoForMe:userData',
  USER_ROLE: '@GoForMe:userRole',
  ONBOARDING_COMPLETE: '@GoForMe:onboardingComplete',
  HIGH_CONTRAST_MODE: '@GoForMe:highContrastMode',
};

// Validation Rules
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_DESCRIPTION_LENGTH: 500,
  MIN_TASK_BUDGET: 5,
  MAX_TASK_BUDGET: 1000,
  PHONE_REGEX: /^[0-9]{10}$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  VERIFICATION_REQUIRED: 'Please verify your account to continue.',
  LOCATION_PERMISSION_DENIED: 'Location permission is required to use this feature.',
  TASK_NOT_FOUND: 'Task not found.',
  PAYMENT_FAILED: 'Payment failed. Please try again.',
};

// Accessibility Labels
export const A11Y_LABELS = {
  BACK_BUTTON: 'Go back',
  CLOSE_BUTTON: 'Close',
  MENU_BUTTON: 'Open menu',
  PROFILE_PICTURE: 'Profile picture',
  RATING_STARS: 'Rating stars',
  TASK_CATEGORY: 'Task category',
  LOCATION_MARKER: 'Location marker',
};