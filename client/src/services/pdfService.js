import api from './api';

/**
 * All PDF tool API calls — each returns an axios response with blob data for file downloads.
 */
const pdfConfig = { responseType: 'blob', timeout: 180000 };

export const pdfService = {
  merge: (files, onProgress) => {
    const form = new FormData();
    files.forEach((f) => form.append('files', f));
    return api.post('/pdf/merge', form, {
      ...pdfConfig,
      onUploadProgress: onProgress,
    });
  },

  split: (file, options, onProgress) => {
    const form = new FormData();
    form.append('file', file);
    Object.entries(options).forEach(([k, v]) => v !== undefined && form.append(k, v));
    return api.post('/pdf/split', form, {
      ...pdfConfig,
      onUploadProgress: onProgress,
    });
  },

  compress: (file, onProgress) => {
    const form = new FormData();
    form.append('file', file);
    return api.post('/pdf/compress', form, {
      ...pdfConfig,
      onUploadProgress: onProgress,
    });
  },

  rotate: (file, rotation, pageRange, onProgress) => {
    const form = new FormData();
    form.append('file', file);
    form.append('rotation', rotation);
    if (pageRange) form.append('pageRange', pageRange);
    return api.post('/pdf/rotate', form, { ...pdfConfig, onUploadProgress: onProgress });
  },

  deletePages: (file, pages, onProgress) => {
    const form = new FormData();
    form.append('file', file);
    form.append('pages', pages);
    return api.post('/pdf/delete-pages', form, { ...pdfConfig, onUploadProgress: onProgress });
  },

  extractPages: (file, pages, onProgress) => {
    const form = new FormData();
    form.append('file', file);
    form.append('pages', pages);
    return api.post('/pdf/extract-pages', form, { ...pdfConfig, onUploadProgress: onProgress });
  },

  addWatermark: (file, options, onProgress) => {
    const form = new FormData();
    form.append('file', file);
    Object.entries(options).forEach(([k, v]) => form.append(k, v));
    return api.post('/pdf/watermark', form, { ...pdfConfig, onUploadProgress: onProgress });
  },

  addPageNumbers: (file, options, onProgress) => {
    const form = new FormData();
    form.append('file', file);
    Object.entries(options).forEach(([k, v]) => form.append(k, v));
    return api.post('/pdf/page-numbers', form, { ...pdfConfig, onUploadProgress: onProgress });
  },

  protect: (file, password, onProgress) => {
    const form = new FormData();
    form.append('file', file);
    form.append('password', password);
    return api.post('/pdf/protect', form, { ...pdfConfig, onUploadProgress: onProgress });
  },

  unlock: (file, password, onProgress) => {
    const form = new FormData();
    form.append('file', file);
    if (password) form.append('password', password);
    return api.post('/pdf/unlock', form, { ...pdfConfig, onUploadProgress: onProgress });
  },

  jpgToPdf: (files, onProgress) => {
    const form = new FormData();
    files.forEach((f) => form.append('files', f));
    return api.post('/pdf/jpg-to-pdf', form, { ...pdfConfig, onUploadProgress: onProgress });
  },
};

/**
 * Trigger a browser download from a blob response.
 */
export const downloadBlob = (response, filename) => {
  // Try to get filename from Content-Disposition header
  const disposition = response.headers?.['content-disposition'];
  if (disposition) {
    const match = disposition.match(/filename="?([^"]+)"?/);
    if (match) filename = match[1];
  }

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename || 'pdfnerd_output.pdf');
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
