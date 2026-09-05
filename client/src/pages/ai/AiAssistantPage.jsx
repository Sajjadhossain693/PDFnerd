import { useState } from 'react';
import { Link } from 'react-router-dom';
import FileUploader from '../../components/ui/FileUploader';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { useWorkspace } from '../../context/WorkspaceContext';

export default function AiAssistantPage() {
  const { setWorkingDocument } = useWorkspace();
  const [file, setFile] = useState(null);
  const [query, setQuery] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    {
      role: 'assistant',
      text: 'Hello! Upload any PDF document and ask me anything about its contents, methodologies, key dates, or concepts.',
      citations: [],
    },
  ]);

  const handleFileAccepted = (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setWorkingDocument({
        file: acceptedFiles[0],
        name: acceptedFiles[0].name,
        sizeBytes: acceptedFiles[0].size,
        lastOperation: 'AI Document Assistant',
      });
      toast.success(`Loaded "${acceptedFiles[0].name}" into AI Assistant.`);
    }
  };

  const handleSend = async (userPrompt = null) => {
    const activeQuery = (userPrompt || query).trim();
    if (!activeQuery) return;

    if (!file) {
      toast.error('Please upload a PDF document before asking questions.');
      return;
    }

    const newChat = [...chatHistory, { role: 'user', text: activeQuery }];
    setChatHistory(newChat);
    setQuery('');
    setIsAsking(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('query', activeQuery);

    try {
      const res = await api.post('/study/ask', formData);
      if (res.data.success) {
        setChatHistory([
          ...newChat,
          {
            role: 'assistant',
            text: res.data.response.answer,
            primaryPage: res.data.response.primaryPage,
            citations: res.data.response.citations || [],
          },
        ]);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to retrieve answer.');
    } finally {
      setIsAsking(false);
    }
  };

  const samplePrompts = [
    'What is this document about?',
    'Summarize the core architectural methodology.',
    'Find all important dates and deadlines.',
    'Explain the primary concept simply.',
    'Generate potential exam questions from this document.',
  ];

  return (
    <div className="min-h-screen bg-forest-canvas pt-24 pb-20">
      <div className="section-container max-w-4xl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold uppercase tracking-wider mb-2">
              <i className="bi bi-robot"></i> Semantic Document Intelligence
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Ask My Document
            </h1>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl">
              Converse with your PDF files. Ask questions, locate citations, and synthesize technical concepts with page-accurate references.
            </p>
          </div>

          <Link
            to="/study"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl shadow-xs transition-all w-fit"
          >
            <i className="bi bi-book"></i>
            <span>Study & Exam Mode</span>
          </Link>
        </div>

        {/* Upload Drawer if no file active */}
        {!file && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs mb-6">
            <FileUploader
              onFilesAccepted={handleFileAccepted}
              accept={{ 'application/pdf': ['.pdf'] }}
              multiple={false}
              title="Upload Document to Begin Conversation"
              description="Indexes text streams and creates semantic chunks for citation retrieval"
            />
          </div>
        )}

        {/* Active Document Info Bar */}
        {file && (
          <div className="mb-4 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                <i className="bi bi-file-earmark-pdf"></i>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 truncate block max-w-xs sm:max-w-md">{file.name}</span>
                <span className="text-[10px] text-slate-400 font-semibold">{Math.round(file.size / 1024)} KB Active</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setFile(null);
                setChatHistory([
                  {
                    role: 'assistant',
                    text: 'Document unloaded. Please upload another PDF to begin.',
                    citations: [],
                  },
                ]);
              }}
              className="text-xs text-slate-400 hover:text-slate-800 font-bold"
            >
              Change File
            </button>
          </div>
        )}

        {/* Chat Stream Window */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs min-h-[420px] flex flex-col justify-between space-y-6">
          
          <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2">
            {chatHistory.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    <i className="bi bi-stars"></i>
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-slate-900 text-white font-medium rounded-tr-xs'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Citation References */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-200/80 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block">
                        Cited Evidence:
                      </span>
                      {msg.citations.map((c, cIdx) => (
                        <div key={cIdx} className="text-[11px] text-slate-500 font-mono bg-white p-2 rounded-lg border border-slate-200">
                          <strong className="text-slate-700">Page {c.pageNumber}:</strong> {c.snippet}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isAsking && (
              <div className="flex gap-3 items-center text-xs text-indigo-600 font-bold p-3 bg-indigo-50/50 rounded-2xl w-fit">
                <i className="bi bi-arrow-repeat animate-spin"></i>
                <span>Retrieving semantic chunks and synthesizing answer...</span>
              </div>
            )}
          </div>

          {/* Quick Suggestion Chips */}
          <div className="pt-2 border-t border-slate-100">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Suggested Questions
            </div>
            <div className="flex flex-wrap gap-1.5">
              {samplePrompts.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSend(p)}
                  className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 px-2.5 py-1 rounded-lg transition-all text-left"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 pt-2"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything about the uploaded document..."
              className="spark-input text-xs"
              disabled={isAsking}
            />

            <button
              type="submit"
              disabled={isAsking || !query.trim()}
              className="btn-lime text-xs uppercase tracking-wider py-3 px-6 shrink-0 disabled:opacity-40"
            >
              <i className="bi bi-send-fill"></i>
            </button>
          </form>

        </div>

      </div>
    </div>
  );
}
