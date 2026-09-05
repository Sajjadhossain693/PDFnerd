import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { UNIVERSITIES_DATABASE } from '../../data/universities';
import { ACADEMIC_TEMPLATES } from '../../data/academicTemplates';
import { DIU_CREST_LOGO } from '../../assets/diu_crest_logo_base64';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { useWorkspace } from '../../context/WorkspaceContext';

export default function AcademicStudio() {
  const { setWorkingDocument } = useWorkspace();
  const [activeTab, setActiveTab] = useState('builder'); // 'builder' | 'profiles'

  // Form State for Assignment Cover
  const [selectedUniversity, setSelectedUniversity] = useState('DIU');
  const [selectedTemplate, setSelectedTemplate] = useState('diu-official');

  const [courseInfo, setCourseInfo] = useState({
    courseTitle: 'Distributed Systems & Cloud Computing',
    courseCode: 'CSE 412',
    assignmentTopic: 'Architectural Analysis of Resilient Microservices and Event-Driven Pipelines',
    assignmentType: 'Term Paper',
  });

  const [instructorInfo, setInstructorInfo] = useState({
    teacherName: 'Prof. Dr. Syed Akhter Hossain',
    designation: 'Professor and Dean',
    department: 'Department of Computer Science and Engineering',
    institution: 'Daffodil International University',
  });

  const [studentInfo, setStudentInfo] = useState({
    studentName: 'Alex M. Turner',
    studentId: '211-15-4098',
    section: '60_A',
    semester: 'Spring 2026',
    department: 'Department of Computer Science and Engineering',
    institution: 'Daffodil International University',
  });

  const [submissionInfo, setSubmissionInfo] = useState({
    submissionDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  });

  // Document Builder Sections toggles
  const [docSections, setDocSections] = useState({
    cover: true,
    declaration: true,
    acknowledgement: true,
    certificate: true,
    toc: true,
    references: true,
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [generatedFilename, setGeneratedFilename] = useState('');
  const previewRef = useRef(null);

  // Handle University Profile Selection
  const handleUniversityChange = (code) => {
    setSelectedUniversity(code);
    const uni = UNIVERSITIES_DATABASE.find((u) => u.code === code);
    if (!uni) return;

    setInstructorInfo((prev) => ({
      ...prev,
      teacherName: uni.defaultTeacher || prev.teacherName,
      designation: uni.defaultDesignation || prev.designation,
      department: uni.departments[0]?.name || prev.department,
      institution: uni.name,
    }));

    setStudentInfo((prev) => ({
      ...prev,
      department: uni.departments[0]?.name || prev.department,
      institution: uni.name,
    }));
  };

  // Reset form
  const handleStartOver = () => {
    setCourseInfo({
      courseTitle: '',
      courseCode: '',
      assignmentTopic: '',
      assignmentType: 'Assignment',
    });
    setDownloadUrl(null);
    setGeneratedFilename('');
    toast.success('Form reset to blank state.');
  };

  // Generate Cover PDF
  const handleGenerateCover = async () => {
    if (!courseInfo.assignmentTopic || !studentInfo.studentName) {
      toast.error('Please enter at least an Assignment Topic and Student Name.');
      return;
    }

    setIsGenerating(true);
    try {
      const payload = {
        templateId: selectedTemplate,
        institution: studentInfo.institution,
        courseInfo,
        instructorInfo,
        studentInfo,
        submissionInfo,
      };

      const res = await api.post('/academic/generate-cover', payload);
      if (res.data.success) {
        setDownloadUrl(res.data.downloadUrl);
        setGeneratedFilename(res.data.filename);
        setWorkingDocument({
          name: res.data.filename,
          downloadUrl: res.data.downloadUrl,
          lastOperation: 'Academic Cover Page',
        });
        toast.success('Cover Page compiled successfully!');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to compile cover page.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Build Multi-Page Document
  const handleBuildDocument = async () => {
    setIsGenerating(true);
    try {
      const payload = {
        coverData: {
          templateId: selectedTemplate,
          institution: studentInfo.institution,
          courseInfo,
          instructorInfo,
          studentInfo,
          submissionInfo,
        },
        sections: docSections,
      };

      const res = await api.post('/academic/build-document', payload);
      if (res.data.success) {
        setDownloadUrl(res.data.downloadUrl);
        setGeneratedFilename(res.data.filename);
        setWorkingDocument({
          name: res.data.filename,
          downloadUrl: res.data.downloadUrl,
          lastOperation: 'Multi-Page Academic Document',
          pageCount: res.data.pageCount,
        });
        toast.success(`Academic document (${res.data.pageCount} pages) compiled!`);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to assemble document.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Print Preview
  const handlePrint = () => {
    window.print();
  };

  // Current selected template config
  const currentTemplate = ACADEMIC_TEMPLATES.find((t) => t.templateId === selectedTemplate) || ACADEMIC_TEMPLATES[0];

  return (
    <div className="min-h-screen bg-forest-canvas pt-24 pb-20">
      <div className="section-container">
        
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
              <i className="bi bi-mortarboard-fill"></i> Academic Productivity Studio
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Academic Studio
            </h1>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl">
              Design publication-ready assignment covers, multi-page thesis packages, and formatted documents without wrestling with Word formatting.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/cover-page"
              className="inline-flex items-center gap-2 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-4 py-2.5 rounded-xl shadow-xs transition-all"
            >
              <i className="bi bi-file-earmark-richtext"></i>
              <span>DIU Cover Page Generator</span>
            </Link>
            <Link
              to="/academic/tools"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl shadow-xs transition-all"
            >
              <i className="bi bi-textarea-t text-blue-600"></i>
              <span>Text & Citation Tools</span>
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-200/60 rounded-2xl max-w-md mb-8">
          <button
            type="button"
            onClick={() => setActiveTab('builder')}
            className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'builder'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <i className="bi bi-stack mr-1.5"></i> Document Builder
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('profiles')}
            className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'profiles'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <i className="bi bi-buildings mr-1.5"></i> University Profiles
          </button>
        </div>



        {/* TAB 2: DOCUMENT BUILDER (Multi-Page Assembler) */}
        {activeTab === 'builder' && (
          <div className="bg-[#0D111C] border border-[#1E2638] rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="max-w-3xl mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Multi-Page Architecture</span>
              <h2 className="text-2xl font-black text-white mt-1">Academic Document Builder</h2>
              <p className="text-xs text-zinc-300 mt-1">
                Construct complete multi-page reports in a single compile pass. Toggle and sequence front-matter pages before exporting a unified document.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {[
                { key: 'cover', title: '1. Cover Page', desc: 'Title, institution logo, course & student info' },
                { key: 'declaration', title: '2. Declaration Page', desc: 'Academic honesty statement & signature line' },
                { key: 'acknowledgement', title: '3. Acknowledgement', desc: 'Formal appreciation to supervisor & faculty' },
                { key: 'certificate', title: '4. Certificate of Approval', desc: 'Supervisor verification & sign-off block' },
                { key: 'toc', title: '5. Table of Contents', desc: 'Formatted multi-tier section outline' },
                { key: 'references', title: '6. References / Bibliography', desc: 'Standardized citation listing' },
              ].map((sec) => (
                <div
                  key={sec.key}
                  onClick={() => setDocSections({ ...docSections, [sec.key]: !docSections[sec.key] })}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    docSections[sec.key]
                      ? 'border-blue-500 bg-[#141D33] text-white shadow-md shadow-blue-500/10'
                      : 'border-[#1E2638] bg-[#07090E] text-zinc-300 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white">{sec.title}</span>
                    <i
                      className={`bi ${docSections[sec.key] ? 'bi-check-circle-fill text-blue-400' : 'bi-circle text-zinc-600'}`}
                    ></i>
                  </div>
                  <p className="text-[11px] text-zinc-400">{sec.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={handleBuildDocument}
                disabled={isGenerating}
                className="btn-lime text-xs uppercase tracking-wider py-3.5 px-8 shadow-sm"
              >
                {isGenerating ? (
                  <>
                    <i className="bi bi-arrow-repeat animate-spin"></i> Building Unified PDF...
                  </>
                ) : (
                  <>
                    <i className="bi bi-layers-fill"></i> Compile Complete Document PDF
                  </>
                )}
              </button>

              {downloadUrl && (
                <a
                  href={downloadUrl}
                  download={generatedFilename}
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-3.5 px-6 rounded-xl shadow-sm transition-all"
                >
                  <i className="bi bi-download"></i> Download Unified PDF
                </a>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: UNIVERSITY PROFILES */}
        {activeTab === 'profiles' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="max-w-2xl mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Dynamic Profile Engine</span>
              <h2 className="text-2xl font-black text-slate-900 mt-1">Smart University Profiles</h2>
              <p className="text-xs text-slate-500 mt-1">
                PDFnerd uses a generic profile architecture. Selecting an institution automatically populates department programs, formatting guidelines, and default faculty details.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {UNIVERSITIES_DATABASE.map((uni) => (
                <div
                  key={uni.code}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black uppercase px-2 py-0.5 rounded bg-slate-900 text-white">
                        {uni.code}
                      </span>
                      <span className="text-[11px] text-slate-400 font-semibold">{uni.country}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mb-1">{uni.name}</h4>
                    <p className="text-[11px] text-slate-500 mb-3">{uni.campus}</p>

                    <div className="text-[11px] text-slate-600 font-semibold mb-1">Departments:</div>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {uni.departments.map((dept) => (
                        <span
                          key={dept.code}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700"
                        >
                          {dept.code}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      handleUniversityChange(uni.code);
                      setActiveTab('builder');
                      toast.success(`Active profile switched to ${uni.name}`);
                    }}
                    className="w-full py-2 rounded-xl bg-white hover:bg-slate-900 hover:text-white border border-slate-200 text-slate-800 text-xs font-bold transition-all"
                  >
                    Use This Profile
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
