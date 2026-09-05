import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import toast from 'react-hot-toast';
import { DIU_HEADER_LOGO } from '../../assets/diu_header_logo_base64';
import { DIU_CREST_LOGO } from '../../assets/diu_crest_logo_base64';

// Exact demo test data specified in user prompt Section 21
const DEMO_DATA = {
  documentType: 'ASSIGNMENT',
  customDocumentType: '',
  institution: 'Daffodil International University',
  headerLogo: DIU_HEADER_LOGO,
  watermarkLogo: DIU_CREST_LOGO,
  showWatermark: true,
  watermarkOpacity: 0.16,

  // Course Details
  courseCode: 'CSE222',
  courseTitle: 'Object Oriented Programming Lab',
  topicName: 'Inheritance',

  // Instructor Details (Submitted To)
  teacherName: 'Dr. Md. Ismail Jabiullah',
  teacherDesignation: 'Lecturer',
  teacherDepartment: 'Department of CSE',
  teacherInstitution: 'Daffodil International University',

  // Submission Mode: 'single' | 'group'
  submissionMode: 'single',

  // Single Student Details (Submitted By)
  studentName: 'Sajjad Hossain Siam',
  studentId: '251-15-693',
  section: '68_M',
  semester: 'Summer 26',
  studentDepartment: 'Department of CSE',
  studentInstitution: 'Daffodil International University',

  // Group Members Details
  groupMembers: [
    { name: 'Sajjad Hossain Siam', id: '251-15-693', section: '68_M' },
    { name: 'Md. Rakibul Islam', id: '251-15-694', section: '68_M' },
    { name: 'Tanvir Ahmed', id: '251-15-695', section: '68_M' },
  ],

  // Submission Info
  submissionDate: '05/09/2026',
  footerText: 'www.diucoverpage.com',
};

const DOCUMENT_TYPES = [
  'ASSIGNMENT',
  'LAB REPORT',
  'PROJECT REPORT',
  'TERM PAPER',
  'THESIS REPORT',
  'CASE STUDY',
  'INTERNSHIP REPORT',
  'CUSTOM',
];

const TEACHER_DESIGNATIONS = [
  'Professor',
  'Associate Professor',
  'Assistant Professor',
  'Senior Lecturer',
  'Lecturer',
  'Adjunct Faculty',
  'Head of the Department',
];

