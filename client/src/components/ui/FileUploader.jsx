import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

export default function FileUploader({
  onFilesAccepted,
  accept = { 'application/pdf': ['.pdf'] },
  multiple = false,
  maxFiles = 20,
  label = 'Select or drop files here',
  sublabel = 'or browse from your device',
  icon = 'bi-cloud-arrow-up-fill',
  disabled = false,
}) {
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0) onFilesAccepted(acceptedFiles);
    },
    [onFilesAccepted]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept,
    multiple,
    maxFiles,
    disabled,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-2xl p-10 md:p-14 text-center cursor-pointer transition-all duration-200 select-none bg-[#0D111C] shadow-lg shadow-black/30 ${
        isDragReject
          ? 'border-red-500/60 bg-red-500/10 text-red-400'
          : isDragActive
          ? 'border-amber-400 bg-[#141A28] scale-[1.01]'
          : 'border-[#1E2638] hover:border-zinc-500 hover:bg-[#111624]'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <input {...getInputProps()} />

      <div className="flex flex-col items-center justify-center">
        {/* Animated icon circle */}
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 transition-transform duration-200 ${
            isDragActive ? 'scale-110 bg-[#1E2638] text-amber-400' : 'bg-[#151A27] text-amber-400 border border-[#232B3D]'
          }`}
        >
          <i className={`bi ${isDragReject ? 'bi-x-octagon' : isDragActive ? 'bi-check2-circle' : icon}`}></i>
        </div>

        {isDragReject ? (
          <p className="text-rose-400 font-bold text-sm">Unsupported file type</p>
        ) : isDragActive ? (
          <p className="text-amber-400 font-bold text-base">Release to upload immediately!</p>
        ) : (
          <>
            <h3 className="text-white font-bold text-base md:text-lg mb-1">{label}</h3>
            <p className="text-zinc-400 text-xs mb-5">{sublabel}</p>
            <button
              type="button"
              className="btn-lime text-xs uppercase tracking-wider py-2.5 px-6 pointer-events-none shadow-lg shadow-orange-500/20"
            >
              <i className="bi bi-folder2-open"></i> Choose Files
            </button>
            <p className="text-zinc-500 text-[11px] mt-4 flex items-center gap-1.5 font-medium">
              <i className="bi bi-shield-check text-emerald-400"></i> Max 10MB per file · Pure client/server streaming
            </p>
          </>
        )}
      </div>
    </div>
  );
}
