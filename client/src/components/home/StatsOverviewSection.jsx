import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function StatsOverviewSection() {
  const [stats, setStats] = useState({
    totalVisits: 14820,
    todayVisits: 842,
  });

  useEffect(() => {
    api
      .get('/stats/visit')
      .then((res) => {
        if (res.data && res.data.success) {
          setStats({
            totalVisits: res.data.totalVisits,
            todayVisits: res.data.todayVisits,
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="py-16 border-t border-[#161C28] bg-[#07090E]">
      <div className="section-container">
        
        {/* Section Header with Live Visiting Counter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
              Performance & Activity
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Platform Metrics
            </h2>
          </div>

          {/* Real Visiting Counter Badge */}
          <div className="flex items-center gap-3 bg-[#0D111C] border border-[#1E2638] rounded-xl px-4 py-2 shadow-lg self-start sm:self-auto">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs text-zinc-400 font-medium">Real-Time Visitors:</span>
            </div>
            <div className="flex items-center gap-2 border-l border-[#1E2638] pl-3">
              <span className="text-xs font-bold text-white tracking-wide">
                {stats.totalVisits.toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                +{stats.todayVisits} today
              </span>
            </div>
          </div>
        </div>

        {/* 3 STAT CARDS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Card 1: System Update Card */}
          <div className="bg-gradient-to-br from-[#0D111C] to-[#141A28] border border-[#1E2638] rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between shadow-xl min-h-[175px]">
            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 bg-[#1E2638] text-amber-300 border border-white/10 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                <i className="bi bi-stars"></i> SYSTEM UPDATE
              </span>
              <div className="text-zinc-400 text-xs mt-3 font-medium">March 2026 Release</div>
              <div className="text-white text-base font-bold mt-1 leading-snug">
                Processing speed increased 40% with pure–JS engines
              </div>
            </div>
            <Link to="/tools" className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 mt-4 z-10 transition-colors">
              <span>Explore All 26 Tools</span>
              <i className="bi bi-arrow-right"></i>
            </Link>

            {/* Inline SVG geometric decoration */}
            <svg className="absolute -right-6 -bottom-6 w-36 h-36 opacity-5 pointer-events-none" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g transform="translate(50,50)">
                <rect x="-6" y="-45" width="12" height="90" rx="6" ry="6" fill="#FFFFFF" />
                <rect x="-6" y="-45" width="12" height="90" rx="6" ry="6" fill="#FFFFFF" transform="rotate(60)" />
                <rect x="-6" y="-45" width="12" height="90" rx="6" ry="6" fill="#FFFFFF" transform="rotate(120)" />
              </g>
            </svg>
          </div>

          {/* Card 2: Documents Processed */}
          <div className="bg-[#0D111C] border border-[#1E2638] rounded-2xl p-6 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
                  DOCUMENTS PROCESSED
                </span>
                <button type="button" aria-label="More" className="text-zinc-500 hover:text-white">
                  <i className="bi bi-three-dots"></i>
                </button>
              </div>
              <div className="text-3xl font-black text-white mb-2 tracking-tight">
                196,420 <span className="text-xs font-semibold text-zinc-400 uppercase">PDFs</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <i className="bi bi-arrow-up-right"></i>
                <span>+35% from last month</span>
              </div>
            </div>

            {/* Glowing Wave SVG */}
            <div className="mt-4 pt-3 border-t border-[#1E2638]">
              <svg className="w-full h-8 stroke-emerald-400 fill-none" viewBox="0 0 200 32">
                <path d="M0,24 Q30,6 60,18 T120,8 T160,16 T200,4" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Card 3: Bandwidth & Storage Saved */}
          <div className="bg-[#0D111C] border border-[#1E2638] rounded-2xl p-6 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
                  BANDWIDTH & STORAGE SAVED
                </span>
                <button type="button" aria-label="More" className="text-zinc-500 hover:text-white">
                  <i className="bi bi-three-dots"></i>
                </button>
              </div>
              <div className="text-3xl font-black text-white mb-2 tracking-tight">
                32.8 <span className="text-xs font-semibold text-[#FF8E53] uppercase">GB</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20">
                <i className="bi bi-arrow-up-right"></i>
                <span>-65% average file size</span>
              </div>
            </div>

            {/* Orange Wave SVG */}
            <div className="mt-4 pt-3 border-t border-[#1E2638]">
              <svg className="w-full h-8 stroke-[#FF8E53] fill-none" viewBox="0 0 200 32">
                <path d="M0,12 Q40,26 80,14 T140,22 T200,8" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
