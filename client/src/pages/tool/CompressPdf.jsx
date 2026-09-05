import ToolLayout from '../../components/tool/ToolLayout';
import { pdfService } from '../../services/pdfService';
import { formatFileSize } from '../../utils/formatters';

export default function CompressPdf() {
  const handleCompress = async (files, onProgress) => {
    const file = files[0];
    const res = await pdfService.compress(file, onProgress);

    const origSize = res.headers['x-original-size']
      ? parseInt(res.headers['x-original-size'])
      : file.size;
    const compSize = res.headers['x-compressed-size']
      ? parseInt(res.headers['x-compressed-size'])
      : res.data.size;
    const savedPercent =
      res.headers['x-saved-percent'] ||
      Math.max(1, Math.round((1 - compSize / origSize) * 100));

    return {
      data: res.data,
      filename: `compressed_${file.name}`,
      stats: {
        originalSize: formatFileSize(origSize),
        compressedSize: formatFileSize(compSize),
        savedPercent: `${savedPercent}%`,
      },
    };
  };

  const compressOptions = (
    <div>
      <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
        Compression Profile
      </h4>
      <div className="grid grid-cols-3 gap-2">
        <div className="p-3 rounded-xl bg-forest-dark border border-forest-border text-center">
          <span className="text-xs font-bold text-white block">Extreme</span>
          <span className="text-[10px] text-forest-textMuted">Smallest file size</span>
        </div>
        <div className="p-3 rounded-xl bg-lime-accent/15 border border-lime-accent/40 text-center shadow-lime-glow">
          <span className="text-xs font-bold text-lime-accent block">Recommended</span>
          <span className="text-[10px] text-forest-textMuted">Balanced quality</span>
        </div>
        <div className="p-3 rounded-xl bg-forest-dark border border-forest-border text-center">
          <span className="text-xs font-bold text-white block">Light</span>
          <span className="text-[10px] text-forest-textMuted">High resolution</span>
        </div>
      </div>
    </div>
  );

  return (
    <ToolLayout
      title="Compress PDF"
      description="Dramatically reduce PDF file sizes while keeping crisp typography and images intact."
      icon="bi-file-zip"
      multiple={false}
      options={compressOptions}
      processLabel="Compress Document"
      badge="Popular"
      onProcess={handleCompress}
    />
  );
}
