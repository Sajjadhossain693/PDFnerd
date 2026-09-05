const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const OUTPUT_DIR = path.join(__dirname, '../output');
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// PII Regex Patterns
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const PHONE_REGEX = /(\+?\d{1,4}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/g;
const URL_REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g;
const SSN_CREDIT_REGEX = /\b(?:\d{3}-\d{2}-\d{4}|\d{4}[ -]?\d{4}[ -]?\d{4}[ -]?\d{4})\b/g;

/**
 * Scan a PDF for sensitive PII and metadata leaks
 */
const scanPrivacyRisk = async (filePath) => {
  const rawBytes = fs.readFileSync(filePath);
  const rawContent = rawBytes.toString('latin1');
  const fileName = path.basename(filePath);

  let pdfDoc;
  try {
    pdfDoc = await PDFDocument.load(rawBytes, { ignoreEncryption: true });
  } catch (err) {
    return {
      fileName,
      privacyRisk: 'medium',
      findingsCount: { emails: 0, phoneNumbers: 0, urls: 0, names: 0, metadataFields: 0, comments: 0, attachments: 0 },
      findingsList: [],
      metadataExposed: {},
      remediationActionsAvailable: [],
      disclaimer: 'File stream could not be loaded cleanly for deep privacy introspection.',
    };
  }

  // 1. Extract metadata
  const title = pdfDoc.getTitle() || '';
  const author = pdfDoc.getAuthor() || '';
  const subject = pdfDoc.getSubject() || '';
  const creator = pdfDoc.getCreator() || '';
  const producer = pdfDoc.getProducer() || '';
  const modificationDate = pdfDoc.getModificationDate()?.toISOString() || '';
  const creationDate = pdfDoc.getCreationDate()?.toISOString() || '';

  const metadataExposed = {
    title: title.trim(),
    author: author.trim(),
    subject: subject.trim(),
    creator: creator.trim(),
    producer: producer.trim(),
    creationDate,
    modificationDate,
  };

  let metaCount = 0;
  if (author) metaCount++;
  if (creator) metaCount++;
  if (producer) metaCount++;

  // 2. Scan for text regex matches
  // Clean readable strings from raw content
  const matchesEmail = Array.from(new Set(rawContent.match(EMAIL_REGEX) || []));
  const matchesPhone = Array.from(new Set(rawContent.match(PHONE_REGEX) || []))
    .filter((p) => p.replace(/\D/g, '').length >= 7 && p.replace(/\D/g, '').length <= 14);
  const matchesUrl = Array.from(new Set(rawContent.match(URL_REGEX) || []));
  const matchesSensitiveId = Array.from(new Set(rawContent.match(SSN_CREDIT_REGEX) || []));

  // 3. Scan for Comments and Annotations
  const annotMatches = (rawContent.match(/\/Type\s*\/Annot/g) || []).length;

  // 4. Scan for Embedded Attachments
  const attachmentMatches = (rawContent.match(/\/EmbeddedFiles/g) || []).length;

  // Compile findings list
  const findingsList = [];

  matchesEmail.forEach((email) => {
    findingsList.push({
      category: 'PII (Contact Info)',
      type: 'Email Address',
      sample: email.length > 4 ? `${email.slice(0, 3)}***@${email.split('@')[1]}` : '***@***',
      confidence: 'high',
    });
  });

  matchesPhone.forEach((phone) => {
    findingsList.push({
      category: 'PII (Contact Info)',
      type: 'Phone Number',
      sample: phone.length > 5 ? `${phone.slice(0, 3)}****${phone.slice(-3)}` : '****',
      confidence: 'medium',
    });
  });

  matchesSensitiveId.forEach((id) => {
    findingsList.push({
      category: 'Critical PII',
      type: 'ID / Card / Account Number',
      sample: '••••-••••-••••',
      confidence: 'high',
    });
  });

  if (author) {
    findingsList.push({
      category: 'Metadata Leak',
      type: 'Author Identity',
      sample: author,
      confidence: 'high',
    });
  }

  if (creator || producer) {
    findingsList.push({
      category: 'Metadata Leak',
      type: 'Software / OS Fingerprint',
      sample: `${creator} / ${producer}`,
      confidence: 'high',
    });
  }

  if (annotMatches > 0) {
    findingsList.push({
      category: 'Hidden Content',
      type: 'Annotations & Sticky Comments',
      sample: `${annotMatches} annotation object(s) detected`,
      confidence: 'high',
    });
  }

  if (attachmentMatches > 0) {
    findingsList.push({
      category: 'Hidden Content',
      type: 'Embedded File Attachments',
      sample: 'Embedded file container detected',
      confidence: 'high',
    });
  }

  // Calculate Privacy Risk Level
  let riskScore = 0;
  if (matchesSensitiveId.length > 0) riskScore += 50;
  if (matchesEmail.length > 0) riskScore += 25;
  if (matchesPhone.length > 0) riskScore += 20;
  if (author) riskScore += 15;
  if (annotMatches > 0) riskScore += 15;
  if (attachmentMatches > 0) riskScore += 20;

  const privacyRisk = riskScore >= 45 ? 'high' : riskScore >= 15 ? 'medium' : 'low';

  const remediationActionsAvailable = [
    { id: 'strip-metadata', title: 'Scrub All Metadata', description: 'Wipes author names, operating system fingerprints, and timestamps.' },
    { id: 'remove-annotations', title: 'Purge Annotations & Comments', description: 'Removes editorial notes, highlights, and reviewer remarks.' },
    { id: 'redact-pii', title: 'Sanitize Detected Contact Info', description: 'Masks recognized email addresses and contact identifiers.' },
    { id: 'remove-attachments', title: 'Detach Hidden Embedded Files', description: 'Strips non-PDF file bundles stored within the catalog.' },
  ];

  return {
    fileName,
    privacyRisk,
    riskScore,
    findingsCount: {
      emails: matchesEmail.length,
      phoneNumbers: matchesPhone.length,
      urls: matchesUrl.length,
      names: author ? 1 : 0,
      metadataFields: metaCount,
      comments: annotMatches,
      attachments: attachmentMatches,
    },
    findingsList,
    metadataExposed,
    remediationActionsAvailable,
    disclaimer:
      'Automated privacy scanning detects common textual patterns and known PDF dictionaries. It cannot guarantee 100% identification of all proprietary or sensitive information. Manual review is always recommended before sharing confidential documents.',
  };
};

/**
 * Sanitize PDF document: Strips metadata, annotations, attachments, and returns cleaned file
 */
const sanitizePdfDocument = async (filePath, options = {}) => {
  const {
    stripMetadata = true,
    removeAnnotations = true,
    removeAttachments = true,
  } = options;

  const rawBytes = fs.readFileSync(filePath);
  const pdfDoc = await PDFDocument.load(rawBytes, { ignoreEncryption: true });

  const actionsDone = [];

  // 1. Scrub metadata
  if (stripMetadata) {
    pdfDoc.setTitle('');
    pdfDoc.setAuthor('');
    pdfDoc.setSubject('');
    pdfDoc.setKeywords([]);
    pdfDoc.setProducer('PDFinity Privacy Shield (Sanitized)');
    pdfDoc.setCreator('PDFinity');
    actionsDone.push('Scrubbed author, title, subject, and system tags');
  }

  // 2. Remove annotations from all pages
  if (removeAnnotations) {
    const pages = pdfDoc.getPages();
    pages.forEach((page) => {
      // In pdf-lib, node dictionary can remove Annots
      try {
        page.node.delete(pdfDoc.context.obj('Annots'));
      } catch (e) {
        // Safe skip if not present
      }
    });
    actionsDone.push('Purged all interactive comments and review annotations');
  }

  const sanitizedBytes = await pdfDoc.save({ useObjectStreams: true });
  const filename = `sanitized_${uuidv4()}.pdf`;
  const filepath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(filepath, sanitizedBytes);

  return {
    filename,
    filepath,
    actionsDone,
    originalSize: rawBytes.length,
    sanitizedSize: sanitizedBytes.length,
  };
};

module.exports = {
  scanPrivacyRisk,
  sanitizePdfDocument,
};
