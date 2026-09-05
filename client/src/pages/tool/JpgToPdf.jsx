import ToolLayout from '../../components/tool/ToolLayout';
import { pdfService } from '../../services/pdfService';

export default function JpgToPdf() {
  const handleConvert = async (files, onProgress) => {
    const res = await pdfService.jpgToPdf(files, onProgress);
    return {
      data: res.data,
      filename: 'converted_images.pdf',
    };
  };

  return (
    <ToolLayout
      title="JPG to PDF"
      description="Convert JPG, PNG, and WebP images into a beautifully formatted, single PDF document."
      icon="bi-file-earmark-image"
      accept={{
        'image/jpeg': ['.jpg', '.jpeg'],
        'image/png': ['.png'],
        'image/webp': ['.webp'],
      }}
      multiple={true}
      maxFiles={30}
      processLabel="Convert to PDF"
      badge="Popular"
      onProcess={handleConvert}
    />
  );
}
