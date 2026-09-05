import { useState } from 'react';
import ToolLayout from '../../components/tool/ToolLayout';
import { pdfService } from '../../services/pdfService';

export default function UnlockPdf() {
  const [password, setPassword] = useState('');

  const handleUnlock = async (files, onProgress) => {
    const file = files[0];
    const res = await pdfService.unlock(file, password, onProgress);
    return {
      data: res.data,
      filename: `unlocked_${file.name}`,
    };
  };

  const unlockOptions = (
    <div>
      <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
        Unlock Password
      </h4>
      <label className="block text-[11px] font-bold text-forest-textMuted uppercase mb-1">
        Current Document Password
      </label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password to unlock..."
        className="spark-input text-xs"
      />
    </div>
  );

  return (
    <ToolLayout
      title="Unlock PDF"
      description="Remove password protection and read/write security constraints from your documents."
      icon="bi-unlock"
      multiple={false}
      options={unlockOptions}
      processLabel="Unlock & Decrypt"
      onProcess={handleUnlock}
    />
  );
}
