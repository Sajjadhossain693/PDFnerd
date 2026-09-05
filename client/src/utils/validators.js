const MAX_PDF_SIZE_MB = 10;
const MAX_PDF_SIZE_BYTES = MAX_PDF_SIZE_MB * 1024 * 1024;
const ALLOWED_PDF_TYPES = ['application/pdf'];
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const validatePdfFile = (file) => {
  if (!ALLOWED_PDF_TYPES.includes(file.type)) {
    return `"${file.name}" is not a PDF file.`;
  }
  if (file.size > MAX_PDF_SIZE_BYTES) {
    return `"${file.name}" exceeds the ${MAX_PDF_SIZE_MB}MB limit.`;
  }
  return null;
};

export const validateImageFile = (file) => {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return `"${file.name}" is not a supported image (JPG, PNG, WebP).`;
  }
  if (file.size > MAX_PDF_SIZE_BYTES) {
    return `"${file.name}" exceeds the ${MAX_PDF_SIZE_MB}MB limit.`;
  }
  return null;
};

export const validateMultiplePdfs = (files, max = 20) => {
  if (files.length < 2) return 'Please select at least 2 PDF files.';
  if (files.length > max) return `Maximum ${max} files allowed.`;
  for (const file of files) {
    const err = validatePdfFile(file);
    if (err) return err;
  }
  return null;
};
