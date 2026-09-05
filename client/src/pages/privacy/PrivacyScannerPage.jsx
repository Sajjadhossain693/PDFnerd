import { useState } from 'react';
import { Link } from 'react-router-dom';
import FileUploader from '../../components/ui/FileUploader';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { useWorkspace } from '../../context/WorkspaceContext';

export default function PrivacyScannerPage() {
  const { setWorkingDocument } = useWorkspace();
  const [file, setFile] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isSanitizing, setIsSanitizing] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [sanitizedDownload, setSanitizedDownload] = useState(null);

  const handleFileAccepted = (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setScanResult(null);
      setSanitizedDownload(null);
    }
  };

  const handleRunScan = async () => {
    if (!file) {
      toast.error('Please upload a PDF document to scan for privacy risks.');
      return;
    }

    setIsScanning(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/privacy/scan', formData);
      if (res.data.success) {
        setScanResult(res.data.scanResult);
        setWorkingDocument({
          file,
          name: file.name,
          sizeBytes: file.size,
          lastOperation: 'Privacy Scan',
          privacyRisk: res.data.scanResult.privacyRisk,
        });
        toast.success(`Privacy scan complete: ${res.data.scanResult.privacyRisk.toUpperCase()} risk tier`);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Privacy scan failed.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleSanitize = async () => {
    if (!file) return;

    setIsSanitizing(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('stripMetadata', 'true');
    formData.append('removeAnnotations', 'true');
    formData.append('removeAttachments', 'true');

    try {
      const res = await api.post('/privacy/sanitize', formData);
      if (res.data.success) {
        setSanitizedDownload(res.data);
        setWorkingDocument({
          name: res.data.filename,
          downloadUrl: res.data.downloadUrl,
          lastOperation: 'Privacy Sanitization',
          privacyRisk: 'low',
        });
        toast.success('Document cleansed and sanitized!');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Sanitization failed.');
    } finally {
      setIsSanitizing(false);
    }
  };

  const getRiskBadge = (risk) => {
    if (risk === 'low') return { label: 'Low Risk', class: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
    if (risk === 'medium') return { label: 'Medium Risk', class: 'bg-amber-50 text-amber-800 border-amber-200' };
    return { label: 'High Risk', class: 'bg-rose-50 text-rose-800 border-rose-200' };
  };

  return (
    <div className="min-h-screen bg-forest-canvas pt-24 pb-20">
      <div className="section-container max-w-5xl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-800 text-xs font-bold uppercase tracking-wider mb-2">
              <i className="bi bi-shield-lock-fill"></i> PII & Metadata Inspection
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Document Privacy Check
            </h1>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl">
              Detect sensitive personally identifiable information (PII), email addresses, telephone numbers, author fingerprints, and hidden revision comments before sharing files publicly.
            </p>
          </div>
        </div>

        {/* Upload Card */}
        {!scanResult && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs">
            <FileUploader
              onFilesAccepted={handleFileAccepted}
              accept={{ 'application/pdf': ['.pdf'] }}
              multiple={false}
              title="Select or Drop PDF for Privacy Inspection"
              description="Deep buffer regex analysis of contact info, comments, and author tags"
            />

            {file && (
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                    <i className="bi bi-shield-exclamation"></i>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{file.name}</div>
                    <div className="text-[11px] text-slate-400">{Math.round(file.size / 1024)} KB</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRunScan}
                  disabled={isScanning}
                  className="btn-lime text-xs uppercase tracking-wider py-3 px-6 shadow-sm w-full sm:w-auto"
                >
                  {isScanning ? (
                    <>
                      <i className="bi bi-arrow-repeat animate-spin"></i> Inspecting Stream...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-eye"></i> Run Privacy Scan
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Scan Results View */}
        {scanResult && (
          <div className="space-y-8">
            
            {/* Top Score Banner */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <span
                  className={`inline-block text-xs font-bold px-3 py-1 rounded-full border mb-2 uppercase tracking-wider ${
                    getRiskBadge(scanResult.privacyRisk).class
                  }`}
                >
                  {getRiskBadge(scanResult.privacyRisk).label}
                </span>
                <h3 className="text-xl font-black text-slate-900">{scanResult.fileName}</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Exposed Metadata Fields: {scanResult.findingsCount.metadataFields} • Detected PII Elements: {scanResult.findingsList.length}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                <button
                  type="button"
                  onClick={handleSanitize}
                  disabled={isSanitizing}
                  className="btn-lime text-xs uppercase tracking-wider py-3.5 px-6 shadow-sm w-full sm:w-auto text-center"
                >
                  {isSanitizing ? (
                    <>
                      <i className="bi bi-arrow-repeat animate-spin"></i> Sanitizing...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-shield-slash"></i> Sanitize & Clean Document
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setScanResult(null)}
                  className="btn-forest-outline text-xs py-3.5 px-5 w-full sm:w-auto"
                >
                  Scan Another
                </button>
              </div>
            </div>

            {/* Sanitized Output Download Banner if performed */}
            {sanitizedDownload && (
              <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-200 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-left">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-xl font-bold">
                    <i className="bi bi-shield-check"></i>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-emerald-950">Document Cleansed Successfully!</h4>
                    <p className="text-xs text-emerald-700">Metadata scrubbed, comments purged, and stream flattened.</p>
                  </div>
                </div>

                <a
                  href={sanitizedDownload.downloadUrl}
                  download={sanitizedDownload.filename}
                  className="btn-lime text-xs uppercase tracking-wider py-3 px-6 shadow-sm whitespace-nowrap"
                >
                  <i className="bi bi-download"></i> Download Sanitized PDF
                </a>
              </div>
            )}

            {/* Findings Overview Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Emails Found', count: scanResult.findingsCount.emails, icon: 'bi-envelope' },
                { label: 'Phones Found', count: scanResult.findingsCount.phoneNumbers, icon: 'bi-telephone' },
                { label: 'Author Tags', count: scanResult.findingsCount.names, icon: 'bi-person-badge' },
                { label: 'Comments / Annots', count: scanResult.findingsCount.comments, icon: 'bi-chat-left-text' },
              ].map((f, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white border border-slate-200 text-center shadow-xs">
                  <i className={`bi ${f.icon} text-lg text-slate-700 block mb-1`}></i>
                  <div className="text-2xl font-black text-slate-900">{f.count}</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">{f.label}</div>
                </div>
              ))}
            </div>

            {/* Findings Detail List */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 mb-4 pb-2 border-b border-slate-100">
                Identified Sensitive Findings
              </h3>

              {scanResult.findingsList.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs">
                  <i className="bi bi-shield-check text-2xl text-emerald-500 block mb-2"></i>
                  No sensitive contact patterns or hidden comments detected in text streams.
                </div>
              ) : (
                <div className="space-y-3">
                  {scanResult.findingsList.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-xs">
                          <i className="bi bi-shield-exclamation"></i>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase text-purple-700 block">{item.category}</span>
                          <span className="text-xs font-bold text-slate-900">{item.type}</span>
                        </div>
                      </div>

                      <span className="font-mono text-xs bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700">
                        {item.sample}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Disclaimer */}
            <div className="p-4 rounded-2xl bg-slate-100/80 border border-slate-200 text-[11px] text-slate-500 leading-relaxed italic">
              <strong>Notice:</strong> {scanResult.disclaimer}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
