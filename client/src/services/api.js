import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL;
export const API_BASE_URL = rawApiUrl ? rawApiUrl.replace(/\/+$/, '') : '/api';

/**
 * Resolve an API or file download path to a fully-qualified or proxy-compatible URL.
 * Handles:
 * - Full URLs (e.g. https://...) -> unchanged
 * - Blob/data URLs -> unchanged
 * - Relative API paths (e.g. /api/pdf/download/...) -> resolved against API_BASE_URL
 */
export const resolveApiUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:') || url.startsWith('data:')) {
    return url;
  }
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  if (cleanPath.startsWith('/api/') || cleanPath === '/api') {
    return `${API_BASE_URL}${cleanPath.slice(4)}`;
  }
  return `${API_BASE_URL}${cleanPath}`;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 2 min for large file processing
  withCredentials: true,
});

// Attach JWT token to every request if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('pdfinity_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle responses globally & auto-resolve download URLs
api.interceptors.response.use(
  (response) => {
    if (response.data && typeof response.data === 'object' && response.data.downloadUrl) {
      response.data.downloadUrl = resolveApiUrl(response.data.downloadUrl);
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('pdfinity_token');
      localStorage.removeItem('pdfinity_user');
      // Don't redirect here — let components handle it
    }
    return Promise.reject(error);
  }
);

export default api;
