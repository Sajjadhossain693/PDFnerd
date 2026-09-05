import { useState } from 'react';
import ToolLayout from '../../components/tool/ToolLayout';
import { pdfService } from '../../services/pdfService';

export default function RotatePdf() {
  const [rotation, setRotation] = useState(90);

  const handleRotate = async (files, onProgress) => {
    const file = files[0];
    const res = await pdfService.rotate(file, rotation, null, onProgress);
    return {
      data: res.data,
      filename: `rotated_${file.name}`,
    };
  };

  const rotateOptions = (
    <div>
      <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
        Rotation Angle
      </h4>
      <div className="grid grid-cols-3 gap-2">
        {[
          { angle: 90, label: '90° Clockwise', icon: 'bi-arrow-clockwise' },
          { angle: 180, label: '180° Flip', icon: 'bi-arrow-repeat' },
          { angle: 270, label: '270° Counter', icon: 'bi-arrow-counterclockwise' },
        ].map((item) => (
          <button
            key={item.angle}
            type="button"
            onClick={() => setRotation(item.angle)}
            className={`p-3 rounded-xl border text-center transition-all ${
              rotation === item.angle
                ? 'bg-lime-accent/15 border-lime-accent text-lime-accent shadow-lime-glow'
                : 'bg-forest-dark border-forest-border text-forest-textMuted hover:text-white'
            }`}
          >
            <i className={`bi ${item.icon} text-lg block mb-1`}></i>
            <span className="text-xs font-bold">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <ToolLayout
      title="Rotate PDF"
      description="Rotate your PDF pages horizontally or vertically with single-click accuracy."
      icon="bi-arrow-repeat"
      multiple={false}
      options={rotateOptions}
      processLabel={`Rotate ${rotation}°`}
      onProcess={handleRotate}
    />
  );
}
