import { useState } from 'react';
import ToolLayout from '../../components/tool/ToolLayout';
import { pdfService } from '../../services/pdfService';
import toast from 'react-hot-toast';

export default function ProtectPdf() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleProtect = async (files, onProgress) => {
    if (!password) {
      toast.error('Please specify an encryption password.');
      throw new Error('Password is required.');
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      throw new Error('Passwords do not match.');
    }

    const file = files[0];
    const res = await pdfService.protect(file, password, onProgress);
    return {
      data: res.data,
      filename: `protected_${file.name}`,
    };
  };

  const protectOptions = (
    <div className="space-y-3">
      <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
        Document Security Setup
      </h4>
      <div>
        <label className="block text-[11px] font-bold text-forest-textMuted uppercase mb-1">
          Set Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••••••"
          className="spark-input text-xs"
        />
      </div>
      <div>
        <label className="block text-[11px] font-bold text-forest-textMuted uppercase mb-1">
          Repeat Password
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••••••"
          className="spark-input text-xs"
        />
      </div>
    </div>
  );

  return (
    <ToolLayout
      title="Protect PDF"
      description="Safeguard sensitive business or personal documents with military-grade password encryption."
      icon="bi-shield-lock"
      multiple={false}
      options={protectOptions}
      processLabel="Encrypt PDF"
      onProcess={handleProtect}
    />
  );
}
