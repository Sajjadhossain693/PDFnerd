import { useState } from 'react';
import ToolLayout from '../../components/tool/ToolLayout';
import { pdfService } from '../../services/pdfService';

export default function Watermark() {
  const [text, setText] = useState('CONFIDENTIAL');
  const [opacity, setOpacity] = useState(0.25);
  const [fontSize, setFontSize] = useState(60);

  const handleWatermark = async (files, onProgress) => {
    const file = files[0];
    const res = await pdfService.addWatermark(
      file,
      { text, opacity, fontSize },
      onProgress
    );
    return {
      data: res.data,
      filename: `watermarked_${file.name}`,
    };
  };

  const watermarkOptions = (
    <div className="space-y-4">
      <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
        Watermark Settings
      </h4>
      <div>
        <label className="block text-[11px] font-bold text-forest-textMuted uppercase mb-1">
          Watermark Text
        </label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="CONFIDENTIAL, DRAFT, COPY..."
          className="spark-input text-xs"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-bold text-forest-textMuted uppercase mb-1">
            Opacity ({Math.round(opacity * 100)}%)
          </label>
          <input
            type="range"
            min="0.05"
            max="0.9"
            step="0.05"
            value={opacity}
            onChange={(e) => setOpacity(parseFloat(e.target.value))}
            className="w-full accent-lime-accent"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-forest-textMuted uppercase mb-1">
            Font Size ({fontSize}px)
          </label>
          <input
            type="range"
            min="20"
            max="100"
            step="5"
            value={fontSize}
            onChange={(e) => setFontSize(parseInt(e.target.value))}
            className="w-full accent-lime-accent"
          />
        </div>
      </div>
    </div>
  );

  return (
    <ToolLayout
      title="Add Watermark"
      description="Protect your intellectual property by stamping custom diagonal watermarks across all pages."
      icon="bi-droplet-half"
      multiple={false}
      options={watermarkOptions}
      processLabel="Apply Watermark"
      onProcess={handleWatermark}
    />
  );
}
