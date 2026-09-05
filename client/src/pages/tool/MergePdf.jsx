import ToolLayout from '../../components/tool/ToolLayout';
import { pdfService } from '../../services/pdfService';

export default function MergePdf() {
  const handleMerge = async (files, onProgress) => {
    const res = await pdfService.merge(files, onProgress);
    return {
      data: res.data,
      filename: 'merged_document.pdf',
    };
  };

  return (
    <ToolLayout
      title="Merge PDF"
      description="Combine multiple PDF documents into a single unified file in the exact order you choose."
      icon="bi-files"
      multiple={true}
      maxFiles={20}
      processLabel="Merge PDFs Now"
      badge="Popular"
      onProcess={handleMerge}
    />
  );
}
