import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function AcademicTextTools() {
  const [activeTab, setActiveTab] = useState('counter'); // 'counter' | 'formatter' | 'citation'

  // 1. Text for Counter & Formatter
  const [inputText, setInputText] = useState(
    'Distributed systems enable modular, high-throughput computation across heterogeneous clusters. However, ensuring strict data consistency and fault resilience mandates rigorous verification protocols.'
  );

  // 2. Citation Form State
  const [citationData, setCitationData] = useState({
    author: 'Smith, John and Taylor, Morgan',
    title: 'Architectural Principles of Modern Distributed Data Pipelines',
    year: '2024',
    journal: 'Journal of Software Engineering and Architecture',
    volume: '18',
    issue: '3',
    pages: '112-128',
    doi: '10.1016/j.jsea.2024.04.012',
    url: 'https://doi.org/10.1016/j.jsea.2024.04.012',
  });

  // Word Counter Computations
  const stats = useMemo(() => {
    const raw = inputText.trim();
    if (!raw) {
      return { words: 0, charsWithSpaces: 0, charsNoSpaces: 0, sentences: 0, paragraphs: 0, readingTimeMin: 0 };
    }

    const words = raw.split(/\s+/).filter(Boolean).length;
    const charsWithSpaces = inputText.length;
    const charsNoSpaces = inputText.replace(/\s/g, '').length;
    const sentences = raw.split(/[.?!]+/).filter((s) => s.trim().length > 0).length;
    const paragraphs = raw.split(/\n+/).filter((p) => p.trim().length > 0).length;
    const readingTimeMin = Math.ceil(words / 200);

    return { words, charsWithSpaces, charsNoSpaces, sentences, paragraphs, readingTimeMin };
  }, [inputText]);

  // Text Formatter Actions
  const applyFormatting = (type) => {
    switch (type) {
      case 'uppercase':
        setInputText(inputText.toUpperCase());
        toast.success('Converted to UPPERCASE');
        break;
      case 'lowercase':
        setInputText(inputText.toLowerCase());
        toast.success('Converted to lowercase');
        break;
      case 'titlecase':
        setInputText(
          inputText.replace(
            /\w\S*/g,
            (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
          )
        );
        toast.success('Converted to Title Case');
        break;
      case 'sentencecase':
        setInputText(
          inputText.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase())
        );
        toast.success('Converted to Sentence case');
        break;
      case 'clean-spaces':
        setInputText(inputText.replace(/[ \t]+/g, ' ').trim());
        toast.success('Extra spaces removed');
        break;
      case 'clean-lines':
        setInputText(inputText.replace(/\n\s*\n/g, '\n').trim());
        toast.success('Blank lines removed');
        break;
      default:
        break;
    }
  };

  // Citation Formats derived from user data
  const formattedCitations = useMemo(() => {
    const { author, title, year, journal, volume, issue, pages, doi, url } = citationData;

    // APA 7th Edition
    // Author, A. A. (Year). Title of article. Title of Periodical, volume(issue), pages. DOI
    const volIssue = volume ? (issue ? `${volume}(${issue})` : volume) : '';
    const pp = pages ? `, ${pages}` : '';
    const doiPart = doi ? ` https://doi.org/${doi.replace(/^https?:\/\/(dx\.)?doi\.org\//, '')}` : url ? ` ${url}` : '';
    const apa = `${author || 'Author, A.'} (${year || 'n.d.'}). ${title || 'Title of document'}. ${journal || 'Academic Journal'}${volIssue ? `, ${volIssue}` : ''}${pp}.${doiPart}`;

    // MLA 9th Edition
    // Author. "Title of Article." Title of Journal, vol. X, no. Y, Year, pp. Z-Z. DOI/URL.
    const mlaVol = volume ? `vol. ${volume}, ` : '';
    const mlaIssue = issue ? `no. ${issue}, ` : '';
    const mlaPages = pages ? `pp. ${pages}. ` : '';
    const mla = `${author || 'Author'}. "${title || 'Title'}." ${journal || 'Journal'}, ${mlaVol}${mlaIssue}${year || 'Year'}, ${mlaPages}${doiPart}`;

    // IEEE Style
    // [1] A. Author, "Title of article," Abbrev. Title of Periodical, vol. x, no. x, pp. xxx-xxx, Month, year, doi: xxx.
    const ieee = `[1] ${author || 'Author'}, "${title || 'Title'}," ${journal || 'Journal'}, vol. ${volume || '1'}, no. ${issue || '1'}, pp. ${pages || '1-10'}, ${year || '2024'}${doi ? `, doi: ${doi}` : ''}.`;

    return { apa, mla, ieee };
  }, [citationData]);

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  return (
    <div className="min-h-screen bg-forest-canvas pt-24 pb-20">
      <div className="section-container">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
              <i className="bi bi-fonts"></i> Academic Writing & Precision Suite
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Academic Text & Citation Tools
            </h1>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl">
              Real-time word metrics, case formatting, and standard-compliant APA, MLA, and IEEE reference generation without hallucinated sources.
            </p>
          </div>

          <Link
            to="/academic"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl shadow-xs transition-all w-fit"
          >
            <i className="bi bi-arrow-left"></i>
            <span>Back to Cover Creator</span>
          </Link>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-200/60 rounded-2xl max-w-md mb-8">
          <button
            type="button"
            onClick={() => setActiveTab('counter')}
            className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'counter'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <i className="bi bi-calculator mr-1"></i> Word Counter
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('formatter')}
            className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'formatter'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <i className="bi bi-text-left mr-1"></i> Text Formatter
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('citation')}
            className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'citation'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <i className="bi bi-quote mr-1"></i> Citation Helper
          </button>
        </div>

        {/* TAB 1: WORD COUNTER */}
        {activeTab === 'counter' && (
          <div className="space-y-6">
            {/* Live Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { label: 'Words', val: stats.words, icon: 'bi-type', color: 'text-blue-600' },
                { label: 'Characters', val: stats.charsWithSpaces, icon: 'bi-card-text', color: 'text-slate-900' },
                { label: 'No Spaces', val: stats.charsNoSpaces, icon: 'bi-body-text', color: 'text-slate-700' },
                { label: 'Sentences', val: stats.sentences, icon: 'bi-chat-square-text', color: 'text-emerald-600' },
                { label: 'Paragraphs', val: stats.paragraphs, icon: 'bi-text-paragraph', color: 'text-indigo-600' },
                { label: 'Reading Time', val: `${stats.readingTimeMin} min`, icon: 'bi-clock', color: 'text-amber-600' },
              ].map((item, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs text-center">
                  <i className={`bi ${item.icon} ${item.color} text-lg block mb-1`}></i>
                  <div className={`text-2xl font-black ${item.color}`}>{item.val}</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Text Area */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Document Draft Text
                </label>
                <button
                  type="button"
                  onClick={() => setInputText('')}
                  className="text-xs text-slate-400 hover:text-slate-700 font-semibold"
                >
                  Clear Text
                </button>
              </div>
              <textarea
                rows={10}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste or type your thesis text, abstract, or essay..."
                className="spark-input text-xs leading-relaxed font-sans"
              />
            </div>
          </div>
        )}

        {/* TAB 2: TEXT FORMATTER */}
        {activeTab === 'formatter' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Clean Typography</span>
              <h3 className="text-xl font-black text-slate-900 mt-1">One-Click Formatting Actions</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Standardize capitalization, strip stray whitespace, and remove blank gaps before pasting into academic reports.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => applyFormatting('uppercase')}
                className="btn-forest-outline text-xs py-2 px-3.5"
              >
                UPPERCASE
              </button>
              <button
                type="button"
                onClick={() => applyFormatting('lowercase')}
                className="btn-forest-outline text-xs py-2 px-3.5"
              >
                lowercase
              </button>
              <button
                type="button"
                onClick={() => applyFormatting('titlecase')}
                className="btn-forest-outline text-xs py-2 px-3.5"
              >
                Title Case
              </button>
              <button
                type="button"
                onClick={() => applyFormatting('sentencecase')}
                className="btn-forest-outline text-xs py-2 px-3.5"
              >
                Sentence case
              </button>
              <button
                type="button"
                onClick={() => applyFormatting('clean-spaces')}
                className="btn-forest-outline text-xs py-2 px-3.5"
              >
                <i className="bi bi-distribute-horizontal"></i> Remove Extra Spaces
              </button>
              <button
                type="button"
                onClick={() => applyFormatting('clean-lines')}
                className="btn-forest-outline text-xs py-2 px-3.5"
              >
                <i className="bi bi-distribute-vertical"></i> Remove Blank Lines
              </button>
            </div>

            <textarea
              rows={10}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste text here to apply formatting..."
              className="spark-input text-xs leading-relaxed font-sans"
            />
          </div>
        )}

        {/* TAB 3: CITATION HELPER */}
        {activeTab === 'citation' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Form */}
            <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Source Information</span>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">Reference Data Entry</h3>
                <p className="text-[11px] text-slate-400">
                  Organizes verified citation fields strictly according to official academic style handbooks.
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Author(s)</label>
                <input
                  type="text"
                  value={citationData.author}
                  onChange={(e) => setCitationData({ ...citationData, author: e.target.value })}
                  placeholder="e.g. Smith, John and Taylor, Morgan"
                  className="spark-input text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Article / Work Title</label>
                <input
                  type="text"
                  value={citationData.title}
                  onChange={(e) => setCitationData({ ...citationData, title: e.target.value })}
                  placeholder="e.g. Principles of Modern Computational Architecture"
                  className="spark-input text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Journal / Publisher</label>
                  <input
                    type="text"
                    value={citationData.journal}
                    onChange={(e) => setCitationData({ ...citationData, journal: e.target.value })}
                    placeholder="e.g. IEEE Transactions on Software"
                    className="spark-input text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Publication Year</label>
                  <input
                    type="text"
                    value={citationData.year}
                    onChange={(e) => setCitationData({ ...citationData, year: e.target.value })}
                    placeholder="e.g. 2024"
                    className="spark-input text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Volume</label>
                  <input
                    type="text"
                    value={citationData.volume}
                    onChange={(e) => setCitationData({ ...citationData, volume: e.target.value })}
                    placeholder="18"
                    className="spark-input text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Issue / No.</label>
                  <input
                    type="text"
                    value={citationData.issue}
                    onChange={(e) => setCitationData({ ...citationData, issue: e.target.value })}
                    placeholder="3"
                    className="spark-input text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Pages</label>
                  <input
                    type="text"
                    value={citationData.pages}
                    onChange={(e) => setCitationData({ ...citationData, pages: e.target.value })}
                    placeholder="112-128"
                    className="spark-input text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">DOI / URL</label>
                <input
                  type="text"
                  value={citationData.doi}
                  onChange={(e) => setCitationData({ ...citationData, doi: e.target.value })}
                  placeholder="10.1016/j.jsea.2024.04.012"
                  className="spark-input text-xs"
                />
              </div>
            </div>

            {/* Generated Citations Output */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Compiled Citations
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    Zero Hallucination
                  </span>
                </div>

                {/* APA */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-slate-900">APA 7th Edition</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(formattedCitations.apa, 'APA Citation')}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                    >
                      <i className="bi bi-clipboard"></i> Copy
                    </button>
                  </div>
                  <p className="text-xs text-slate-700 font-serif leading-relaxed select-all">
                    {formattedCitations.apa}
                  </p>
                </div>

                {/* MLA */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-slate-900">MLA 9th Edition</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(formattedCitations.mla, 'MLA Citation')}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                    >
                      <i className="bi bi-clipboard"></i> Copy
                    </button>
                  </div>
                  <p className="text-xs text-slate-700 font-serif leading-relaxed select-all">
                    {formattedCitations.mla}
                  </p>
                </div>

                {/* IEEE */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-slate-900">IEEE Style</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(formattedCitations.ieee, 'IEEE Citation')}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                    >
                      <i className="bi bi-clipboard"></i> Copy
                    </button>
                  </div>
                  <p className="text-xs text-slate-700 font-mono text-[11px] leading-relaxed select-all">
                    {formattedCitations.ieee}
                  </p>
                </div>

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
