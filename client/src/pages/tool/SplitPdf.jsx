import { useState } from 'react';
import ToolLayout from '../../components/tool/ToolLayout';
import { pdfService } from '../../services/pdfService';

export default function SplitPdf() {
  const [mode, setMode] = useState('range'); // 'range' | 'every' | 'pages'
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(1);
  const [pagesList, setPagesList] = useState('1, 2, 3');

  const handleSplit = async (files, onProgress) => {
    const file = files[0];
    const options = {
      mode,
      start: startPage,
      end: endPage,
      pages: pagesList,
    };
    const res = await pdfService.split(file, options, onProgress);
    return {
      data: res.data,
      filename: `split_${file.name}`,
    };
  };

  const splitOptions = (
    <div className="space-y-4">
      <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
        Split Configuration
      </h4>

      {/* Mode Selector */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setMode('range')}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
            mode === 'range'
              ? 'bg-lime-accent text-forest-canvas border-lime-accent'
              : 'bg-forest-dark text-forest-textMuted border-forest-border hover:text-white'
          }`}
        >
          Page Range
        </button>
        <button
          type="button"
          onClick={() => setMode('pages')}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
            mode === 'pages'
              ? 'bg-lime-accent text-forest-canvas border-lime-accent'
              : 'bg-forest-dark text-forest-textMuted border-forest-border hover:text-white'
          }`}
        >
          Specific Pages
        </button>
      </div>

      {mode === 'range' ? (
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div>
            <label className="block text-[11px] font-bold text-forest-textMuted uppercase mb-1">
              From Page
            </label>
            <input
              type="number"
              min="1"
              value={startPage}
              onChange={(e) => setStartPage(Math.max(1, parseInt(e.target.value) || 1))}
              className="spark-input text-xs"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-forest-textMuted uppercase mb-1">
              To Page
            </label>
            <input
              type="number"
              min="1"
              value={endPage}
              onChange={(e) => setEndPage(Math.max(1, parseInt(e.target.value) || 1))}
              className="spark-input text-xs"
            />
          </div>
        </div>
      ) : (
        <div className="pt-2">
          <label className="block text-[11px] font-bold text-forest-textMuted uppercase mb-1">
            Comma-Separated Pages (e.g. 1, 3, 5)
          </label>
          <input
            type="text"
            value={pagesList}
            onChange={(e) => setPagesList(e.target.value)}
            placeholder="1, 3, 5"
            className="spark-input text-xs"
          />
        </div>
      )}
    </div>
  );

  return (
    <ToolLayout
      title="Split PDF"
      description="Separate one PDF into individual pages or extract precise page segments."
      icon="bi-scissors"
      multiple={false}
      options={splitOptions}
      processLabel="Extract & Split"
      badge="Popular"
      onProcess={handleSplit}
    />
  );
}
