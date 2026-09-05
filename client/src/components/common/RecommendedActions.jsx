import { Link } from 'react-router-dom';
import { useWorkspace } from '../../context/WorkspaceContext';
import toast from 'react-hot-toast';

const RECOMMENDATION_MAP = {
  merge: [
    { to: '/tools/compress-pdf', label: 'Compress PDF', icon: 'bi-file-zip', note: 'Shrink combined file weight' },
    { to: '/tools/page-numbers', label: 'Add Page Numbers', icon: 'bi-123', note: 'Sequential pagination' },
    { to: '/health', label: 'Health Check', icon: 'bi-heart-pulse', note: 'Audit structural integrity' },
    { to: '/privacy-scanner', label: 'Privacy Scan', icon: 'bi-shield-check', note: 'Detect exposed PII' },
  ],
  compress: [
    { to: '/health', label: 'PDF Health Audit', icon: 'bi-heart-pulse', note: 'Verify score after compression' },
    { to: '/accessibility', label: 'Accessibility Audit', icon: 'bi-universal-access', note: 'Verify WCAG compliance' },
    { to: '/tools/watermark', label: 'Watermark', icon: 'bi-droplet-half', note: 'Add security overlay' },
  ],
  split: [
    { to: '/tools/compress-pdf', label: 'Compress Output', icon: 'bi-file-zip', note: 'Optimize extracted part' },
    { to: '/study', label: 'Study Mode', icon: 'bi-book-half', note: 'Generate flashcards & quiz' },
    { to: '/academic', label: 'Academic Studio', icon: 'bi-mortarboard', note: 'Create formal cover page' },
  ],
  'jpg-to-pdf': [
    { to: '/tools/compress-pdf', label: 'Compress PDF', icon: 'bi-file-zip', note: 'Reduce image payload' },
    { to: '/tools/ocr-pdf', label: 'Run OCR', icon: 'bi-eye', note: 'Make scanned text selectable' },
    { to: '/tools/page-numbers', label: 'Add Page Numbers', icon: 'bi-123', note: 'Insert pagination' },
  ],
  ocr: [
    { to: '/study', label: 'Study Mode', icon: 'bi-book-half', note: 'Generate notes & MCQs' },
    { to: '/ai-assistant', label: 'Ask My Document', icon: 'bi-chat-dots', note: 'Converse with your PDF' },
    { to: '/academic/tools', label: 'Text Tools & Citations', icon: 'bi-quote', note: 'Format text & build APA' },
  ],
  academic: [
    { to: '/tools/merge-pdf', label: 'Attach Report PDF', icon: 'bi-files', note: 'Merge cover with main report' },
    { to: '/tools/page-numbers', label: 'Add Page Numbers', icon: 'bi-123', note: 'Standardize pagination' },
    { to: '/health', label: 'Health Pre-Flight', icon: 'bi-heart-pulse', note: 'Check submission readiness' },
  ],
  default: [
    { to: '/workspace', label: 'Unified Workspace', icon: 'bi-briefcase', note: 'View active working document' },
    { to: '/health', label: 'PDF Health Check', icon: 'bi-heart-pulse', note: 'Diagnose document score' },
    { to: '/privacy-scanner', label: 'Privacy Scan', icon: 'bi-shield-check', note: 'Scan for leaks' },
    { to: '/study', label: 'Study Mode', icon: 'bi-book-half', note: 'Generate flashcards & quiz' },
  ],
};

export default function RecommendedActions({ currentTool = 'default', outputFilename = '', downloadUrl = null }) {
  const { setWorkingDocument, activeDocument } = useWorkspace();

  const key = Object.keys(RECOMMENDATION_MAP).find((k) => currentTool.toLowerCase().includes(k)) || 'default';
  const actions = RECOMMENDATION_MAP[key] || RECOMMENDATION_MAP.default;

  const handleSendToWorkspace = () => {
    if (!outputFilename) return;
    setWorkingDocument({
      name: outputFilename,
      downloadUrl,
      lastOperation: currentTool,
    });
    toast.success(`"${outputFilename}" saved as active working document!`);
  };

  return (
    <div className="mt-6 pt-6 border-t border-slate-200 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 inline-flex items-center gap-1 mb-1">
            <i className="bi bi-stars"></i> Intelligent Flow
          </span>
          <h4 className="text-sm font-black text-slate-900">Recommended Next Actions</h4>
        </div>

        {outputFilename && (
          <button
            type="button"
            onClick={handleSendToWorkspace}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300/80 px-3.5 py-2 rounded-xl transition-all shadow-sm"
          >
            <i className="bi bi-folder-plus text-slate-800"></i>
            <span>Keep in Workspace</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {actions.map((act, i) => (
          <Link
            key={i}
            to={act.to}
            className="group flex flex-col p-3 rounded-xl bg-slate-50 hover:bg-white border border-slate-200 hover:border-slate-400/60 shadow-xs hover:shadow-sm transition-all text-left"
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-lg bg-slate-200/80 group-hover:bg-slate-900 text-slate-700 group-hover:text-white flex items-center justify-center text-xs transition-colors">
                <i className={`bi ${act.icon}`}></i>
              </div>
              <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                {act.label}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 line-clamp-1">{act.note}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
