import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL;

const getBaseUrl = () => {
  if (rawApiUrl && rawApiUrl.trim()) {
    const trimmed = rawApiUrl.trim().replace(/\/+$/, '');
    return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
  }
  // In production builds where VITE_API_URL might not have been provided at build time
  if (import.meta.env.PROD && typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
    return 'https://pdfnerd.onrender.com/api';
  }
  return '/api';
};

export const API_BASE_URL = getBaseUrl();

/**
 * Resolve an API or file download path to a fully-qualified or proxy-compatible URL.
 * Handles:
 * - Full URLs (e.g. https://...) -> unchanged
 * - Blob/data URLs -> unchanged
 * - Relative API paths (e.g. /api/pdf/download/... or pdf/download/...) -> resolved against API_BASE_URL
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

// Normalize request URLs to prevent accidental /api/api double-prefixing and attach JWT
api.interceptors.request.use(
  (config) => {
    // If request URL starts with /api/, strip it since baseURL already has /api
    if (config.url && typeof config.url === 'string') {
      if (config.url.startsWith('/api/')) {
        config.url = config.url.slice(4);
      } else if (config.url === '/api') {
        config.url = '/';
      }
    }

    const token = localStorage.getItem('pdfnerd_token') || localStorage.getItem('pdfinity_token');
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
      localStorage.removeItem('pdfnerd_token');
      localStorage.removeItem('pdfnerd_user');
      localStorage.removeItem('pdfinity_token');
      localStorage.removeItem('pdfinity_user');
      // Don't redirect here — let components handle it
    }
    return Promise.reject(error);
  }
);

export default api;
