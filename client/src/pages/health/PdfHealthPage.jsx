import { useState } from 'react';
import { Link } from 'react-router-dom';
import FileUploader from '../../components/ui/FileUploader';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { useWorkspace } from '../../context/WorkspaceContext';

export default function PdfHealthPage() {
  const { setWorkingDocument, activeDocument } = useWorkspace();
  const [file, setFile] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [healthReport, setHealthReport] = useState(null);

  const handleFileAccepted = (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setHealthReport(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      toast.error('Please upload a PDF to analyze.');
      return;
    }

    setIsScanning(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/health-check/analyze', formData);
      if (res.data.success) {
        setHealthReport(res.data.report);
        setWorkingDocument({
          file,
          name: file.name,
          sizeBytes: file.size,
          pageCount: res.data.report.pageCount,
          lastOperation: 'PDF Health Audit',
          healthScore: res.data.report.healthScore,
        });
        toast.success(`Health diagnostic completed: ${res.data.report.healthScore}/100`);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Diagnostic scan failed.');
    } finally {
      setIsScanning(false);
    }
  };

  // Color code by score
  const getScoreColor = (score) => {
    if (score >= 85) return { ring: '#10B981', badge: 'bg-emerald-50 text-emerald-800 border-emerald-200', text: 'Optimal Health' };
    if (score >= 65) return { ring: '#F59E0B', badge: 'bg-amber-50 text-amber-800 border-amber-200', text: 'Needs Improvement' };
    return { ring: '#EF4444', badge: 'bg-rose-50 text-rose-800 border-rose-200', text: 'Critical Issues Detected' };
  };

  return (
    <div className="min-h-screen bg-forest-canvas pt-24 pb-20">
      <div className="section-container max-w-5xl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
              <i className="bi bi-heart-pulse-fill"></i> Document Diagnostic Engine
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              PDF Health Score
            </h1>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl">
              Upload any document to audit searchability, embedded typography, stream compression, broken references, and structural accessibility.
            </p>
          </div>

          <Link
            to="/doctor"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-300 px-4 py-2.5 rounded-xl shadow-sm transition-all"
          >
            <i className="bi bi-capsule"></i>
            <span>Open Smart PDF Doctor</span>
          </Link>
        </div>

        {/* Upload Card if no report yet */}
        {!healthReport && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs mb-8">
            <FileUploader
              onFilesAccepted={handleFileAccepted}
              accept={{ 'application/pdf': ['.pdf'] }}
              multiple={false}
              title="Select or Drop a PDF to Analyze Health"
              description="Deep analysis of text streams, font tables, compression, and metadata"
            />

            {file && (
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                    <i className="bi bi-file-earmark-pdf"></i>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{file.name}</div>
                    <div className="text-[11px] text-slate-400">{Math.round(file.size / 1024)} KB</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={isScanning}
                  className="btn-lime text-xs uppercase tracking-wider py-3 px-6 shadow-sm w-full sm:w-auto"
                >
                  {isScanning ? (
                    <>
                      <i className="bi bi-arrow-repeat animate-spin"></i> Inspecting Document...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-search"></i> Run Health Diagnostic
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Health Diagnostic Result View */}
        {healthReport && (
          <div className="space-y-8">
            
            {/* Top Score Banner */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-8">
              
              <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                {/* Score Circle */}
                <div className="relative w-32 h-32 flex items-center justify-center rounded-full bg-slate-50 border-4 border-slate-100 shadow-inner">
                  <div className="text-center">
                    <div className="text-3xl font-black text-slate-900">{healthReport.healthScore}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">/ 100</div>
                  </div>
                </div>

                <div>
                  <span
                    className={`inline-block text-xs font-bold px-3 py-1 rounded-full border mb-2 ${
                      getScoreColor(healthReport.healthScore).badge
                    }`}
                  >
                    {getScoreColor(healthReport.healthScore).text}
                  </span>
                  <h3 className="text-xl font-black text-slate-900">{healthReport.fileName}</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {healthReport.pageCount} Pages • {Math.round(healthReport.fileSizeBytes / 1024)} KB Total Size
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                <Link
                  to="/doctor"
                  className="btn-lime text-xs uppercase tracking-wider py-3.5 px-6 shadow-sm w-full sm:w-auto text-center"
                >
                  <i className="bi bi-capsule mr-1"></i> Auto-Heal with Doctor
                </Link>
                <button
                  type="button"
                  onClick={() => setHealthReport(null)}
                  className="btn-forest-outline text-xs py-3.5 px-5 w-full sm:w-auto"
                >
                  Analyze Another
                </button>
              </div>

            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Searchable Text', ok: healthReport.metrics.isSearchable, icon: 'bi-search' },
                { label: 'Embedded Fonts', ok: healthReport.metrics.fontsEmbedded, icon: 'bi-type' },
                { label: 'Document Metadata', ok: healthReport.metrics.hasMetadata, icon: 'bi-info-circle' },
                { label: 'Accessibility Tags', ok: healthReport.metrics.accessibilityTagsPresent, icon: 'bi-universal-access' },
              ].map((m, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 block">{m.label}</span>
                    <span className={`text-xs font-black ${m.ok ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {m.ok ? 'Optimal' : 'Needs Fix'}
                    </span>
                  </div>
                  <i
                    className={`bi ${m.ok ? 'bi-check-circle-fill text-emerald-500' : 'bi-exclamation-circle-fill text-rose-500'} text-lg`}
                  ></i>
                </div>
              ))}
            </div>

            {/* Itemized Audit Checks */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 mb-4 pb-2 border-b border-slate-100">
                Detailed Diagnostic Checks
              </h3>

              <div className="space-y-3">
                {healthReport.checks.map((c) => (
                  <div
                    key={c.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {c.status === 'pass' && <i className="bi bi-check2-circle text-emerald-600 text-lg"></i>}
                        {c.status === 'warning' && <i className="bi bi-exclamation-triangle text-amber-500 text-lg"></i>}
                        {c.status === 'fail' && <i className="bi bi-x-circle text-rose-600 text-lg"></i>}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{c.title}</div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{c.detail}</p>
                        {c.recommendation && (
                          <div className="text-[11px] text-blue-600 font-semibold mt-1">
                            💡 Recommendation: {c.recommendation}
                          </div>
                        )}
                      </div>
                    </div>

                    {c.suggestedTool && (
                      <Link
                        to={c.suggestedTool === 'doctor' ? '/doctor' : `/tools/${c.suggestedTool}`}
                        className="text-xs font-bold text-slate-800 bg-white hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap self-start sm:self-center"
                      >
                        Fix Now →
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
