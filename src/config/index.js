// ─── App Configuration ──────────────────────────────────────────
// Centralized configuration values.

const config = {
  // API
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',

  // App
  APP_NAME: 'EduAdmin Pro',
  APP_VERSION: '1.0.0',

  // Auth
  TOKEN_KEY: 'accessToken',
  REFRESH_TOKEN_KEY: 'refreshToken',
  USER_KEY: 'user',

  // Sidebar
  SIDEBAR_WIDTH: 260,
  SIDEBAR_COLLAPSED_WIDTH: 72,

  // Pagination
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 25, 50],
};

export default config;
