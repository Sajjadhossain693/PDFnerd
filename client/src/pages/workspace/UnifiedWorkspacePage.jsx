import { Link } from 'react-router-dom';
import { useWorkspace } from '../../context/WorkspaceContext';
import FileUploader from '../../components/ui/FileUploader';
import toast from 'react-hot-toast';

export default function UnifiedWorkspacePage() {
  const { activeDocument, documentVersions, setWorkingDocument, clearWorkingDocument } = useWorkspace();

  const handleFileAccepted = (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const f = acceptedFiles[0];
      setWorkingDocument({
        file: f,
        name: f.name,
        sizeBytes: f.size,
        lastOperation: 'Direct Workspace Upload',
      });
      toast.success(`"${f.name}" loaded into Unified Workspace!`);
    }
  };

  const quickActions = [
    { to: '/health', title: 'Health Diagnostic', icon: 'bi-heart-pulse', color: 'text-emerald-600', desc: '0-100 audit & integrity' },
    { to: '/doctor', title: 'Smart PDF Doctor', icon: 'bi-capsule', color: 'text-amber-600', desc: 'Auto-heal & rotate' },
    { to: '/tools/compress-pdf', title: 'Compress Size', icon: 'bi-file-zip', color: 'text-blue-600', desc: 'Shrink file footprint' },
    { to: '/accessibility', title: 'Accessibility Check', icon: 'bi-universal-access', color: 'text-purple-600', desc: 'WCAG 2.2 / PDF-UA' },
    { to: '/privacy-scanner', title: 'Privacy Scan', icon: 'bi-shield-check', color: 'text-rose-600', desc: 'Sanitize contact PII' },
    { to: '/study', title: 'Study Mode', icon: 'bi-book-half', color: 'text-indigo-600', desc: 'Flashcards & MCQs' },
    { to: '/ai-assistant', title: 'Ask My Document', icon: 'bi-chat-dots', color: 'text-sky-600', desc: 'Semantic Q&A' },
    { to: '/academic', title: 'Academic Studio', icon: 'bi-mortarboard', color: 'text-slate-900', desc: 'Attach Cover Page' },
  ];

  return (
    <div className="min-h-screen bg-[#07090E] pt-24 pb-20">
      <div className="section-container max-w-5xl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
              <i className="bi bi-briefcase-fill"></i> Central Working Tray
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Unified Document Workspace
            </h1>
            <p className="text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
              Hold an active working file and seamlessly chain operations—from health diagnostics and compression to study mode and academic cover attachment—without repeatedly re-uploading.
            </p>
          </div>

          {activeDocument && (
            <button
              type="button"
              onClick={clearWorkingDocument}
              className="text-xs text-rose-400 hover:text-rose-300 font-bold bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 px-3.5 py-2 rounded-xl transition-all self-start md:self-auto"
            >
              <i className="bi bi-trash mr-1"></i> Clear Active Document
            </button>
          )}
        </div>

        {/* If no document loaded */}
        {!activeDocument && (
          <div className="bg-[#0D111C] border border-[#1E2638] rounded-3xl p-6 sm:p-10 shadow-2xl text-center space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-[#151A27] text-amber-400 border border-[#232B3D] flex items-center justify-center text-2xl mx-auto shadow-md">
              <i className="bi bi-folder2-open"></i>
            </div>
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-black text-white">Your Workspace is Ready</h3>
              <p className="text-xs text-zinc-400 mt-1">
                Upload a document here to keep it in your active tray across all 26+ PDFinity utilities and intelligent tools.
              </p>
            </div>

            <FileUploader
              onFilesAccepted={handleFileAccepted}
              accept={{ 'application/pdf': ['.pdf'] }}
              multiple={false}
              title="Drop PDF to Load into Active Workspace"
              description="Document will remain accessible in your session across all tool pages"
            />
          </div>
        )}

        {/* Active Document Overview Card */}
        {activeDocument && (
          <div className="space-y-8">
            <div className="bg-[#0D111C] border border-[#1E2638] rounded-3xl p-6 sm:p-8 shadow-2xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#1E2638]">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF4E64] to-[#FF8E53] text-white flex items-center justify-center text-2xl font-bold shadow-md shadow-orange-500/20">
                    <i className="bi bi-file-earmark-pdf"></i>
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-0.5 rounded-full inline-block mb-1">
                      Active In-Memory Document
                    </span>
                    <h3 className="text-lg font-black text-white truncate max-w-sm sm:max-w-md">
                      {activeDocument.name}
                    </h3>
                    <div className="text-xs text-zinc-400 mt-0.5">
                      {activeDocument.sizeBytes ? `${Math.round(activeDocument.sizeBytes / 1024)} KB` : 'Ready'} • Last action: {activeDocument.lastOperation}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {activeDocument.downloadUrl && (
                    <a
                      href={activeDocument.downloadUrl}
                      download={activeDocument.name}
                      className="btn-lime text-xs uppercase tracking-wider py-2.5 px-5 shadow-lg shadow-orange-500/20"
                    >
                      <i className="bi bi-download"></i> Download Latest
                    </a>
                  )}
                </div>
              </div>

              {/* Action Grid: Direct Execution on this Document */}
              <div className="pt-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 mb-4">
                  Apply Operations to "{activeDocument.name}"
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {quickActions.map((act, i) => (
                    <Link
                      key={i}
                      to={act.to}
                      className="p-4 rounded-2xl border border-[#1E2638] bg-[#121724] hover:bg-[#181F30] hover:border-zinc-500 transition-all text-left group shadow-sm"
                    >
                      <i className={`bi ${act.icon} ${act.color} text-xl block mb-2`}></i>
                      <div className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                        {act.title}
                      </div>
                      <div className="text-[11px] text-zinc-400 mt-0.5 line-clamp-1">{act.desc}</div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Document Version History */}
            <div className="bg-[#0D111C] border border-[#1E2638] rounded-3xl p-6 sm:p-8 shadow-2xl">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 mb-4 pb-2 border-b border-[#1E2638] flex items-center justify-between">
                <span>Transformation Version History</span>
                <span className="text-[10px] text-zinc-500 font-normal">Session Trace</span>
              </h4>

              {documentVersions.length === 0 ? (
                <div className="text-xs text-zinc-500 text-center py-4">No modifications logged yet.</div>
              ) : (
                <div className="space-y-2.5">
                  {documentVersions.map((v, i) => (
                    <div
                      key={v.id || i}
                      className="p-3.5 rounded-xl bg-[#121724] border border-[#1E2638] flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-[#1E2638] text-amber-400 text-[10px] font-bold flex items-center justify-center">
                          v{documentVersions.length - i}
                        </span>
                        <div>
                          <span className="font-bold text-white">{v.name}</span>
                          <span className="text-[11px] text-zinc-400 block">Operation: {v.operation}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-zinc-500">{v.timestamp}</span>
                        {v.downloadUrl && (
                          <a
                            href={v.downloadUrl}
                            download={v.name}
                            className="text-xs text-amber-400 hover:text-amber-300 font-bold hover:underline"
                          >
                            Download
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
