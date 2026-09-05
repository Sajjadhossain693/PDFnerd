import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import FileUploader from '../ui/FileUploader';
import FileList from '../ui/FileList';
import ProgressBar from '../ui/ProgressBar';
import toast from 'react-hot-toast';
import RecommendedActions from '../common/RecommendedActions';

export default function ToolLayout({
  title,
  description,
  icon = 'bi-file-earmark',
  accept = { 'application/pdf': ['.pdf'] },
  multiple = false,
  maxFiles = 20,
  onProcess,
  options,
  processLabel = 'Process Document',
  badge = null,
}) {
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState('idle'); // idle | processing | done | error
  const [progress, setProgress] = useState(0);
  const [outputFilename, setOutputFilename] = useState('');
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [stats, setStats] = useState(null);

  const handleFilesAccepted = useCallback(
    (accepted) => {
      if (multiple) {
        setFiles((prev) => [...prev, ...accepted]);
      } else {
        setFiles(accepted);
      }
      setStatus('idle');
      setDownloadUrl(null);
      setErrorMsg('');
    },
    [multiple]
  );

  const handleRemove = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
    }
  };

  const handleReorder = (newOrder) => setFiles(newOrder);

  const handleProcess = async () => {
    if (files.length === 0) {
      toast.error('Please upload at least one file.');
      return;
    }
    setStatus('processing');
    setProgress(15);
    setErrorMsg('');

    try {
      const progressTimer = setInterval(() => {
        setProgress((p) => (p < 85 ? p + Math.floor(Math.random() * 8 + 3) : p));
      }, 350);

      const result = await onProcess(files, (event) => {
        if (event.total) {
          setProgress(Math.round((event.loaded / event.total) * 85));
        }
      });

      clearInterval(progressTimer);
      setProgress(100);

      const blob = new Blob([result.data], {
        type: result.contentType || 'application/pdf',
      });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setOutputFilename(result.filename || `pdfmate_${title.toLowerCase().replace(/\s+/g, '_')}.pdf`);
      if (result.stats) setStats(result.stats);
      setStatus('done');
      toast.success('Document ready for download!');
    } catch (err) {
      setProgress(0);
      setStatus('error');
      const msg =
        err.response?.data?.error ||
        err.message ||
        'An error occurred during processing.';
      setErrorMsg(msg);
      toast.error(msg);
    }
  };

  const handleDownload = () => {
    if (!downloadUrl) return;
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = outputFilename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleReset = () => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setFiles([]);
    setStatus('idle');
    setProgress(0);
    setDownloadUrl(null);
    setErrorMsg('');
    setStats(null);
  };

  return (
    <div className="min-h-screen py-10 bg-forest-grid">
      <div className="section-container max-w-3xl">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-2 mb-6">
          <Link
            to="/tools"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <i className="bi bi-arrow-left"></i>
            <span>Back to All Tools</span>
          </Link>
          {badge && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
              {badge}
            </span>
          )}
        </div>

        {/* Tool Header Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 mb-6 relative overflow-hidden text-center shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-900 border border-slate-200 flex items-center justify-center text-2xl mx-auto mb-3">
            <i className={`bi ${icon}`}></i>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-2">
            {title}
          </h1>
          <p className="text-xs md:text-sm text-slate-500 max-w-lg mx-auto">
            {description}
          </p>
        </div>

        {/* Main Processing Card Area */}
        <div className="space-y-4">
          
          {/* 1. Upload Dropzone */}
          {status !== 'done' && (
            <FileUploader
              onFilesAccepted={handleFilesAccepted}
              accept={accept}
              multiple={multiple}
              maxFiles={maxFiles}
              icon={icon}
              disabled={status === 'processing'}
            />
          )}

          {/* 2. File List */}
          {files.length > 0 && status !== 'processing' && status !== 'done' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-slate-800">
                  {files.length} file{files.length !== 1 ? 's' : ''} loaded
                </span>
                <button
                  type="button"
                  onClick={() => setFiles([])}
                  className="text-xs text-slate-500 hover:text-red-500 transition-colors"
                >
                  Clear all
                </button>
              </div>
              <FileList
                files={files}
                onRemove={handleRemove}
                onReorder={multiple && files.length > 1 ? handleReorder : null}
              />
            </div>
          )}

          {/* 3. Options Panel (Rotation, Password, Pages, etc.) */}
          {options && files.length > 0 && status === 'idle' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              {options}
            </div>
          )}

          {/* 4. Processing Progress */}
          {status === 'processing' && (
            <ProgressBar progress={progress} label={`Applying ${title}...`} />
          )}

          {/* 5. Error State */}
          {status === 'error' && (
            <div className="bg-red-50/70 border border-red-200 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center text-xl mx-auto mb-3">
                <i className="bi bi-exclamation-triangle-fill"></i>
              </div>
              <h4 className="text-red-800 font-bold text-sm mb-1">Processing Failed</h4>
              <p className="text-red-600 text-xs mb-4">{errorMsg}</p>
              <button
                type="button"
                onClick={handleReset}
                className="btn-forest-outline text-xs py-2 px-5"
              >
                <i className="bi bi-arrow-clockwise"></i> Try Again
              </button>
            </div>
          )}

          {/* 6. Success & Download State */}
          {status === 'done' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center relative overflow-hidden shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-2xl mx-auto mb-3 font-bold shadow-sm">
                <i className="bi bi-check2"></i>
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-1">Processing Completed!</h3>
              <p className="text-xs text-slate-500 mb-5">
                Your processed document has been compiled and is ready for download.
              </p>

              {stats && (
                <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 mb-6">
                  {stats.originalSize && <span>Original: {stats.originalSize}</span>}
                  {stats.compressedSize && (
                    <span className="text-emerald-700 font-bold">
                      Result: {stats.compressedSize} (↓ {stats.savedPercent} saved)
                    </span>
                  )}
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="btn-lime text-xs uppercase tracking-wider py-3 px-8 w-full sm:w-auto shadow-md"
                >
                  <i className="bi bi-download"></i> Download File
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn-forest-outline text-xs py-3 px-6 w-full sm:w-auto"
                >
                  <i className="bi bi-arrow-repeat"></i> Process Another
                </button>
              </div>

              {/* PDFnerd Intelligent Flow: Recommended Next Actions */}
              <RecommendedActions
                currentTool={title}
                outputFilename={outputFilename}
                downloadUrl={downloadUrl}
              />
            </div>
          )}

          {/* 7. Action Button */}
          {files.length > 0 && status === 'idle' && (
            <button
              type="button"
              onClick={handleProcess}
              className="btn-lime w-full text-xs uppercase tracking-wider py-3.5 shadow-sm"
            >
              <i className="bi bi-play-fill text-sm"></i> {processLabel}
            </button>
          )}

        </div>

        {/* Security & Guarantee Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-10 pt-6 border-t border-slate-200 text-center">
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm">
            <i className="bi bi-clock-history text-slate-900 text-sm block mb-1"></i>
            <span className="text-[10px] text-slate-500 font-bold uppercase">60 Min Auto-Purge</span>
          </div>
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm">
            <i className="bi bi-shield-check text-slate-900 text-sm block mb-1"></i>
            <span className="text-[10px] text-slate-500 font-bold uppercase">SSL In-Memory</span>
          </div>
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm">
            <i className="bi bi-patch-check text-slate-900 text-sm block mb-1"></i>
            <span className="text-[10px] text-slate-500 font-bold uppercase">Zero Watermarks</span>
          </div>
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm">
            <i className="bi bi-cpu text-slate-900 text-sm block mb-1"></i>
            <span className="text-[10px] text-slate-500 font-bold uppercase">Open Source Tech</span>
          </div>
        </div>

      </div>
    </div>
  );
}
