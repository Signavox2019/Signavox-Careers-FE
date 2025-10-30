// Route protection utility functions

export const AUTH_PAGES = [
  'login',
  'register', 
  'forgot-password',
  'reset-password'
];

export const PROTECTED_PAGES = [
  'profile',
  'dashboard',
  'settings'
];

export const PUBLIC_PAGES = [
  'jobs',
  'home'
];

/**
 * Check if a path is an authentication page
 * @param {string} pathname - The current pathname
 * @returns {boolean} - True if the path is an auth page
 */
export const isAuthPage = (pathname) => {
  return AUTH_PAGES.some(page => pathname === `/${page}` || pathname.startsWith(`/${page}/`));
};

/**
 * Check if a path is a protected page that requires authentication
 * @param {string} pathname - The current pathname
 * @returns {boolean} - True if the path requires authentication
 */
export const isProtectedPage = (pathname) => {
  return PROTECTED_PAGES.some(page => pathname === `/${page}` || pathname.startsWith(`/${page}/`));
};

/**
 * Check if a path is a public page that doesn't require authentication
 * @param {string} pathname - The current pathname
 * @returns {boolean} - True if the path is public
 */
export const isPublicPage = (pathname) => {
  return PUBLIC_PAGES.some(page => pathname === `/${page}` || pathname.startsWith(`/${page}/`));
};

/**
 * Get the appropriate redirect path based on authentication status
 * @param {boolean} isAuthenticated - Whether the user is authenticated
 * @param {string} pathname - The current pathname
 * @returns {string} - The path to redirect to
 */
export const getRedirectPath = (isAuthenticated, pathname) => {
  if (isAuthenticated && isAuthPage(pathname)) {
    return '/'; // Redirect authenticated users away from auth pages
  }
  
  if (!isAuthenticated && isProtectedPage(pathname)) {
    return '/login'; // Redirect unauthenticated users to login
  }
  
  return null; // No redirect needed
};

/**
 * Check if user has permission to perform actions on a page
 * @param {boolean} isAuthenticated - Whether the user is authenticated
 * @param {string} pathname - The current pathname
 * @returns {boolean} - True if user can perform actions
 */
export const canPerformActions = (isAuthenticated, pathname) => {
  // For jobs page, user needs to be authenticated to apply
  if (pathname.includes('jobs')) {
    return isAuthenticated;
  }
  
  // For other pages, follow normal authentication rules
  return isAuthenticated;
};
