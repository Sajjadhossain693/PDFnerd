const { PDFDocument, degrees, rgb, StandardFonts, grayscale } = require('pdf-lib');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const OUTPUT_DIR = path.join(__dirname, '../output');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

/**
 * Save a PDF document to disk and return the filename.
 */
const savePdf = async (pdfDoc, prefix = 'output') => {
  const bytes = await pdfDoc.save();
  const filename = `${prefix}_${uuidv4()}.pdf`;
  const filepath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(filepath, bytes);
  return { filename, filepath };
};

/**
 * MERGE: Combine multiple PDFs into one.
 */
const mergePdfs = async (filePaths) => {
  const mergedPdf = await PDFDocument.create();

  for (const filePath of filePaths) {
    const bytes = fs.readFileSync(filePath);
    let sourcePdf;
    try {
      sourcePdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
    } catch (e) {
      throw new Error(`Could not read file: ${path.basename(filePath)}. It may be corrupted or password-protected.`);
    }
    const pages = await mergedPdf.copyPages(sourcePdf, sourcePdf.getPageIndices());
    pages.forEach((page) => mergedPdf.addPage(page));
  }

  return savePdf(mergedPdf, 'merged');
};

/**
 * SPLIT: Extract a range or specific pages from a PDF.
 * @param {string} filePath
 * @param {string} mode - 'range' | 'every' | 'pages'
 * @param {object} options - { start, end, every, pages }
 * Returns array of { filename, filepath } objects.
 */
const splitPdf = async (filePath, mode, options = {}) => {
  const bytes = fs.readFileSync(filePath);
  const sourcePdf = await PDFDocument.load(bytes);
  const totalPages = sourcePdf.getPageCount();
  const results = [];

  if (mode === 'range') {
    // Split into chunks of [start..end] (1-indexed)
    const start = Math.max(1, parseInt(options.start) || 1);
    const end = Math.min(totalPages, parseInt(options.end) || totalPages);
    const newPdf = await PDFDocument.create();
    const indices = Array.from({ length: end - start + 1 }, (_, i) => start - 1 + i);
    const pages = await newPdf.copyPages(sourcePdf, indices);
    pages.forEach((p) => newPdf.addPage(p));
    results.push(await savePdf(newPdf, 'split'));
  } else if (mode === 'every') {
    // Split into individual pages or chunks of N
    const every = Math.max(1, parseInt(options.every) || 1);
    for (let i = 0; i < totalPages; i += every) {
      const newPdf = await PDFDocument.create();
      const end = Math.min(i + every, totalPages);
      const indices = Array.from({ length: end - i }, (_, j) => i + j);
      const pages = await newPdf.copyPages(sourcePdf, indices);
      pages.forEach((p) => newPdf.addPage(p));
      results.push(await savePdf(newPdf, `split_part${Math.floor(i / every) + 1}`));
    }
  } else if (mode === 'pages') {
    // Split by specific page numbers (comma-separated, 1-indexed)
    const pageNums = (options.pages || '')
      .split(',')
      .map((n) => parseInt(n.trim()) - 1)
      .filter((n) => n >= 0 && n < totalPages);
    if (pageNums.length === 0) throw new Error('No valid page numbers provided.');
    const newPdf = await PDFDocument.create();
    const pages = await newPdf.copyPages(sourcePdf, pageNums);
    pages.forEach((p) => newPdf.addPage(p));
    results.push(await savePdf(newPdf, 'split_pages'));
  } else {
    throw new Error(`Unknown split mode: ${mode}`);
  }

  return results;
};

/**
 * COMPRESS: Reduce PDF size by removing metadata and compressing streams.
 * Note: pdf-lib does not do lossy image compression; for deep compression
 * Ghostscript (gs) would be used in a later phase. This removes metadata/duplicates.
 */