export default function CoverPageGenerator() {
  const [formData, setFormData] = useState(DEMO_DATA);
  const [zoomScale, setZoomScale] = useState(0.85);
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState('');
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'preview'
  const [isFullScreen, setIsFullScreen] = useState(false);

  const coverPageRef = useRef(null);
  const viewportRef = useRef(null);

  // Auto-calculate optimal fit zoom scale for current screen on mount
  useEffect(() => {
    const updateFitZoom = () => {
      if (!viewportRef.current) return;
      const containerWidth = viewportRef.current.clientWidth - 48;
      if (containerWidth <= 0) return;
      // 210mm in standard 96 DPI CSS pixels is approx 794px
      const calculatedScale = Math.min(1.1, Math.max(0.45, containerWidth / 794));
      setZoomScale(parseFloat(calculatedScale.toFixed(2)));
    };

    updateFitZoom();
    window.addEventListener('resize', updateFitZoom);
    return () => window.removeEventListener('resize', updateFitZoom);
  }, []);

  // Field updater
  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Group Member handlers
  const handleAddMember = () => {
    setFormData((prev) => ({
      ...prev,
      groupMembers: [...prev.groupMembers, { name: '', id: '', section: prev.section || '' }],
    }));
  };

  const handleUpdateMember = (index, field, value) => {
    const updated = [...formData.groupMembers];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, groupMembers: updated }));
  };

  const handleRemoveMember = (index) => {
    if (formData.groupMembers.length <= 1) {
      toast.error('Group must have at least one member.');
      return;
    }
    const updated = formData.groupMembers.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, groupMembers: updated }));
  };

  // Reset form to blank
  const handleResetForm = () => {
    setFormData({
      ...DEMO_DATA,
      courseCode: '',
      courseTitle: '',
      topicName: '',
      teacherName: '',
      teacherDesignation: 'Lecturer',
      studentName: '',
      studentId: '',
      section: '',
      semester: '',
      groupMembers: [{ name: '', id: '', section: '' }],
    });
    toast.success('Form cleared.');
  };

  // Fill sample demo data
  const handleFillDemo = () => {
    setFormData(DEMO_DATA);
    toast.success('Official DIU demo test data loaded.');
  };

  // Document title helper
  const displayDocumentTitle =
    formData.documentType === 'CUSTOM'
      ? (formData.customDocumentType || 'ASSIGNMENT').toUpperCase()
      : formData.documentType;

  // =========================================================================
  // SINGLE SOURCE OF TRUTH EXPORT PIPELINE
  // =========================================================================

  // Prepare page before taking snapshot: fonts, images, disable zoom & shadow
  const prepareForExport = async () => {
    // 1. Ensure all document fonts are fully loaded
    if (document.fonts) {
      await document.fonts.ready;
    }
    // Allow brief reflow stabilization
    await new Promise((resolve) => setTimeout(resolve, 300));

    // 2. Ensure all images inside the cover page are completely loaded
    const coverPage = coverPageRef.current;
    if (coverPage) {
      const images = coverPage.querySelectorAll('img');
      await Promise.all(
        [...images].map((img) => {
          if (img.complete && img.naturalHeight !== 0) return Promise.resolve();
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        })
      );
    }

    // 3. Temporarily apply export-mode class
    document.body.classList.add('export-mode');
    if (coverPage) {
      coverPage.classList.add('export-mode');
    }
  };

  // Restore preview to user interaction state
  const restoreAfterExport = () => {
    document.body.classList.remove('export-mode');
    if (coverPageRef.current) {
      coverPageRef.current.classList.remove('export-mode');
    }
  };

  // Shared single canvas generation function for PNG, JPG, and PDF
  const getExportCanvas = async () => {
    await prepareForExport();
    const coverPage = coverPageRef.current;
    if (!coverPage) throw new Error('Cover page DOM element not found');

    const canvas = await html2canvas(coverPage, {
      scale: 3, // 300 DPI high resolution
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#FFFFFF',
      logging: false,
      width: coverPage.offsetWidth,
      height: coverPage.offsetHeight,
      scrollX: 0,
      scrollY: 0,
      onclone: (clonedDoc) => {
        // Guarantee clean A4 dimensions and no ancestor transform in cloned render
        const clonedPage = clonedDoc.querySelector('.cover-page');
        if (clonedPage) {
          clonedPage.classList.add('export-mode');
          clonedPage.style.transform = 'none';
          clonedPage.style.boxShadow = 'none';
          clonedPage.style.margin = '0';
        }
        const clonedWrapper = clonedDoc.querySelector('.preview-scale-wrapper');
        if (clonedWrapper) {
          clonedWrapper.style.transform = 'none';
          clonedWrapper.style.margin = '0';
          clonedWrapper.style.padding = '0';
        }
      },
    });

    return canvas;
  };

  // 1. Export High-Res PNG
  const handleDownloadPng = async () => {
    setIsExporting(true);
    setExportType('png');
    const toastId = toast.loading('Rendering 300 DPI A4 PNG...');
    try {
      const canvas = await getExportCanvas();
      const imgUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgUrl;
      link.download = `${formData.courseCode || 'DIU'}_${formData.studentId || 'Cover'}.png`.replace(/\s+/g, '_');
      link.click();
      toast.success('High-resolution PNG downloaded!', { id: toastId });
    } catch (err) {
      console.error('PNG export failed:', err);
      toast.error('Failed to export PNG.', { id: toastId });
    } finally {
      restoreAfterExport();
      setIsExporting(false);
      setExportType('');
    }
  };

  // 2. Export High-Quality JPG (Uses exact same canvas)
  const handleDownloadJpg = async () => {
    setIsExporting(true);
    setExportType('jpg');
    const toastId = toast.loading('Rendering high-quality JPG...');
    try {
      const canvas = await getExportCanvas();
      const imgUrl = canvas.toDataURL('image/jpeg', 0.95);
      const link = document.createElement('a');
      link.href = imgUrl;
      link.download = `${formData.courseCode || 'DIU'}_${formData.studentId || 'Cover'}.jpg`.replace(/\s+/g, '_');
      link.click();
      toast.success('High-quality JPG downloaded!', { id: toastId });
    } catch (err) {
      console.error('JPG export failed:', err);
      toast.error('Failed to export JPG.', { id: toastId });
    } finally {
      restoreAfterExport();
      setIsExporting(false);
      setExportType('');
    }
  };

  // 3. Export True A4 PDF (Uses exact same canvas, inserted at 210mm x 297mm)
  const handleDownloadPdf = async () => {
    setIsExporting(true);
    setExportType('pdf');
    const toastId = toast.loading('Generating print-ready A4 PDF...');
    try {
      const canvas = await getExportCanvas();
      const imgData = canvas.toDataURL('image/png', 1.0);

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      // Insert full bleed at exact A4 dimensions (210mm x 297mm)
      pdf.addImage(imgData, 'PNG', 0, 0, 210, 297, undefined, 'FAST');

      const fileName = `${formData.courseCode || 'DIU'}_${formData.studentId || 'Cover'}_CoverPage.pdf`.replace(/\s+/g, '_');
      pdf.save(fileName);
      toast.success('A4 Cover Page PDF downloaded!', { id: toastId });
    } catch (err) {
      console.error('PDF export failed:', err);
      toast.error('Failed to generate PDF.', { id: toastId });
    } finally {
      restoreAfterExport();
      setIsExporting(false);
      setExportType('');
    }
  };

  // 4. Browser Print Document
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-forest-canvas pt-20 pb-20 selection:bg-blue-100 selection:text-blue-900">
      
      {/* Strict CSS Rules for Physical A4 Canvas, Export Mode, and Browser Print */}
      <style>{`
        /* Physical A4 Print Styling */
        @page {
          size: A4 portrait;
          margin: 0;
        }

        /* Fixed A4 dimensions for Single Source of Truth */
        .cover-page {
          width: 210mm;
          height: 297mm;
          min-width: 210mm;
          min-height: 297mm;
          max-width: 210mm;
          max-height: 297mm;
          position: relative;
          overflow: hidden;
          box-sizing: border-box;
          background-color: #FFFFFF;
        }

        /* Temporary Export Mode Styling */
        .export-mode .preview-scale-wrapper {
          transform: none !important;
          margin: 0 !important;
          padding: 0 !important;
        }

        .export-mode.cover-page,
        .export-mode .cover-page {
          width: 210mm !important;
          height: 297mm !important;
          min-width: 210mm !important;
          min-height: 297mm !important;
          max-width: 210mm !important;
          max-height: 297mm !important;
          transform: none !important;
          box-shadow: none !important;
          margin: 0 !important;
        }

        /* Browser Print Target */
        @media print {
          body * {
            visibility: hidden !important;
          }
          .cover-page, .cover-page * {
            visibility: visible !important;
          }
          .cover-page {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 210mm !important;
            height: 297mm !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            z-index: 999999 !important;
            page-break-after: avoid !important;
            page-break-inside: avoid !important;
          }
        }
      `}</style>

      {/* Main Container */}
      <div className="section-container max-w-[1400px]">
        
        {/* Top Header & Actions Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold uppercase tracking-wider mb-2">
              <i className="bi bi-mortarboard-fill text-blue-600"></i> Daffodil International University
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <span>DIU Cover Page Generator</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Official Replica
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Unified Single Source of Truth: Browser preview, PNG, JPG, PDF, and Print all render the exact same A4 document.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleFillDemo}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl shadow-xs transition-all"
              title="Load Demo Test Data"
            >
              <i className="bi bi-magic text-blue-600"></i>
              <span>Fill Demo Data</span>
            </button>

            <button
              type="button"
              onClick={handleResetForm}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl shadow-xs transition-all"
              title="Reset Form to Blank"
            >
              <i className="bi bi-arrow-counterclockwise"></i>
              <span>Clear</span>
            </button>

            <div className="h-5 w-px bg-slate-200 mx-1 hidden sm:block"></div>

            {/* Print Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl shadow-xs transition-all"
            >
              <i className="bi bi-printer text-slate-700"></i>
              <span>Print</span>
            </button>

            {/* PNG Download */}
            <button
              type="button"
              onClick={handleDownloadPng}
              disabled={isExporting}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl shadow-xs transition-all disabled:opacity-50"
            >
              <i className="bi bi-filetype-png text-emerald-600"></i>
              <span>PNG</span>
            </button>

            {/* JPG Download */}
            <button
              type="button"
              onClick={handleDownloadJpg}
              disabled={isExporting}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl shadow-xs transition-all disabled:opacity-50"
            >
              <i className="bi bi-filetype-jpg text-amber-600"></i>
              <span>JPG</span>
            </button>

            {/* Primary PDF Download */}
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isExporting}
              className="inline-flex items-center gap-2 text-xs font-bold text-white bg-[#0B4F8A] hover:bg-[#093e6d] px-4 py-2.5 rounded-xl shadow-md shadow-blue-900/20 transition-all disabled:opacity-50"
            >
              {isExporting && exportType === 'pdf' ? (
                <>
                  <i className="bi bi-arrow-repeat animate-spin"></i>
                  <span>Compiling PDF...</span>
                </>
              ) : (
                <>
                  <i className="bi bi-file-earmark-pdf-fill text-amber-300"></i>
                  <span>Download PDF</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mobile View Toggle */}
        <div className="flex lg:hidden items-center justify-center p-1 bg-slate-200/70 rounded-2xl mb-6 max-w-xs mx-auto">
          <button
            type="button"
            onClick={() => setActiveTab('editor')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'editor' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            <i className="bi bi-pencil-square mr-1"></i> Edit Form
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'preview' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            <i className="bi bi-eye mr-1"></i> Live Preview
          </button>
        </div>

        {/* Two-Column Workbench */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* =========================================================================
              LEFT COLUMN: FORM CONTROLS (Col Span 5)
              ========================================================================= */}
          <div className={`lg:col-span-5 space-y-5 ${activeTab === 'preview' ? 'hidden lg:block' : 'block'}`}>
            
            {/* 1. Document Format & Mode */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <i className="bi bi-file-earmark-text text-blue-600"></i> Document Configuration
                </span>
                <span className="text-[10px] font-bold text-slate-400">A4 Portrait Format</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Student Format
                  </label>
                  <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl">
                    <button
                      type="button"
                      onClick={() => updateField('submissionMode', 'single')}
                      className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                        formData.submissionMode === 'single'
                          ? 'bg-white text-blue-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Single
                    </button>
                    <button
                      type="button"
                      onClick={() => updateField('submissionMode', 'group')}
                      className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                        formData.submissionMode === 'group'
                          ? 'bg-white text-blue-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Group
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Document Type
                  </label>
                  <select
                    value={formData.documentType}
                    onChange={(e) => updateField('documentType', e.target.value)}
                    className="spark-input text-xs font-bold text-slate-800"
                  >
                    {DOCUMENT_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {formData.documentType === 'CUSTOM' && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Custom Title
                  </label>
                  <input
                    type="text"
                    value={formData.customDocumentType}
                    onChange={(e) => updateField('customDocumentType', e.target.value)}
                    placeholder="e.g. CAPSTONE PROJECT REPORT"
                    className="spark-input text-xs font-semibold"
                  />
                </div>
              )}

              {/* Watermark Controls */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.showWatermark}
                    onChange={(e) => updateField('showWatermark', e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                  />
                  <span className="text-xs font-bold text-slate-700">DIU Crest Watermark</span>
                </label>

                {formData.showWatermark && (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold text-slate-400">Opacity:</span>
                    <input
                      type="range"
                      min="0.05"
                      max="0.35"
                      step="0.01"
                      value={formData.watermarkOpacity}
                      onChange={(e) => updateField('watermarkOpacity', parseFloat(e.target.value))}
                      className="w-20 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <span className="text-[10px] font-bold text-slate-600 w-6">
                      {Math.round(formData.watermarkOpacity * 100)}%
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Course Details */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <i className="bi bi-journal-code text-blue-600"></i> Course Details
                </span>
                <span className="text-[10px] text-blue-600 font-semibold">Exact Labels</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Course Code</label>
                  <input
                    type="text"
                    value={formData.courseCode}
                    onChange={(e) => updateField('courseCode', e.target.value)}
                    placeholder="e.g. CSE222"
                    className="spark-input text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Course Title</label>
                  <input
                    type="text"
                    value={formData.courseTitle}
                    onChange={(e) => updateField('courseTitle', e.target.value)}
                    placeholder="e.g. Object Oriented Programming Lab"
                    className="spark-input text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Topic Name / Title</label>
                <input
                  type="text"
                  value={formData.topicName}
                  onChange={(e) => updateField('topicName', e.target.value)}
                  placeholder="e.g. Inheritance"
                  className="spark-input text-xs font-medium"
                />
              </div>
            </div>

            {/* 3. Instructor Details (Submitted To) */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <i className="bi bi-person-badge-fill text-blue-600"></i> Submitted To (Instructor)
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Faculty Member</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Teacher Name</label>
                  <input
                    type="text"
                    value={formData.teacherName}
                    onChange={(e) => updateField('teacherName', e.target.value)}
                    placeholder="e.g. Dr. Md. Ismail Jabiullah"
                    className="spark-input text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Designation</label>
                  <input
                    type="text"
                    value={formData.teacherDesignation}
                    onChange={(e) => updateField('teacherDesignation', e.target.value)}
                    placeholder="e.g. Lecturer"
                    className="spark-input text-xs font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={formData.teacherDepartment}
                    onChange={(e) => updateField('teacherDepartment', e.target.value)}
                    placeholder="e.g. Department of CSE"
                    className="spark-input text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">University</label>
                  <input
                    type="text"
                    value={formData.teacherInstitution}
                    onChange={(e) => updateField('teacherInstitution', e.target.value)}
                    placeholder="Daffodil International University"
                    className="spark-input text-xs font-medium"
                  />
                </div>
              </div>
            </div>

            {/* 4. Student Details (Submitted By) */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <i className="bi bi-person-fill text-blue-600"></i> Submitted By (Student / Group)
                </span>
                <span className="text-[10px] font-bold text-blue-600">
                  {formData.submissionMode === 'single' ? 'Individual' : 'Team / Group'}
                </span>
              </div>

              {formData.submissionMode === 'single' ? (
                /* SINGLE STUDENT FORM */
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Student Name</label>
                      <input
                        type="text"
                        value={formData.studentName}
                        onChange={(e) => updateField('studentName', e.target.value)}
                        placeholder="e.g. Sajjad Hossain Siam"
                        className="spark-input text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Student ID</label>
                      <input
                        type="text"
                        value={formData.studentId}
                        onChange={(e) => updateField('studentId', e.target.value)}
                        placeholder="e.g. 251-15-693"
                        className="spark-input text-xs font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Section</label>
                      <input
                        type="text"
                        value={formData.section}
                        onChange={(e) => updateField('section', e.target.value)}
                        placeholder="e.g. 68_M"
                        className="spark-input text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Semester</label>
                      <input
                        type="text"
                        value={formData.semester}
                        onChange={(e) => updateField('semester', e.target.value)}
                        placeholder="e.g. Summer 26"
                        className="spark-input text-xs font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Department</label>
                      <input
                        type="text"
                        value={formData.studentDepartment}
                        onChange={(e) => updateField('studentDepartment', e.target.value)}
                        placeholder="Department of CSE"
                        className="spark-input text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">University</label>
                      <input
                        type="text"
                        value={formData.studentInstitution}
                        onChange={(e) => updateField('studentInstitution', e.target.value)}
                        placeholder="Daffodil International University"
                        className="spark-input text-xs font-medium"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* GROUP MEMBERS FORM */
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Section</label>
                      <input
                        type="text"
                        value={formData.section}
                        onChange={(e) => updateField('section', e.target.value)}
                        placeholder="e.g. 68_M"
                        className="spark-input text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Semester</label>
                      <input
                        type="text"
                        value={formData.semester}
                        onChange={(e) => updateField('semester', e.target.value)}
                        placeholder="e.g. Summer 26"
                        className="spark-input text-xs font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-700">Team Members</span>
                      <button
                        type="button"
                        onClick={handleAddMember}
                        className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <i className="bi bi-plus-circle-fill"></i> Add Member
                      </button>
                    </div>

                    {formData.groupMembers.map((member, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-[10px] font-bold text-slate-400 w-4 text-center">{idx + 1}</span>
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) => handleUpdateMember(idx, 'name', e.target.value)}
                          placeholder="Member Name"
                          className="spark-input text-xs flex-1 py-1 px-2.5"
                        />
                        <input
                          type="text"
                          value={member.id}
                          onChange={(e) => handleUpdateMember(idx, 'id', e.target.value)}
                          placeholder="ID (e.g. 251-15-693)"
                          className="spark-input text-xs w-28 py-1 px-2.5"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(idx)}
                          className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                          title="Remove Member"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 5. Submission Date & Footer */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <i className="bi bi-calendar-event text-blue-600"></i> Date & Footer
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Date of Submission
                  </label>
                  <input
                    type="text"
                    value={formData.submissionDate}
                    onChange={(e) => updateField('submissionDate', e.target.value)}
                    placeholder="05/09/2026"
                    className="spark-input text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Footer URL Reference
                  </label>
                  <input
                    type="text"
                    value={formData.footerText}
                    onChange={(e) => updateField('footerText', e.target.value)}
                    placeholder="www.diucoverpage.com"
                    className="spark-input text-xs font-medium"
                  />
                </div>
              </div>
            </div>

          </div>


          {/* =========================================================================
              RIGHT COLUMN: REAL-TIME PIXEL-PERFECT A4 LIVE PREVIEW (Col Span 7)
              ========================================================================= */}
          <div className={`lg:col-span-7 sticky top-24 ${activeTab === 'editor' ? 'hidden lg:block' : 'block'}`}>
            
            {/* Workbench Bar */}
            <div className="flex items-center justify-between bg-slate-900 text-white px-4 py-2.5 rounded-t-2xl border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  A4 Live Document
                </span>
                <span className="text-[10px] text-slate-400 hidden sm:inline">
                  (210mm × 297mm @ 300 DPI)
                </span>
              </div>

              {/* Zoom & View Controls */}
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  type="button"
                  onClick={() => setZoomScale((prev) => Math.max(0.45, parseFloat((prev - 0.05).toFixed(2))))}
                  className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center text-xs transition-all"
                  title="Zoom Out"
                >
                  <i className="bi bi-zoom-out"></i>
                </button>
                <span className="text-[11px] font-bold text-slate-300 w-10 text-center">
                  {Math.round(zoomScale * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoomScale((prev) => Math.min(1.3, parseFloat((prev + 0.05).toFixed(2))))}
                  className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center text-xs transition-all"
                  title="Zoom In"
                >
                  <i className="bi bi-zoom-in"></i>
                </button>
                <button
                  type="button"
                  onClick={() => setZoomScale(0.85)}
                  className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-300 transition-all ml-1"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setIsFullScreen(!isFullScreen)}
                  className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center text-xs transition-all ml-1"
                  title="Toggle Fullscreen Preview"
                >
                  <i className={`bi ${isFullScreen ? 'bi-fullscreen-exit' : 'bi-arrows-fullscreen'}`}></i>
                </button>
              </div>
            </div>

            {/* Scrollable Viewport Container */}
            <div
              ref={viewportRef}
              className={`preview-viewport bg-slate-800/85 rounded-b-2xl p-4 sm:p-8 flex justify-center items-start overflow-auto max-h-[calc(100vh-150px)] shadow-2xl ${
                isFullScreen ? 'fixed inset-0 z-50 rounded-none max-h-screen p-10 bg-black/95 backdrop-blur-md' : ''
              }`}
            >
              
              {isFullScreen && (
                <button
                  type="button"
                  onClick={() => setIsFullScreen(false)}
                  className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/20 hover:bg-white text-white hover:text-black flex items-center justify-center text-lg transition-all"
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              )}

              {/* Scale Wrapper (Screen preview scaling only; removed during export) */}
              <div
                className="preview-scale-wrapper"
                style={{
                  transform: `scale(${zoomScale})`,
                  transformOrigin: 'top center',
                  transition: 'transform 0.1s ease-out',
                  marginBottom: `${zoomScale < 1 ? '-20%' : '20px'}`,
                }}
              >
                {/* =========================================================================
                    SINGLE SOURCE OF TRUTH A4 DOCUMENT (.cover-page)
                    Strict 210mm x 297mm physical dimensions
                    Pixel-matched directly to media_1788586206409.jpg
                    ========================================================================= */}
                <div
                  ref={coverPageRef}
                  className="cover-page shadow-2xl text-black"
                  style={{
                    fontFamily: 'Arial, Helvetica, sans-serif',
                  }}
                >
                  
                  {/* INSET BLACK BORDER (Exact 10mm-12mm inset border from reference image) */}
                  <div
                    className="page-border"
                    style={{
                      position: 'absolute',
                      top: '11mm',
                      bottom: '11mm',
                      left: '13mm',
                      right: '13mm',
                      border: '1.2px solid #000000',
                      boxSizing: 'border-box',
                      padding: '11mm 15mm 9mm 15mm',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >

                    {/* WATERMARK EMBLEM (Centered behind middle content at subtle opacity) */}
                    {formData.showWatermark && (
                      <div
                        className="watermark"
                        style={{
                          position: 'absolute',
                          left: '50%',
                          top: '52%',
                          transform: 'translate(-50%, -50%)',
                          opacity: formData.watermarkOpacity,
                          pointerEvents: 'none',
                          zIndex: 0,
                        }}
                      >
                        <img
                          src={formData.watermarkLogo}
                          alt="DIU Crest Emblem"
                          style={{
                            width: '84mm',
                            height: 'auto',
                            objectFit: 'contain',
                            display: 'block',
                          }}
                        />
                      </div>
                    )}

                    {/* RELATIVE CONTENT CONTAINER TO SIT ABOVE WATERMARK */}
                    <div
                      style={{
                        position: 'relative',
                        zIndex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        height: '100%',
                      }}
                    >

                      {/* TOP SECTION: Header Logo + Title + Course Information */}
                      <div>
                        {/* 1. Official DIU Logo (Shield Emblem on Left, Typography on Right) */}
                        <div
                          className="cover-header"
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: '7mm',
                          }}
                        >
                          <img
                            src={formData.headerLogo}
                            alt="Daffodil International University"
                            style={{
                              width: '98mm',
                              height: 'auto',
                              maxHeight: '27mm',
                              objectFit: 'contain',
                              display: 'block',
                            }}
                          />
                        </div>

                        {/* 2. Centered Document Heading: "ASSIGNMENT" (Blue with Underline) */}
                        <div
                          className="document-title"
                          style={{
                            textAlign: 'center',
                            marginBottom: '7.5mm',
                          }}
                        >
                          <span
                            style={{
                              fontFamily: 'Arial, Helvetica, sans-serif',
                              fontWeight: 'bold',
                              textTransform: 'uppercase',
                              letterSpacing: '0.4px',
                              color: '#1B4F8B',
                              fontSize: '19pt',
                              borderBottom: '2.2px solid #1B4F8B',
                              paddingBottom: '1.5px',
                              display: 'inline-block',
                            }}
                          >
                            {displayDocumentTitle}
                          </span>
                        </div>

                        {/* 3. Course Information (Left-aligned, bold labels) */}
                        <div
                          className="course-info"
                          style={{
                            fontFamily: 'Arial, Helvetica, sans-serif',
                            fontSize: '14pt',
                            lineHeight: '1.45',
                            color: '#000000',
                            textAlign: 'left',
                          }}
                        >
                          <div style={{ marginBottom: '1.8mm' }}>
                            <span style={{ fontWeight: 'bold' }}>Course Code: </span>
                            <span style={{ fontWeight: 'normal' }}>{formData.courseCode || 'CSE222'}</span>
                          </div>
                          <div style={{ marginBottom: '1.8mm' }}>
                            <span style={{ fontWeight: 'bold' }}>Course Title: </span>
                            <span style={{ fontWeight: 'normal' }}>
                              {formData.courseTitle || 'Object Oriented Programming Lab'}
                            </span>
                          </div>
                          <div>
                            <span style={{ fontWeight: 'bold' }}>Topic Name: </span>
                            <span style={{ fontWeight: 'normal' }}>{formData.topicName || 'Inheritance'}</span>
                          </div>
                        </div>
                      </div>

                      {/* MIDDLE SECTION: "Submitted To" & "Submitted By" */}
                      <div
                        style={{
                          marginTop: 'auto',
                          marginBottom: 'auto',
                          paddingTop: '2mm',
                          paddingBottom: '2mm',
                        }}
                      >
                        
                        {/* 4. "Submitted To" Section */}
                        <div style={{ marginBottom: '8mm' }}>
                          {/* Centered Heading with blue underline */}
                          <div style={{ textAlign: 'center', marginBottom: '3.5mm' }}>
                            <span
                              style={{
                                fontFamily: 'Arial, Helvetica, sans-serif',
                                fontWeight: 'bold',
                                color: '#1B4F8B',
                                fontSize: '17pt',
                                borderBottom: '2.2px solid #1B4F8B',
                                paddingBottom: '1.5px',
                                display: 'inline-block',
                              }}
                            >
                              Submitted To
                            </span>
                          </div>

                          {/* Left-aligned Instructor Details */}
                          <div
                            style={{
                              fontFamily: 'Arial, Helvetica, sans-serif',
                              fontSize: '13.5pt',
                              lineHeight: '1.38',
                              color: '#000000',
                              textAlign: 'left',
                            }}
                          >
                            <div style={{ marginBottom: '1.2mm' }}>
                              <span style={{ fontWeight: 'bold' }}>Name: </span>
                              <span style={{ fontWeight: 'normal' }}>
                                {formData.teacherName || 'Dr. Md. Ismail Jabiullah'}
                              </span>
                            </div>
                            <div style={{ marginBottom: '1.2mm' }}>
                              <span style={{ fontWeight: 'bold' }}>Designation: </span>
                              <span style={{ fontWeight: 'normal' }}>
                                {formData.teacherDesignation || 'Lecturer'}
                              </span>
                            </div>
                            <div style={{ fontWeight: 'bold', marginBottom: '1.2mm' }}>
                              {formData.teacherDepartment || 'Department of CSE'}
                            </div>
                            <div style={{ fontWeight: 'bold' }}>
                              {formData.teacherInstitution || 'Daffodil International University'}
                            </div>
                          </div>
                        </div>

                        {/* 5. "Submitted By" Section */}
                        <div>
                          {/* Centered Heading with blue underline */}
                          <div style={{ textAlign: 'center', marginBottom: '3.5mm' }}>
                            <span
                              style={{
                                fontFamily: 'Arial, Helvetica, sans-serif',
                                fontWeight: 'bold',
                                color: '#1B4F8B',
                                fontSize: '17pt',
                                borderBottom: '2.2px solid #1B4F8B',
                                paddingBottom: '1.5px',
                                display: 'inline-block',
                              }}
                            >
                              Submitted By
                            </span>
                          </div>

                          {/* Details based on mode: Single or Group */}
                          {formData.submissionMode === 'single' ? (
                            /* SINGLE STUDENT: Left-aligned details matching reference */
                            <div
                              style={{
                                fontFamily: 'Arial, Helvetica, sans-serif',
                                fontSize: '13.5pt',
                                lineHeight: '1.38',
                                color: '#000000',
                                textAlign: 'left',
                              }}
                            >
                              <div style={{ marginBottom: '1.2mm' }}>
                                <span style={{ fontWeight: 'bold' }}>Name: </span>
                                <span style={{ fontWeight: 'normal' }}>
                                  {formData.studentName || 'Sajjad Hossain Siam'}
                                </span>
                              </div>
                              <div style={{ marginBottom: '1.2mm' }}>
                                <span style={{ fontWeight: 'bold' }}>ID: </span>
                                <span style={{ fontWeight: 'normal' }}>
                                  {formData.studentId || '251-15-693'}
                                </span>
                              </div>
                              <div style={{ marginBottom: '1.2mm' }}>
                                <span style={{ fontWeight: 'bold' }}>Section: </span>
                                <span style={{ fontWeight: 'normal' }}>
                                  {formData.section || '68_M'}
                                </span>
                              </div>
                              <div style={{ marginBottom: '1.2mm' }}>
                                <span style={{ fontWeight: 'bold' }}>Semester: </span>
                                <span style={{ fontWeight: 'normal' }}>
                                  {formData.semester || 'Summer 26'}
                                </span>
                              </div>
                              <div style={{ fontWeight: 'bold', marginBottom: '1.2mm' }}>
                                {formData.studentDepartment || 'Department of CSE'}
                              </div>
                              <div style={{ fontWeight: 'bold' }}>
                                {formData.studentInstitution || 'Daffodil International University'}
                              </div>
                            </div>
                          ) : (
                            /* GROUP MEMBERS: Clean tabular format */
                            <div
                              style={{
                                fontFamily: 'Arial, Helvetica, sans-serif',
                                fontSize: '12pt',
                                lineHeight: '1.35',
                                color: '#000000',
                                textAlign: 'left',
                              }}
                            >
                              <div style={{ marginBottom: '2mm' }}>
                                <span style={{ fontWeight: 'bold' }}>Section: </span>
                                <span>{formData.section || '68_M'}</span>
                                <span style={{ fontWeight: 'bold', marginLeft: '5mm' }}>Semester: </span>
                                <span>{formData.semester || 'Summer 26'}</span>
                              </div>

                              <div style={{ border: '1px solid #000000', borderRadius: '3px', overflow: 'hidden', margin: '2mm 0' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10pt' }}>
                                  <thead style={{ backgroundColor: '#F1F5F9', borderBottom: '1px solid #000000' }}>
                                    <tr>
                                      <th style={{ padding: '3px 8px', borderRight: '1px solid #000000', width: '28px', textAlign: 'center' }}>SL</th>
                                      <th style={{ padding: '3px 8px', borderRight: '1px solid #000000', textAlign: 'left' }}>Student Name</th>
                                      <th style={{ padding: '3px 8px', textAlign: 'left' }}>Student ID</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {formData.groupMembers.map((member, i) => (
                                      <tr key={i} style={{ borderBottom: i === formData.groupMembers.length - 1 ? 'none' : '1px solid #CBD5E1' }}>
                                        <td style={{ padding: '3px 8px', borderRight: '1px solid #000000', textAlign: 'center', fontWeight: 'bold' }}>{i + 1}</td>
                                        <td style={{ padding: '3px 8px', borderRight: '1px solid #000000' }}>{member.name || `Member ${i + 1}`}</td>
                                        <td style={{ padding: '3px 8px' }}>{member.id || '---'}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>

                              <div style={{ fontWeight: 'bold', marginTop: '2mm' }}>
                                {formData.studentDepartment || 'Department of CSE'}
                              </div>
                              <div style={{ fontWeight: 'bold' }}>
                                {formData.studentInstitution || 'Daffodil International University'}
                              </div>
                            </div>
                          )}
                        </div>

                      </div>

                      {/* BOTTOM SECTION: Date of Submission Pill Container */}
                      <div
                        className="date-pill-section"
                        style={{
                          textAlign: 'center',
                          paddingTop: '2mm',
                          paddingBottom: '1mm',
                        }}
                      >
                        <div
                          style={{
                            display: 'inline-block',
                            border: '1.5px solid #1B4F8B',
                            borderRadius: '9999px',
                            padding: '2.5mm 9mm',
                            color: '#1B4F8B',
                            fontSize: '13.5pt',
                            fontWeight: 'bold',
                            letterSpacing: '0.2px',
                            fontFamily: 'Arial, Helvetica, sans-serif',
                          }}
                        >
                          <span>Date of Submission: </span>
                          <span>{formData.submissionDate || '05/09/2026'}</span>
                        </div>
                      </div>

                    </div>

                  </div>

                  {/* 6. Centered Footer Website URL (Outside the black border at bottom) */}
                  <div
                    className="footer-website"
                    style={{
                      position: 'absolute',
                      bottom: '3.2mm',
                      left: 0,
                      right: 0,
                      textAlign: 'center',
                      fontSize: '9.5pt',
                      color: '#475569',
                      fontFamily: 'Arial, Helvetica, sans-serif',
                      letterSpacing: '0.3px',
                    }}
                  >
                    {formData.footerText || 'www.diucoverpage.com'}
                  </div>

                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
