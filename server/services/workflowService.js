const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { compressPdf, addPageNumbers, addWatermark } = require('./pdfService');
const { healPdfDocument, analyzePdfHealth } = require('./healthService');
const { auditAccessibility } = require('./accessibilityService');
const { scanPrivacyRisk, sanitizePdfDocument } = require('./privacyService');

// Built-in preset workflows
const PRESET_WORKFLOWS = [
  {
    slug: 'assignment-workflow',
    name: 'Assignment Finalization Workflow',
    category: 'academic',
    description: 'Add pagination, optimize file weight, and run pre-flight health check before submission.',
    steps: [
      { id: 'page-numbers', name: 'Add Sequential Page Numbers', description: 'Stamps bottom-center page numbers' },
      { id: 'compress', name: 'Smart Size Compression', description: 'Compresses streams for portal upload limits' },
      { id: 'health-check', name: 'PDF Health Diagnostic', description: 'Audits readability and integrity' },
    ],
  },
  {
    slug: 'submission-workflow',
    name: 'Official Submission & Clean Workflow',
    category: 'submission',
    description: 'Scrub metadata leaks, optimize object tree, and verify accessibility compliance.',
    steps: [
      { id: 'sanitize', name: 'Privacy Sanitization', description: 'Cleans metadata and removes author traces' },
      { id: 'compress', name: 'Stream Optimization', description: 'Reduces size while retaining crisp rendering' },
      { id: 'accessibility', name: 'Accessibility Audit', description: 'Verifies WCAG 2.2 / PDF/UA-1 markers' },
    ],
  },
  {
    slug: 'doctor-heal-workflow',
    name: 'Comprehensive PDF Doctor Healing',
    category: 'maintenance',
    description: 'One-click full restoration: heals metadata, normalizes rotation, and boosts health score.',
    steps: [
      { id: 'doctor-heal', name: 'Smart PDF Doctor', description: 'Automatic fixes for rotation, metadata, and streams' },
      { id: 'health-check', name: 'Verification Diagnostic', description: 'Calculates before/after health score' },
    ],
  },
];

/**
 * Execute a workflow chain on a given input file
 */
const executeWorkflow = async (filePath, workflowSlug, customConfig = {}) => {
  const preset = PRESET_WORKFLOWS.find((w) => w.slug === workflowSlug) || PRESET_WORKFLOWS[0];
  const stepResults = [];
  let currentFile = filePath;

  for (let i = 0; i < preset.steps.length; i++) {
    const step = preset.steps[i];
    const stepStart = Date.now();

    try {
      if (step.id === 'page-numbers') {
        const res = await addPageNumbers(currentFile, { position: 'bottom-center' });
        currentFile = res.filepath;
        stepResults.push({
          stepIndex: i + 1,
          name: step.name,
          status: 'success',
          outputFile: res.filename,
          durationMs: Date.now() - stepStart,
        });
      } else if (step.id === 'compress') {
        const res = await compressPdf(currentFile);
        currentFile = res.filepath;
        stepResults.push({
          stepIndex: i + 1,
          name: step.name,
          status: 'success',
          outputFile: res.filename,
          savedPercent: `${Math.round((1 - res.compressedSize / res.originalSize) * 100)}%`,
          durationMs: Date.now() - stepStart,
        });
      } else if (step.id === 'sanitize') {
        const res = await sanitizePdfDocument(currentFile, { stripMetadata: true, removeAnnotations: true });
        currentFile = res.filepath;
        stepResults.push({
          stepIndex: i + 1,
          name: step.name,
          status: 'success',
          outputFile: res.filename,
          durationMs: Date.now() - stepStart,
        });
      } else if (step.id === 'doctor-heal') {
        const res = await healPdfDocument(currentFile);
        currentFile = res.filepath;
        stepResults.push({
          stepIndex: i + 1,
          name: step.name,
          status: 'success',
          outputFile: res.filename,
          scoreImprovement: res.scoreImprovement,
          durationMs: Date.now() - stepStart,
        });
      } else if (step.id === 'health-check') {
        const report = await analyzePdfHealth(currentFile);
        stepResults.push({
          stepIndex: i + 1,
          name: step.name,
          status: 'success',
          healthScore: report.healthScore,
          durationMs: Date.now() - stepStart,
        });
      } else if (step.id === 'accessibility') {
        const audit = await auditAccessibility(currentFile);
        stepResults.push({
          stepIndex: i + 1,
          name: step.name,
          status: 'success',
          accessibilityScore: audit.overallScore,
          durationMs: Date.now() - stepStart,
        });
      }
    } catch (err) {
      stepResults.push({
        stepIndex: i + 1,
        name: step.name,
        status: 'error',
        error: err.message,
        durationMs: Date.now() - stepStart,
      });
      break;
    }
  }

  return {
    workflowName: preset.name,
    workflowSlug: preset.slug,
    finalFile: path.basename(currentFile),
    finalPath: currentFile,
    stepResults,
    totalSteps: preset.steps.length,
    completedSteps: stepResults.filter((s) => s.status === 'success').length,
  };
};

module.exports = {
  PRESET_WORKFLOWS,
  executeWorkflow,
};
