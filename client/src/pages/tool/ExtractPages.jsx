import { useState } from 'react';
import ToolLayout from '../../components/tool/ToolLayout';
import { pdfService } from '../../services/pdfService';

export default function ExtractPages() {
  const [pages, setPages] = useState('1, 3');

  const handleExtract = async (files, onProgress) => {
    const file = files[0];
    const res = await pdfService.extractPages(file, pages, onProgress);
    return {
      data: res.data,
      filename: `extracted_${file.name}`,
    };
  };

  const extractOptions = (
    <div>
      <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
        Pages to Extract
      </h4>
      <label className="block text-[11px] font-bold text-forest-textMuted uppercase mb-1">
        Page Numbers to Keep (e.g. 1, 2, 5)
      </label>
      <input
        type="text"
        value={pages}
        onChange={(e) => setPages(e.target.value)}
        placeholder="e.g. 1, 3"
        className="spark-input text-xs"
      />
    </div>
  );

  return (
    <ToolLayout
      title="Extract PDF Pages"
      description="Pick and isolate specific pages to generate a clean, focused new document."
      icon="bi-box-arrow-up-right"
      multiple={false}
      options={extractOptions}
      processLabel="Extract to New PDF"
      onProcess={handleExtract}
    />
  );
}
