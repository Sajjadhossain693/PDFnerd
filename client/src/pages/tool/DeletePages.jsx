import { useState } from 'react';
import ToolLayout from '../../components/tool/ToolLayout';
import { pdfService } from '../../services/pdfService';

export default function DeletePages() {
  const [pages, setPages] = useState('2, 4');

  const handleDelete = async (files, onProgress) => {
    const file = files[0];
    const res = await pdfService.deletePages(file, pages, onProgress);
    return {
      data: res.data,
      filename: `cleaned_${file.name}`,
    };
  };

  const deleteOptions = (
    <div>
      <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
        Pages to Delete
      </h4>
      <label className="block text-[11px] font-bold text-forest-textMuted uppercase mb-1">
        Page Numbers to Discard (e.g. 1, 3, 5)
      </label>
      <input
        type="text"
        value={pages}
        onChange={(e) => setPages(e.target.value)}
        placeholder="e.g. 2, 4"
        className="spark-input text-xs"
      />
    </div>
  );

  return (
    <ToolLayout
      title="Delete PDF Pages"
      description="Remove unnecessary, blank, or erroneous pages from your document seamlessly."
      icon="bi-trash3"
      multiple={false}
      options={deleteOptions}
      processLabel="Remove Pages"
      onProcess={handleDelete}
    />
  );
}
