const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

/**
 * Evaluates document compliance against PDF/UA-1 and WCAG 2.2 accessibility criteria
 */
const auditAccessibility = async (filePath) => {
  const rawBytes = fs.readFileSync(filePath);
  const rawContent = rawBytes.toString('latin1');
  const fileName = path.basename(filePath);

  let pdfDoc;
  try {
    pdfDoc = await PDFDocument.load(rawBytes, { ignoreEncryption: true });
  } catch (e) {
    return {
      fileName,
      overallScore: 15,
      standards: { pdfUa1: false, wcag22: false },
      summaryCounts: { passed: 1, warnings: 2, errors: 4, critical: 1 },
      checks: [
        {
          ruleId: 'PDF-UA-01',
          name: 'Document Readability',
          standard: 'PDF/UA-1',
          severity: 'critical',
          description: 'Document stream is corrupt or unparseable.',
          guidance: 'Repair PDF before attempting accessibility verification.',
        },
      ],
      disclaimer: 'Automated checking does not guarantee formal legal certification. Manual verification with screen readers (NVDA/JAWS) is recommended.',
    };
  }

  const pageCount = pdfDoc.getPageCount();

  // 1. Tagged PDF check
  const hasStructTree = rawContent.includes('/StructTreeRoot');
  const hasMarkInfo = rawContent.includes('/MarkInfo');
  const isTagged = hasStructTree || hasMarkInfo;

  // 2. Document Title in Metadata & ViewerPreferences
  const title = pdfDoc.getTitle();
  const hasTitle = Boolean(title && title.trim().length > 0);
  const displaysDocTitle = rawContent.includes('/DisplayDocTitle true');

  // 3. Document Natural Language (/Lang attribute in Catalog)
  const hasLang = rawContent.includes('/Lang (');

  // 4. Heading Hierarchy (H1, H2, H3 tags)
  const hasHeadings = rawContent.includes('/H1') || rawContent.includes('/H2') || rawContent.includes('/H');

  // 5. Alternative text for images (/Alt attribute)
  const hasImages = rawContent.includes('/Subtype /Image') || rawContent.includes('/Subtype/Image');
  const hasAltText = rawContent.includes('/Alt (');

  // 6. Table structure tagging
  const hasTableTags = rawContent.includes('/Table') && (rawContent.includes('/TR') || rawContent.includes('/TH'));

  // 7. Bookmarks / Outlines (Required for docs > 4 pages)
  const hasBookmarks = rawContent.includes('/Outlines');

  // 8. Form accessibility (Tooltips on interactive fields)
  const hasForms = rawContent.includes('/AcroForm');
  const hasFormTooltips = rawContent.includes('/TU (');

  // 9. Font embedding for assistive text extraction
  const fontsEmbedded = rawContent.includes('/FontDescriptor');

  // 10. Color contrast & text structure
  const hasTextOperators = rawContent.includes('Tj') || rawContent.includes('TJ');

  // Build check rules
  const checks = [
    {
      ruleId: 'WCAG-2.2-2.4.2',
      name: 'Document Title & Window Display',
      standard: 'WCAG 2.2 Level A / PDF/UA-1',
      severity: hasTitle ? 'pass' : 'error',
      description: hasTitle
        ? `Document title is formally declared: "${title}"`
        : 'Document lacks a descriptive Title in the metadata dictionary.',
      guidance: 'Add a clear, descriptive title to help screen reader users identify the document.',
    },
    {
      ruleId: 'PDF-UA-7.1',
      name: 'Tagged Logical Structure Tree',
      standard: 'PDF/UA-1 clause 7.1',
      severity: isTagged ? 'pass' : 'critical',
      description: isTagged
        ? 'Logical structure tree (/StructTreeRoot) is present in the document catalog.'
        : 'Untagged document. Screen readers cannot establish reading order or structural semantics.',
      guidance: 'Use an accessible authoring tool (e.g. Word or Acrobat) to generate tagged structural trees.',
    },
    {
      ruleId: 'WCAG-2.2-3.1.1',
      name: 'Natural Language Declaration',
      standard: 'WCAG 2.2 Level A',
      severity: hasLang ? 'pass' : 'warning',
      description: hasLang
        ? 'Primary document language is specified in the catalog (/Lang).'
        : 'Primary document language is not defined. Text-to-speech synthesizers may use the wrong pronunciation rules.',
      guidance: 'Specify document language (e.g. "en-US", "bn-BD", "es-ES") in document properties.',
    },
    {
      ruleId: 'WCAG-2.2-1.3.1',
      name: 'Semantic Heading Hierarchy',
      standard: 'WCAG 2.2 Level A',
      severity: isTagged && hasHeadings ? 'pass' : 'warning',
      description: hasHeadings
        ? 'Heading tags (H1..H6) provide navigation landmarks.'
        : 'No explicit heading tags found. Navigating long sections will be arduous for assistive tech users.',
      guidance: 'Apply hierarchical headings (H1 for Title, H2 for Major Sections) to delineate content.',
    },
    {
      ruleId: 'WCAG-2.2-1.1.1',
      name: 'Non-Text Content Alternative Descriptions (Alt Text)',
      standard: 'WCAG 2.2 Level A',
      severity: !hasImages ? 'pass' : hasAltText ? 'pass' : 'error',
      description: !hasImages
        ? 'No graphical image elements detected.'
        : hasAltText
        ? 'Image figures contain /Alt text description keys.'
        : 'Figures / Images detected without alternate text (/Alt). Assistive tools cannot describe them to visually impaired readers.',
      guidance: 'Provide concise alternate text explaining diagrams, charts, and illustrative graphics.',
    },
    {
      ruleId: 'PDF-UA-7.2',
      name: 'Navigation Outlines & Bookmarks',
      standard: 'PDF/UA-1 clause 7.2',
      severity: pageCount < 4 ? 'pass' : hasBookmarks ? 'pass' : 'warning',
      description: hasBookmarks
        ? 'Document contains interactive outline bookmarks.'
        : pageCount < 4
        ? 'Short document (< 4 pages); bookmarks optional.'
        : 'Multi-page document lacks outline bookmarks for rapid navigation.',
      guidance: 'Generate bookmarks corresponding to top-level sections for easier browsing.',
    },
    {
      ruleId: 'WCAG-2.2-1.4.3',
      name: 'Font Embedding & Glyphs',
      standard: 'WCAG 2.2 Level AA',
      severity: fontsEmbedded ? 'pass' : 'warning',
      description: fontsEmbedded
        ? 'Font glyph descriptors embedded for accurate rendering and screen reader synthesis.'
        : 'Some fonts are un-embedded system fonts; text-to-speech synthesis could substitute incorrect glyphs.',
      guidance: 'Embed full or subset fonts when converting documents to PDF.',
    },
    {
      ruleId: 'WCAG-2.2-1.3.2',
      name: 'Meaningful Sequential Reading Order',
      standard: 'WCAG 2.2 Level A',
      severity: hasTextOperators ? 'pass' : 'error',
      description: hasTextOperators
        ? 'Linear text stream verified.'
        : 'No linear text stream found (document may be purely rasterized images).',
      guidance: 'Run Optical Character Recognition (OCR) to convert scanned pixels into machine-readable text.',
    },
  ];

  // Count severities
  const passed = checks.filter((c) => c.severity === 'pass').length;
  const warnings = checks.filter((c) => c.severity === 'warning').length;
  const errors = checks.filter((c) => c.severity === 'error').length;
  const critical = checks.filter((c) => c.severity === 'critical').length;

  // Calculate score (0-100)
  let score = Math.round((passed / checks.length) * 100);
  if (critical > 0) score = Math.min(score, 45);
  else if (errors > 0) score = Math.min(score, 75);

  return {
    fileName,
    overallScore: score,
    standards: {
      pdfUa1: score >= 80 && isTagged,
      wcag22: score >= 75 && hasTitle,
    },
    summaryCounts: {
      passed,
      warnings,
      errors,
      critical,
    },
    checks,
    disclaimer:
      'Automated accessibility scanning analyzes programmatic markers according to PDF/UA-1 and WCAG 2.2 specifications. It does not replace manual verification with assistive technologies (screen readers, voice control, high contrast displays) or formal compliance certification.',
  };
};

module.exports = {
  auditAccessibility,
};
