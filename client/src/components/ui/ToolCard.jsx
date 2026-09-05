import { Link } from 'react-router-dom';
import Tilt3DCard from './Tilt3DCard';

export default function ToolCard({ tool }) {
  const { name, description, to, icon, badge } = tool;

  return (
    <Tilt3DCard maxTilt={8} scale={1.02} className="h-full">
      <Link
        to={to}
        className="group flex flex-col justify-between h-full bg-[#0D111C] hover:bg-[#121726] border border-[#1E2638] hover:border-zinc-500 rounded-2xl p-5 transition-all duration-200 shadow-lg shadow-black/40"
      >
        <div className="flex items-start gap-4">
          {/* Icon wrapper */}
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 transition-transform duration-200 group-hover:scale-110 bg-[#151A27] border border-[#232B3D] text-amber-400 shadow-2xs"
          >
            <i className={`bi ${icon || 'bi-file-earmark'}`}></i>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <h3 className="font-bold text-white text-base group-hover:text-amber-400 transition-colors truncate">
                {name}
              </h3>
              {badge && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-[#1E2638] text-zinc-300 border border-white/10 flex-shrink-0">
                  {badge}
                </span>
              )}
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed line-clamp-2">
              {description}
            </p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#1E2638] flex items-center justify-between text-xs text-zinc-400 group-hover:text-amber-400 transition-colors">
          <span className="font-medium">Execute Utility</span>
          <i className="bi bi-arrow-right transition-transform group-hover:translate-x-1"></i>
        </div>
      </Link>
    </Tilt3DCard>
  );
}
