import { useState } from 'react';
import { Link } from 'react-router-dom';
import FileUploader from '../../components/ui/FileUploader';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { useWorkspace } from '../../context/WorkspaceContext';

export default function PdfDoctorPage() {
  const { setWorkingDocument } = useWorkspace();
  const [file, setFile] = useState(null);
  const [isHealing, setIsHealing] = useState(false);
  const [healResult, setHealResult] = useState(null);

  const [selectedFixes, setSelectedFixes] = useState({
    'fix-metadata': true,
    'normalize-rotation': true,
    'optimize-streams': true,
    'add-page-numbers': false,
    'remove-blank-pages': false,
  });

  const handleFileAccepted = (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setHealResult(null);
    }
  };

  const toggleFix = (id) => {
    setSelectedFixes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleExecuteDoctor = async () => {
    if (!file) {
      toast.error('Please upload a PDF file first.');
      return;
    }

    const enabledList = Object.keys(selectedFixes).filter((k) => selectedFixes[k]);
    if (enabledList.length === 0) {
      toast.error('Please select at least one treatment fix to apply.');
      return;
    }

    setIsHealing(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('selectedFixes', JSON.stringify(enabledList));

    try {
      const res = await api.post('/health-check/doctor-heal', formData);
      if (res.data.success) {
        setHealResult(res.data);
        setWorkingDocument({
          name: res.data.filename,
          downloadUrl: res.data.downloadUrl,
          lastOperation: 'Smart PDF Doctor',
          healthScore: res.data.afterScore,
        });
        toast.success(`PDF successfully healed! Score improved ${res.data.scoreImprovement}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Doctor treatment failed.');
    } finally {
      setIsHealing(false);
    }
  };

  return (
    <div className="min-h-screen bg-forest-canvas pt-24 pb-20">
      <div className="section-container max-w-4xl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
              <i className="bi bi-bandaid-fill"></i> Automated Remediation Engine
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Smart PDF Doctor
            </h1>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl">
              Diagnose and heal structural defects, normalize orientation, inject missing properties, and optimize internal stream dictionaries with verifiable before-and-after benchmarks.
            </p>
          </div>

          <Link
            to="/health"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl shadow-xs transition-all w-fit"
          >
            <i className="bi bi-heart-pulse"></i>
            <span>Health Diagnostics</span>
          </Link>
        </div>

        {/* Upload State & Treatments Selection */}
        {!healResult && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
              <FileUploader
                onFilesAccepted={handleFileAccepted}
                accept={{ 'application/pdf': ['.pdf'] }}
                multiple={false}
                title="Select or Drop PDF for Doctor Surgery"
                description="Fix orientation, repair metadata, and reconstruct object tables"
              />
            </div>

            {file && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                    Select Automated Treatments
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    PDFinity only executes deterministic, non-destructive repairs.
                  </p>
                </div>

                <div className="space-y-2.5">
                  {[
                    {
                      id: 'fix-metadata',
                      title: 'Inject Standardized Academic Metadata',
                      desc: 'Adds valid Dublin Core Title, Author, and Subject descriptors',
                      impact: '+8 Pts',
                    },
                    {
                      id: 'normalize-rotation',
                      title: 'Normalize Page Orientation (0°)',
                      desc: 'Straightens upside-down or inverted pages to upright portrait view',
                      impact: '+5 Pts',
                    },
                    {
                      id: 'optimize-streams',
                      title: 'Recompress Streams & Rebuild XRefs',
                      desc: 'Flattens duplicate cross-references and compresses object trees',
                      impact: '+6 Pts',
                    },
                    {
                      id: 'add-page-numbers',
                      title: 'Sequential Pagination Stamping',
                      desc: 'Inserts clean bottom-center page numbers across all pages',
                      impact: '+4 Pts',
                    },
                    {
                      id: 'remove-blank-pages',
                      title: 'Prune Trailing Empty Blank Pages',
                      desc: 'Scans and removes inadvertent trailing blank sheets',
                      impact: '+3 Pts',
                    },
                  ].map((fix) => (
                    <div
                      key={fix.id}
                      onClick={() => toggleFix(fix.id)}
                      className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                        selectedFixes[fix.id]
                          ? 'border-emerald-600 bg-emerald-50/40 text-slate-900 shadow-xs'
                          : 'border-slate-200 bg-slate-50/50 text-slate-400'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <i
                          className={`bi text-base mt-0.5 ${
                            selectedFixes[fix.id] ? 'bi-check-square-fill text-emerald-600' : 'bi-square text-slate-300'
                          }`}
                        ></i>
                        <div>
                          <div className="text-xs font-bold text-slate-900">{fix.title}</div>
                          <div className="text-[11px] text-slate-500">{fix.desc}</div>
                        </div>
                      </div>

                      <span className="text-[11px] font-black text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-md">
                        {fix.impact}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleExecuteDoctor}
                    disabled={isHealing}
                    className="btn-lime w-full text-xs uppercase tracking-wider py-4 shadow-sm"
                  >
                    {isHealing ? (
                      <>
                        <i className="bi bi-arrow-repeat animate-spin"></i> Treating Document...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-capsule-pill"></i> Execute Doctor Treatment
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Healed Result: Before / After Comparison */}
        {healResult && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs text-center space-y-8">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-3xl mx-auto shadow-md">
              <i className="bi bi-check2"></i>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                Treatment Successful
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-2">Document Restored & Optimized</h2>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                PDFinity Doctor executed non-destructive repairs. Inspect the before-and-after diagnostic comparison below:
              </p>
            </div>

            {/* Before vs After Score Box */}
            <div className="grid grid-cols-2 max-w-md mx-auto gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="p-3 rounded-xl bg-white border border-slate-200">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Initial Score</div>
                <div className="text-2xl font-black text-slate-500">{healResult.beforeScore}</div>
              </div>
              <div className="p-3 rounded-xl bg-white border border-emerald-300">
                <div className="text-[10px] font-bold text-emerald-700 uppercase">Healed Score</div>
                <div className="text-2xl font-black text-emerald-600 flex items-center justify-center gap-1">
                  <span>{healResult.afterScore}</span>
                  <span className="text-xs font-bold text-emerald-500">({healResult.scoreImprovement})</span>
                </div>
              </div>
            </div>

            {/* Fixes Applied List */}
            <div className="text-left max-w-md mx-auto space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-700">Treatments Executed:</div>
              {healResult.fixesApplied.map((f, i) => (
                <div key={i} className="text-xs text-slate-600 flex items-center gap-2">
                  <i className="bi bi-check-circle-fill text-emerald-500"></i>
                  <span>{f}</span>
                </div>
              ))}
            </div>

            {/* Download & Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <a
                href={healResult.downloadUrl}
                download={healResult.filename}
                className="btn-lime text-xs uppercase tracking-wider py-3.5 px-8 shadow-sm w-full sm:w-auto"
              >
                <i className="bi bi-download"></i> Download Healed PDF
              </a>
              <button
                type="button"
                onClick={() => setHealResult(null)}
                className="btn-forest-outline text-xs py-3.5 px-6 w-full sm:w-auto"
              >
                Treat Another Document
              </button>
            </div>

            <p className="text-[11px] text-slate-400 max-w-md mx-auto italic">
              Disclaimer: Automated fixes address verifiable structural properties and typography streams. No guarantee is made for content semantic errors.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
