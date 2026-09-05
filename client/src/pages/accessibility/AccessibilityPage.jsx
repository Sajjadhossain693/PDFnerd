import { useState } from 'react';
import { Link } from 'react-router-dom';
import FileUploader from '../../components/ui/FileUploader';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { useWorkspace } from '../../context/WorkspaceContext';

export default function AccessibilityPage() {
  const { setWorkingDocument } = useWorkspace();
  const [file, setFile] = useState(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState(null);

  const handleFileAccepted = (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setAuditResult(null);
    }
  };

  const handleRunAudit = async () => {
    if (!file) {
      toast.error('Please upload a PDF document to audit.');
      return;
    }

    setIsAuditing(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/accessibility/audit', formData);
      if (res.data.success) {
        setAuditResult(res.data.audit);
        setWorkingDocument({
          file,
          name: file.name,
          sizeBytes: file.size,
          lastOperation: 'Accessibility Audit',
          accessibilityScore: res.data.audit.overallScore,
        });
        toast.success(`Accessibility audit finished: ${res.data.audit.overallScore}/100`);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Accessibility verification failed.');
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="min-h-screen bg-forest-canvas pt-24 pb-20">
      <div className="section-container max-w-5xl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold uppercase tracking-wider mb-2">
              <i className="bi bi-universal-access"></i> PDF/UA-1 & WCAG 2.2 Standards
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Accessibility & Compliance
            </h1>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl">
              Evaluate digital document accessibility against international standards: screen reader tagging, semantic heading trees, figure descriptions, and reading order.
            </p>
          </div>
        </div>

        {/* Upload State */}
        {!auditResult && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs">
            <FileUploader
              onFilesAccepted={handleFileAccepted}
              accept={{ 'application/pdf': ['.pdf'] }}
              multiple={false}
              title="Select or Drop PDF for Accessibility Audit"
              description="Evaluates tagged structure trees, metadata titles, and alternate text"
            />

            {file && (
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                    <i className="bi bi-file-earmark-check"></i>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{file.name}</div>
                    <div className="text-[11px] text-slate-400">{Math.round(file.size / 1024)} KB</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRunAudit}
                  disabled={isAuditing}
                  className="btn-lime text-xs uppercase tracking-wider py-3 px-6 shadow-sm w-full sm:w-auto"
                >
                  {isAuditing ? (
                    <>
                      <i className="bi bi-arrow-repeat animate-spin"></i> Auditing WCAG Rules...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-shield-check"></i> Run Compliance Verification
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Audit Results View */}
        {auditResult && (
          <div className="space-y-8">
            
            {/* Top Score Banner */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                <div className="relative w-28 h-28 flex items-center justify-center rounded-full bg-slate-50 border-4 border-slate-100 shadow-inner">
                  <div className="text-center">
                    <div className="text-3xl font-black text-slate-900">{auditResult.overallScore}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">/ 100</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-black text-slate-900">{auditResult.fileName}</h3>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                        auditResult.standards.pdfUa1
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      PDF/UA-1: {auditResult.standards.pdfUa1 ? 'Conformant' : 'Non-Conformant'}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                        auditResult.standards.wcag22
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      WCAG 2.2: {auditResult.standards.wcag22 ? 'Pass Level AA' : 'Issues Found'}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setAuditResult(null)}
                className="btn-forest-outline text-xs py-3 px-5"
              >
                Audit Another File
              </button>
            </div>

            {/* Severity Counters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block mb-1">
                  Passed Rules
                </span>
                <div className="text-2xl font-black text-slate-900">{auditResult.summaryCounts.passed}</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 block mb-1">
                  Warnings
                </span>
                <div className="text-2xl font-black text-slate-900">{auditResult.summaryCounts.warnings}</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 block mb-1">
                  Errors
                </span>
                <div className="text-2xl font-black text-slate-900">{auditResult.summaryCounts.errors}</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 block mb-1">
                  Critical
                </span>
                <div className="text-2xl font-black text-slate-900">{auditResult.summaryCounts.critical}</div>
              </div>
            </div>

            {/* Detailed Rule Matrix */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 mb-4 pb-2 border-b border-slate-100">
                Compliance Findings & Guidance
              </h3>

              <div className="space-y-3">
                {auditResult.checks.map((rule) => (
                  <div
                    key={rule.ruleId}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-start justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {rule.severity === 'pass' && <i className="bi bi-check-circle-fill text-emerald-500 text-lg"></i>}
                        {rule.severity === 'warning' && <i className="bi bi-exclamation-triangle-fill text-amber-500 text-lg"></i>}
                        {rule.severity === 'error' && <i className="bi bi-x-circle-fill text-rose-500 text-lg"></i>}
                        {rule.severity === 'critical' && <i className="bi bi-slash-circle-fill text-purple-600 text-lg"></i>}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{rule.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">[{rule.ruleId}]</span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1">{rule.description}</p>
                        {rule.guidance && (
                          <div className="text-[11px] text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-lg mt-2 font-medium">
                            📘 Remediation Guide: {rule.guidance}
                          </div>
                        )}
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full self-start ${
                        rule.severity === 'pass'
                          ? 'bg-emerald-100 text-emerald-800'
                          : rule.severity === 'warning'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {rule.severity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Legal Disclaimer Box */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
              <i className="bi bi-info-circle-fill mr-1.5 text-amber-700"></i>
              <strong>Statutory Compliance Disclaimer:</strong> {auditResult.disclaimer}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
