import { formatFileSize, truncateFilename, getFileExtension } from '../../utils/formatters';

export default function FileList({ files, onRemove, onReorder }) {
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', index);
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (isNaN(sourceIndex) || sourceIndex === targetIndex || !onReorder) return;
    const newFiles = [...files];
    const [moved] = newFiles.splice(sourceIndex, 1);
    newFiles.splice(targetIndex, 0, moved);
    onReorder(newFiles);
  };

  const handleDragOver = (e) => e.preventDefault();

  return (
    <div className="space-y-2">
      {files.map((file, idx) => (
        <div
          key={`${file.name}-${idx}`}
          draggable={!!onReorder}
          onDragStart={(e) => handleDragStart(e, idx)}
          onDrop={(e) => handleDrop(e, idx)}
          onDragOver={handleDragOver}
          className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3 hover:border-slate-300 transition-all shadow-sm group"
          style={{ cursor: onReorder ? 'grab' : 'default' }}
        >
          {/* Grip handle for reordering */}
          {onReorder && (
            <div className="text-slate-400 group-hover:text-slate-700 text-sm select-none">
              <i className="bi bi-grip-vertical"></i>
            </div>
          )}

          {/* Badge */}
          <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-black text-slate-800 flex-shrink-0 uppercase">
            {getFileExtension(file.name)}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-slate-900 text-xs font-bold truncate">{truncateFilename(file.name, 35)}</p>
            <p className="text-slate-400 text-[10px] mt-0.5">{formatFileSize(file.size)}</p>
          </div>

          {/* Order number */}
          <span className="text-[10px] font-bold text-slate-500 px-2 py-0.5 rounded bg-slate-50 border border-slate-200">
            #{idx + 1}
          </span>

          {/* Remove */}
          {onRemove && (
            <button
              type="button"
              onClick={() => onRemove(idx)}
              aria-label={`Remove ${file.name}`}
              className="w-7 h-7 rounded-lg bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 flex items-center justify-center text-xs transition-colors"
            >
              <i className="bi bi-x-lg"></i>
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
