export default function ProgressBar({ progress = 0, label = 'Processing with precision...' }) {
  return (
    <div className="bg-forest-card border border-forest-border rounded-2xl p-6 text-center shadow-forest-card">
      <div className="w-10 h-10 rounded-xl bg-lime-accent/15 text-lime-accent border border-lime-accent/30 flex items-center justify-center text-lg mx-auto mb-3 animate-spin">
        <i className="bi bi-arrow-repeat"></i>
      </div>

      <h4 className="text-white font-bold text-sm mb-1">{label}</h4>
      <p className="text-forest-textMuted text-xs mb-4">
        Applying algorithms · Do not close this window
      </p>

      {/* Bar container */}
      <div className="w-full bg-forest-dark rounded-full h-2.5 overflow-hidden border border-forest-borderMuted">
        <div
          className="h-full bg-lime-accent rounded-full transition-all duration-300 shadow-lime-glow"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-[11px] font-bold text-forest-textMuted mt-2 px-1">
        <span>Processing Pipeline</span>
        <span className="text-lime-accent">{Math.round(progress)}%</span>
      </div>
    </div>
  );
}