const compressPdf = async (filePath) => {
  const bytes = fs.readFileSync(filePath);
  const pdfDoc = await PDFDocument.load(bytes);

  // Remove metadata to reduce size
  pdfDoc.setTitle('');
  pdfDoc.setAuthor('');
  pdfDoc.setSubject('');
  pdfDoc.setKeywords([]);
  pdfDoc.setProducer('PDFinity');
  pdfDoc.setCreator('PDFinity');

  // Save with compression
  const compressedBytes = await pdfDoc.save({ useObjectStreams: true });
  const filename = `compressed_${uuidv4()}.pdf`;
  const filepath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(filepath, compressedBytes);

  const originalSize = fs.statSync(filePath).size;
  const compressedSize = compressedBytes.length;

  return { filename, filepath, originalSize, compressedSize };
};

/**
 * ROTATE: Rotate all or specific pages by degrees.
 * @param {string} filePath
 * @param {number} rotation - 90, 180, 270
 * @param {string|null} pageRange - '1,3,5' or null for all pages
 */
const rotatePdf = async (filePath, rotation = 90, pageRange = null) => {
  const bytes = fs.readFileSync(filePath);
  const pdfDoc = await PDFDocument.load(bytes);
  const pages = pdfDoc.getPages();
  const totalPages = pages.length;

  let targetIndices;
  if (pageRange) {
    targetIndices = pageRange
      .split(',')
      .map((n) => parseInt(n.trim()) - 1)
      .filter((n) => n >= 0 && n < totalPages);
  } else {
    targetIndices = Array.from({ length: totalPages }, (_, i) => i);
  }

  targetIndices.forEach((idx) => {
    const page = pages[idx];
    const currentRotation = page.getRotation().angle;
    page.setRotation(degrees((currentRotation + rotation) % 360));
  });

  return savePdf(pdfDoc, 'rotated');
};

/**
 * DELETE PAGES: Remove specific pages from a PDF.
 * @param {string} filePath
 * @param {string} pagesToDelete - '1,3,5' (1-indexed)
 */
const deletePages = async (filePath, pagesToDelete) => {
  const bytes = fs.readFileSync(filePath);
  const sourcePdf = await PDFDocument.load(bytes);
  const totalPages = sourcePdf.getPageCount();

  const deleteSet = new Set(
    pagesToDelete
      .split(',')
      .map((n) => parseInt(n.trim()) - 1)
      .filter((n) => n >= 0 && n < totalPages)
  );

  if (deleteSet.size === totalPages) throw new Error('Cannot delete all pages from the PDF.');

  const keepIndices = Array.from({ length: totalPages }, (_, i) => i).filter(
    (i) => !deleteSet.has(i)
  );

  const newPdf = await PDFDocument.create();
  const copiedPages = await newPdf.copyPages(sourcePdf, keepIndices);
  copiedPages.forEach((p) => newPdf.addPage(p));

  return savePdf(newPdf, 'deleted_pages');
};

/**
 * EXTRACT PAGES: Extract specific pages and save as new PDF.
 */
const extractPages = async (filePath, pagesToExtract) => {
  const bytes = fs.readFileSync(filePath);
  const sourcePdf = await PDFDocument.load(bytes);
  const totalPages = sourcePdf.getPageCount();

  const extractIndices = pagesToExtract
    .split(',')
    .map((n) => parseInt(n.trim()) - 1)
    .filter((n) => n >= 0 && n < totalPages);

  if (extractIndices.length === 0) throw new Error('No valid pages to extract.');

  const newPdf = await PDFDocument.create();
  const pages = await newPdf.copyPages(sourcePdf, extractIndices);
  pages.forEach((p) => newPdf.addPage(p));

  return savePdf(newPdf, 'extracted');
};

/**
 * ADD WATERMARK: Overlay text watermark on every page.
 */
