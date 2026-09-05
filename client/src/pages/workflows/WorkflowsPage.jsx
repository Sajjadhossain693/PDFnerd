import { useState } from 'react';
import { Link } from 'react-router-dom';
import { WORKFLOW_PRESETS } from '../../data/workflows';
import FileUploader from '../../components/ui/FileUploader';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { useWorkspace } from '../../context/WorkspaceContext';

export default function WorkflowsPage() {
  const { setWorkingDocument } = useWorkspace();
  const [selectedWorkflow, setSelectedWorkflow] = useState(WORKFLOW_PRESETS[0]);
  const [file, setFile] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [workflowResult, setWorkflowResult] = useState(null);

  const handleFileAccepted = (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setWorkflowResult(null);
    }
  };

  const handleExecute = async () => {
    if (!file) {
      toast.error('Please upload a PDF document to run through the workflow pipeline.');
      return;
    }

    setIsExecuting(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('workflowSlug', selectedWorkflow.slug);

    try {
      const res = await api.post('/workflows/execute', formData);
      if (res.data.success) {
        setWorkflowResult(res.data);
        setWorkingDocument({
          name: res.data.result.finalFile,
          downloadUrl: res.data.downloadUrl,
          lastOperation: selectedWorkflow.name,
        });
        toast.success(`Workflow "${selectedWorkflow.name}" executed successfully!`);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Workflow execution encountered an error.');
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="min-h-screen bg-forest-canvas pt-24 pb-20">
      <div className="section-container max-w-5xl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold uppercase tracking-wider mb-2">
              <i className="bi bi-diagram-3-fill"></i> Automated Multi-Step Pipelines
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              One-Click Workflows
            </h1>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl">
              Execute complex multi-tool sequences in a single automated flow. Chain pagination, compression, privacy cleansing, and health diagnostics without intermediate downloads.
            </p>
          </div>
        </div>

        {/* Workflow Pipeline Selector Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {WORKFLOW_PRESETS.map((wf) => {
            const isSelected = selectedWorkflow.slug === wf.slug;
            return (
              <div
                key={wf.slug}
                onClick={() => {
                  setSelectedWorkflow(wf);
                  setWorkflowResult(null);
                }}
                className={`p-5 rounded-3xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-slate-900 bg-white shadow-md ring-2 ring-slate-900/5'
                    : 'border-slate-200 bg-white/70 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-base">
                      <i className={`bi ${wf.icon}`}></i>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {wf.badge}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mb-1">{wf.name}</h3>
                  <div className="text-[10px] font-bold text-blue-600 mb-2">{wf.tagline}</div>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">{wf.description}</p>
                </div>

                {/* Pipeline Step Badges */}
                <div className="space-y-1.5 pt-3 border-t border-slate-100">
                  {wf.steps.map((step, sIdx) => (
                    <div key={sIdx} className="flex items-center gap-2 text-[11px] text-slate-700">
                      <i className={`bi ${step.icon} text-slate-400 text-xs`}></i>
                      <span className="font-semibold">{step.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Upload & Execute Section */}
        {!workflowResult && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Target Pipeline:</span>
              <h3 className="text-lg font-black text-slate-900">{selectedWorkflow.name}</h3>
            </div>

            <FileUploader
              onFilesAccepted={handleFileAccepted}
              accept={{ 'application/pdf': ['.pdf'] }}
              multiple={false}
              title={`Upload Document for ${selectedWorkflow.name}`}
              description="Pipeline will automatically chain each operation in sequence"
            />

            {file && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
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
                  onClick={handleExecute}
                  disabled={isExecuting}
                  className="btn-lime text-xs uppercase tracking-wider py-3.5 px-8 shadow-sm w-full sm:w-auto"
                >
                  {isExecuting ? (
                    <>
                      <i className="bi bi-arrow-repeat animate-spin"></i> Chaining Pipeline Steps...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-play-fill"></i> Execute Workflow Pipeline
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Workflow Results Display */}
        {workflowResult && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-3xl mx-auto shadow-md">
              <i className="bi bi-check2-all"></i>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                Pipeline Completed
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-2">
                All {workflowResult.result.totalSteps} Steps Executed Successfully
              </h2>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Processed via "{workflowResult.result.workflowName}". Your unified compiled output is ready for download.
              </p>
            </div>

            {/* Step-by-Step Progress Timeline */}
            <div className="max-w-md mx-auto text-left space-y-2.5">
              {workflowResult.result.stepResults.map((step) => (
                <div
                  key={step.stepIndex}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <i className="bi bi-check-circle-fill text-emerald-600 text-base"></i>
                    <div>
                      <span className="font-bold text-slate-900 block">{step.name}</span>
                      <span className="text-[10px] text-slate-400">Duration: {step.durationMs}ms</span>
                    </div>
                  </div>

                  {step.savedPercent && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      ↓ {step.savedPercent}
                    </span>
                  )}
                  {step.healthScore && (
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                      Score: {step.healthScore}/100
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Download Output */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <a
                href={workflowResult.downloadUrl}
                download={workflowResult.result.finalFile}
                className="btn-lime text-xs uppercase tracking-wider py-3.5 px-8 shadow-sm w-full sm:w-auto"
              >
                <i className="bi bi-download"></i> Download Final Output
              </a>

              <button
                type="button"
                onClick={() => setWorkflowResult(null)}
                className="btn-forest-outline text-xs py-3.5 px-6 w-full sm:w-auto"
              >
                Run Another Document
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
