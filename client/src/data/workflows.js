export const WORKFLOW_PRESETS = [
  {
    slug: 'assignment-workflow',
    name: 'Academic Assignment Pipeline',
    tagline: 'Cover → Pagination → Compression → Health Diagnostic',
    description: 'Designed for university course submissions. Stitches pagination, compresses file size under portal limits, and runs an integrity audit.',
    icon: 'bi-mortarboard-fill',
    badge: 'Popular',
    accentColor: '#2563EB',
    steps: [
      { id: 'page-numbers', title: 'Sequential Page Numbers', icon: 'bi-123', desc: 'Adds clean page numbers' },
      { id: 'compress', title: 'Smart Compression', icon: 'bi-file-zip', desc: 'Shrinks file size cleanly' },
      { id: 'health-check', title: 'Pre-flight Health Audit', icon: 'bi-heart-pulse', desc: 'Validates integrity score' },
    ],
  },
  {
    slug: 'submission-workflow',
    name: 'Official Clean Submission Pipeline',
    tagline: 'Privacy Cleanse → Stream Optimization → Accessibility Audit',
    description: 'Prepares sensitive research papers and official reports by purging metadata leaks and verifying WCAG 2.2 / PDF/UA-1 criteria.',
    icon: 'bi-shield-check',
    badge: 'Compliance',
    accentColor: '#059669',
    steps: [
      { id: 'sanitize', title: 'Privacy Sanitization', icon: 'bi-incognito', desc: 'Scrubs hidden author metadata' },
      { id: 'compress', title: 'Stream Optimization', icon: 'bi-lightning-charge', desc: 'Optimizes PDF dictionary' },
      { id: 'accessibility', title: 'Accessibility Audit', icon: 'bi-universal-access', desc: 'Checks structure tags' },
    ],
  },
  {
    slug: 'doctor-heal-workflow',
    name: 'Smart PDF Doctor Full Restoration',
    tagline: 'Rotation Fix → Metadata Rebuild → Structural Healing',
    description: 'Recovers degraded, rotated, or damaged PDFs into an optimal, healthy document with measurable score improvement.',
    icon: 'bi-bandaid-fill',
    badge: 'Healing',
    accentColor: '#D97706',
    steps: [
      { id: 'doctor-heal', title: 'PDF Doctor Surgery', icon: 'bi-capsule', desc: 'Executes automated fixes' },
      { id: 'health-check', title: 'Diagnostic Verification', icon: 'bi-graph-up-arrow', desc: 'Calculates before/after diff' },
    ],
  },
];