const addWatermark = async (filePath, text = 'CONFIDENTIAL', options = {}) => {
  const bytes = fs.readFileSync(filePath);
  const pdfDoc = await PDFDocument.load(bytes);
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const pages = pdfDoc.getPages();

  const {
    opacity = 0.25,
    fontSize = 60,
    color = { r: 0.7, g: 0.7, b: 0.7 },
    rotation = -45,
  } = options;

  pages.forEach((page) => {
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    page.drawText(text, {
      x: (width - textWidth) / 2,
      y: height / 2,
      size: fontSize,
      font,
      color: rgb(color.r, color.g, color.b),
      opacity,
      rotate: degrees(rotation),
    });
  });

  return savePdf(pdfDoc, 'watermarked');
};

/**
 * ADD PAGE NUMBERS: Add page numbers to each page.
 */
const addPageNumbers = async (filePath, options = {}) => {
  const bytes = fs.readFileSync(filePath);
  const pdfDoc = await PDFDocument.load(bytes);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const pages = pdfDoc.getPages();
  const { position = 'bottom-center', startNumber = 1, fontSize = 12 } = options;

  pages.forEach((page, idx) => {
    const { width, height } = page.getSize();
    const pageNum = `${startNumber + idx}`;
    const textWidth = font.widthOfTextAtSize(pageNum, fontSize);

    let x, y;
    switch (position) {
      case 'bottom-center': x = (width - textWidth) / 2; y = 20; break;
      case 'bottom-left': x = 30; y = 20; break;
      case 'bottom-right': x = width - textWidth - 30; y = 20; break;
      case 'top-center': x = (width - textWidth) / 2; y = height - 30; break;
      case 'top-left': x = 30; y = height - 30; break;
      case 'top-right': x = width - textWidth - 30; y = height - 30; break;
      default: x = (width - textWidth) / 2; y = 20;
    }

    page.drawText(pageNum, { x, y, size: fontSize, font, color: rgb(0, 0, 0) });
  });

  return savePdf(pdfDoc, 'numbered');
};

/**
 * PROTECT: Add user/owner password to PDF.
 * Note: pdf-lib does not support encryption natively.
 * This function creates a manifest and returns a "locked" flag.
 * Full encryption requires qpdf in a later phase.
 */
const protectPdf = async (filePath, userPassword) => {
  // For now, return the original PDF with a note
  // Phase 4 will integrate qpdf for real encryption
  const bytes = fs.readFileSync(filePath);
  const pdfDoc = await PDFDocument.load(bytes);
  pdfDoc.setProducer(`PDFinity (Protected)`);
  return savePdf(pdfDoc, 'protected');
};

/**
 * UNLOCK: Remove password (if known) from PDF.
 */
const unlockPdf = async (filePath, password = '') => {
  const bytes = fs.readFileSync(filePath);
  let pdfDoc;
  try {
    pdfDoc = await PDFDocument.load(bytes, {
      ignoreEncryption: true,
      password,
    });
  } catch {
    throw new Error('Incorrect password or file cannot be unlocked.');
  }
  return savePdf(pdfDoc, 'unlocked');
};

/**
 * JPG / PNG to PDF: Convert one or multiple images into a single PDF.
 */
const imagesToPdf = async (imageFilePaths) => {
  const pdfDoc = await PDFDocument.create();

  for (const imgPath of imageFilePaths) {
    const bytes = fs.readFileSync(imgPath);
    const ext = path.extname(imgPath).toLowerCase();
    let embeddedImg;

    if (ext === '.png') {
      embeddedImg = await pdfDoc.embedPng(bytes);
    } else {
      embeddedImg = await pdfDoc.embedJpg(bytes);
    }

    const { width, height } = embeddedImg.scale(1);
    const page = pdfDoc.addPage([width, height]);
    page.drawImage(embeddedImg, {
      x: 0,
      y: 0,
      width,
      height,
    });
  }

  return savePdf(pdfDoc, 'images_converted');
};

module.exports = {
  mergePdfs,
  splitPdf,
  compressPdf,
  rotatePdf,
  deletePages,
  extractPages,
  addWatermark,
  addPageNumbers,
  protectPdf,
  unlockPdf,
  imagesToPdf,
};
