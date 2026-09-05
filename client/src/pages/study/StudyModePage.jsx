import { useState } from 'react';
import { Link } from 'react-router-dom';
import FileUploader from '../../components/ui/FileUploader';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { useWorkspace } from '../../context/WorkspaceContext';

export default function StudyModePage() {
  const { setWorkingDocument } = useWorkspace();
  const [file, setFile] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [studyData, setStudyData] = useState(null);
  const [difficulty, setDifficulty] = useState('medium'); // 'easy' | 'medium' | 'hard'

  // Interactive study widget state
  const [activeStudyTab, setActiveStudyTab] = useState('summary'); // 'summary' | 'flashcards' | 'mcq' | 'notes'
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [revealedAnswers, setRevealedAnswers] = useState({});

  const handleFileAccepted = (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setStudyData(null);
    }
  };

  const handleGenerate = async (count = 10) => {
    if (!file) {
      toast.error('Please upload course lecture notes or a textbook PDF.');
      return;
    }

    setIsGenerating(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('difficulty', difficulty);
    formData.append('questionCount', count);

    try {
      const res = await api.post('/study/generate', formData);
      if (res.data.success) {
        setStudyData(res.data.studyMaterials);
        setWorkingDocument({
          file,
          name: file.name,
          sizeBytes: file.size,
          lastOperation: 'Exam / Study Mode',
        });
        toast.success(`Study pack generated for "${file.name}"!`);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Study generation failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectAnswer = (qId, optionIndex) => {
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optionIndex }));
  };

  const handleToggleReveal = (qId) => {
    setRevealedAnswers((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  return (
    <div className="min-h-screen bg-forest-canvas pt-24 pb-20">
      <div className="section-container max-w-5xl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold uppercase tracking-wider mb-2">
              <i className="bi bi-book-half"></i> Intelligent Exam Prep & Synthesis
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Exam & Study Mode
            </h1>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl">
              Upload course slides, syllabus papers, or chapters to generate executive summaries, interactive revision flashcards, and scored multiple-choice questions.
            </p>
          </div>

          <Link
            to="/ai-assistant"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl shadow-xs transition-all w-fit"
          >
            <i className="bi bi-chat-dots text-indigo-600"></i>
            <span>Ask My Document</span>
          </Link>
        </div>

        {/* Upload State */}
        {!studyData && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs">
              <FileUploader
                onFilesAccepted={handleFileAccepted}
                accept={{ 'application/pdf': ['.pdf'] }}
                multiple={false}
                title="Select Lecture Slides or Textbook PDF"
                description="Extracts topics, synthesizes definitions, and crafts revision tests"
              />

              {file && (
                <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                        <i className="bi bi-journal-text"></i>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{file.name}</div>
                        <div className="text-[11px] text-slate-400">{Math.round(file.size / 1024)} KB</div>
                      </div>
                    </div>

                    {/* Difficulty Pill */}
                    <div className="flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-xl">
                      {['easy', 'medium', 'hard'].map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setDifficulty(lvl)}
                          className={`px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all ${
                            difficulty === lvl
                              ? 'bg-slate-900 text-white shadow-xs'
                              : 'text-slate-500 hover:text-slate-900'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => handleGenerate(10)}
                      disabled={isGenerating}
                      className="btn-lime text-xs uppercase tracking-wider py-3.5 px-6 shadow-sm flex-1 sm:flex-initial"
                    >
                      {isGenerating ? (
                        <>
                          <i className="bi bi-arrow-repeat animate-spin"></i> Synthesizing Study Kit...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-mortarboard"></i> Create Full Study Pack (10 Questions)
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Study Pack Interactive View */}
        {studyData && (
          <div className="space-y-6">
            
            {/* Top Bar with Document Title & Tab Selector */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                  Study Deck Ready
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1">{studyData.fileName}</h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStudyData(null)}
                  className="text-xs text-slate-500 hover:text-slate-800 font-semibold px-3 py-1.5 rounded-lg border border-slate-200"
                >
                  Load Another PDF
                </button>
              </div>
            </div>

            {/* Study Navigation Tabs */}
            <div className="flex items-center gap-2 p-1.5 bg-slate-200/60 rounded-2xl max-w-lg">
              {[
                { key: 'summary', label: 'Summary & Topics', icon: 'bi-file-text' },
                { key: 'flashcards', label: `Flashcards (${studyData.flashcards.length})`, icon: 'bi-card-list' },
                { key: 'mcq', label: `Exam MCQs (${studyData.mcqs.length})`, icon: 'bi-check2-circle' },
                { key: 'notes', label: 'Revision Notes', icon: 'bi-journal-check' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveStudyTab(tab.key)}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all text-center ${
                    activeStudyTab === tab.key
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <i className={`bi ${tab.icon} mr-1`}></i> {tab.label}
                </button>
              ))}
            </div>

            {/* TAB 1: SUMMARY & TOPICS */}
            {activeStudyTab === 'summary' && (
              <div className="space-y-6">
                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3 pb-2 border-b border-slate-100">
                    Executive Summary
                  </h4>
                  <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {studyData.summaryParagraphs.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Key Topics */}
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3 pb-2 border-b border-slate-100">
                      High-Priority Topics
                    </h4>
                    <div className="space-y-2.5">
                      {studyData.keyTopics.map((t) => (
                        <div key={t.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-slate-900">{t.title}</span>
                            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                              {t.importance}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500">{t.overview}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Definitions Glossary */}
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3 pb-2 border-b border-slate-100">
                      Core Concept Definitions
                    </h4>
                    <div className="space-y-2.5">
                      {studyData.definitions.map((d, i) => (
                        <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-black text-slate-900">{d.term}</span>
                            <span className="text-[10px] text-slate-400 font-mono">Page {d.pageRef}</span>
                          </div>
                          <p className="text-[11px] text-slate-600">{d.definition}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: INTERACTIVE 3D FLASHCARDS */}
            {activeStudyTab === 'flashcards' && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs max-w-2xl mx-auto text-center space-y-6">
                <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                  <span>Card {currentCardIndex + 1} of {studyData.flashcards.length}</span>
                  <span className="text-indigo-600 font-bold">Click card to reveal answer</span>
                </div>

                {/* Flip Card Container */}
                <div
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="w-full min-h-[260px] p-8 rounded-3xl border-2 border-slate-200 hover:border-indigo-400 bg-slate-50/50 cursor-pointer shadow-sm flex flex-col justify-between transition-all"
                >
                  <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full self-center">
                    {isFlipped ? 'Answer' : 'Question'}
                  </span>

                  <div className="my-auto py-4">
                    {!isFlipped ? (
                      <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                        {studyData.flashcards[currentCardIndex].question}
                      </h3>
                    ) : (
                      <p className="text-sm text-slate-800 leading-relaxed font-medium">
                        {studyData.flashcards[currentCardIndex].answer}
                      </p>
                    )}
                  </div>

                  <span className="text-[11px] text-slate-400">
                    Category: {studyData.flashcards[currentCardIndex].category} • Page {studyData.flashcards[currentCardIndex].page}
                  </span>
                </div>

                {/* Card Controls */}
                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsFlipped(false);
                      setCurrentCardIndex((prev) => Math.max(0, prev - 1));
                    }}
                    disabled={currentCardIndex === 0}
                    className="btn-forest-outline text-xs py-2.5 px-5 disabled:opacity-30"
                  >
                    <i className="bi bi-chevron-left"></i> Previous
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="btn-lime text-xs uppercase tracking-wider py-2.5 px-6"
                  >
                    <i className="bi bi-arrow-repeat"></i> Flip Card
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsFlipped(false);
                      setCurrentCardIndex((prev) => Math.min(studyData.flashcards.length - 1, prev + 1));
                    }}
                    disabled={currentCardIndex === studyData.flashcards.length - 1}
                    className="btn-forest-outline text-xs py-2.5 px-5 disabled:opacity-30"
                  >
                    Next <i className="bi bi-chevron-right"></i>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: MULTIPLE CHOICE QUESTIONS (MCQs) */}
            {activeStudyTab === 'mcq' && (
              <div className="space-y-4">
                {studyData.mcqs.map((q) => {
                  const userChoice = selectedAnswers[q.id];
                  const isRevealed = revealedAnswers[q.id];

                  return (
                    <div key={q.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                            {q.questionNumber}
                          </span>
                          <span className="text-[11px] font-bold text-slate-400 uppercase">
                            Difficulty: {q.difficulty}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">Ref: Page {q.pageReference}</span>
                      </div>

                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                        {q.question}
                      </h4>

                      {/* Options */}
                      <div className="space-y-2">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = userChoice === optIdx;
                          const isCorrect = optIdx === q.correctIndex;

                          let btnClass = 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700';
                          if (isRevealed) {
                            if (isCorrect) btnClass = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold';
                            else if (isSelected) btnClass = 'border-rose-400 bg-rose-50 text-rose-950';
                          } else if (isSelected) {
                            btnClass = 'border-slate-900 bg-slate-900 text-white font-bold';
                          }

                          return (
                            <button
                              key={optIdx}
                              type="button"
                              onClick={() => handleSelectAnswer(q.id, optIdx)}
                              className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center gap-3 ${btnClass}`}
                            >
                              <span className="font-bold opacity-60">
                                {String.fromCharCode(65 + optIdx)}.
                              </span>
                              <span>{opt}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Reveal Explanation Action */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => handleToggleReveal(q.id)}
                          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
                        >
                          <i className={`bi ${isRevealed ? 'bi-eye-slash' : 'bi-lightbulb'}`}></i>
                          <span>{isRevealed ? 'Hide Answer' : 'Check Explanation'}</span>
                        </button>
                      </div>

                      {isRevealed && (
                        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                          <strong className="text-emerald-700 block mb-1">
                            ✓ Correct Answer: {String.fromCharCode(65 + q.correctIndex)}
                          </strong>
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB 4: REVISION NOTES */}
            {activeStudyTab === 'notes' && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                <div>
                  <h4 className="text-sm font-black uppercase tracking-wider text-slate-900 mb-1">
                    Pre-Exam Rapid Revision Sheet
                  </h4>
                  <p className="text-xs text-slate-500">
                    Condensed memory anchors derived from the uploaded document text streams.
                  </p>
                </div>

                <div className="space-y-3">
                  {studyData.revisionNotes.map((note, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-xs text-indigo-950 font-medium leading-relaxed">
                      {note}
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
                    Likely Oral & Written Exam Questions
                  </h4>
                  <ul className="list-disc pl-5 space-y-2 text-xs text-slate-700">
                    {studyData.shortQuestions.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* AI Generated Content Disclaimer */}
            <div className="p-4 rounded-2xl bg-slate-100 text-center text-[11px] text-slate-500">
              <i className="bi bi-info-circle mr-1"></i> {studyData.disclaimer}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
