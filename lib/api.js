/**
 * API client for backend communication
 */

export const getApiBaseUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl) {
    return envUrl.replace(/\/$/, '');
  }
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return 'http://localhost:3000';
};

/**
 * Get auth token from cookies
 */
export function getAuthToken() {
  if (typeof document === 'undefined') return null;
  
  const name = 'auth_token=';
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return null;
}

/**
 * Set auth token in cookies
 */
export function setAuthToken(token) {
  if (typeof document === 'undefined') return;
  
  // Set cookie with 7 days expiration
  const expires = new Date();
  expires.setTime(expires.getTime() + (7 * 24 * 60 * 60 * 1000));
  document.cookie = `auth_token=${token}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;
}

/**
 * Remove auth token from cookies
 */
export function removeAuthToken() {
  if (typeof document === 'undefined') return;
  
  document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}

/**
 * Make API request
 */
export async function apiRequest(endpoint, options = {}) {
  const token = getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${getApiBaseUrl()}${endpoint}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type') || '';
  let data = {};
  if (contentType.includes('application/json')) {
    data = await response.json();
  } else {
    const text = await response.text();
    data = text ? { message: text } : {};
  }

  if (!response.ok) {
    const message = typeof data.message === 'string' ? data.message : '';
    const fallbackMessage = `API request failed with status ${response.status}`;
    const isHtmlResponse = /<[^>]+>/.test(message);
    throw new Error(message && !isHtmlResponse ? message : fallbackMessage);
  }

  return data;
}

/**
 * Auth API methods
 */
export const authAPI = {
  register: async (userData) => {
    return apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  
  login: async (credentials) => {
    return apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
  
  getProfile: async () => {
    return apiRequest('/api/auth/profile');
  },
  
  updateProfile: async (profileData) => {
    return apiRequest('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },
  
  updatePassword: async (passwordData) => {
    return apiRequest('/api/auth/password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  },
  getUserStats: async () => {
    return apiRequest('/api/auth/stats');
  },
  githubAuth: async () => {
    return apiRequest('/api/auth/github');
  },
  githubCallback: async (payload) => {
    return apiRequest('/api/auth/github/callback', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};

/**
 * Article API methods
 */
export const articleAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/api/articles?${queryString}` : '/api/articles';
    return apiRequest(endpoint);
  },
  
  getById: async (id) => {
    return apiRequest(`/api/articles/${id}`);
  },
  
  create: async (articleData) => {
    return apiRequest('/api/articles', {
      method: 'POST',
      body: JSON.stringify(articleData),
    });
  },
  
  update: async (id, articleData) => {
    return apiRequest(`/api/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(articleData),
    });
  },
  
  delete: async (id) => {
    return apiRequest(`/api/articles/${id}`, {
      method: 'DELETE',
    });
  },
  
  approveNews: async (id) => {
    return apiRequest(`/api/articles/${id}/approve-news`, {
      method: 'POST',
    });
  },
};
