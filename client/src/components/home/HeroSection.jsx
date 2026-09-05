import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Interactive3DStage from './Interactive3DStage';
import Tilt3DCard from '../ui/Tilt3DCard';

export default function HeroSection() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/tools?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/tools');
    }
  };

  const workspaces = [
    { to: '/academic', title: 'Academic Studio', desc: 'Cover creator & multi-page doc builder', icon: 'bi-mortarboard-fill', color: 'text-amber-400', bg: 'bg-amber-500/10', badge: 'Creator' },
    { to: '/health', title: 'PDF Health & Doctor', desc: '0-100 diagnostic & automated healing', icon: 'bi-heart-pulse-fill', color: 'text-emerald-400', bg: 'bg-emerald-500/10', badge: 'Intelligence' },
    { to: '/accessibility', title: 'Accessibility & Compliance', desc: 'PDF/UA-1 & WCAG 2.2 audit rules', icon: 'bi-universal-access', color: 'text-purple-400', bg: 'bg-purple-500/10', badge: 'Standards' },
    { to: '/privacy-scanner', title: 'Privacy & Security', desc: 'PII detection & document sanitization', icon: 'bi-shield-check', color: 'text-rose-400', bg: 'bg-rose-500/10', badge: 'Security' },
    { to: '/study', title: 'Exam & Study Mode', desc: 'Summary, 3D flashcards & MCQ quiz', icon: 'bi-book-half', color: 'text-cyan-400', bg: 'bg-cyan-500/10', badge: 'Study Kit' },
    { to: '/workflows', title: 'One-Click Workflows', desc: 'Chained pipelines executed in 1 click', icon: 'bi-diagram-3-fill', color: 'text-orange-400', bg: 'bg-orange-500/10', badge: 'Automation' },
  ];

  const popularChips = [
    { label: 'Getting Started', to: '/tools' },
    { label: 'Academic Studio', to: '/academic' },
    { label: 'PDF Health', to: '/health' },
    { label: 'Privacy Shield', to: '/privacy-scanner' },
    { label: 'Study Mode', to: '/study' },
    { label: 'Configurations', to: '/workflows' },
  ];

  return (
    <section className="relative pt-24 pb-20 bg-forest-grid overflow-hidden min-h-screen flex flex-col justify-center">
      
      {/* ─── SCREENSHOT-MATCHED HONEYCOMB SVG PATTERN (TOP-LEFT) ─── */}
      <div className="absolute top-0 left-0 w-96 h-96 pointer-events-none opacity-20 z-0">
        <svg viewBox="0 0 400 400" className="w-full h-full stroke-[#2A354D] fill-transparent">
          <defs>
            <pattern id="hex-pattern" width="56" height="96" patternUnits="userSpaceOnUse" patternTransform="scale(1)">
              <path
                d="M28 0 L56 16 L56 48 L28 64 L0 48 L0 16 Z M28 48 L56 64 L56 96 L28 112 L0 96 L0 64 Z"
                strokeWidth="1.2"
                stroke="rgba(255,255,255,0.12)"
                fill="none"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hex-pattern)" />
        </svg>
      </div>

      {/* Background Ambient Glows Matching Screenshot */}
      <div className="absolute top-10 right-1/4 w-[500px] h-[300px] bg-gradient-to-br from-amber-500/12 via-orange-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-20 right-5 w-[350px] h-[350px] bg-purple-600/8 blur-3xl pointer-events-none rounded-full" />

      <div className="section-container relative z-10">
        
        {/* Main Hero Header */}
        <div className="max-w-4xl mx-auto text-center pt-2 pb-4">
          
          {/* EXACT HEADLINE: "PDF [motion shape stuff] nerd" */}
          <div className="flex items-center justify-center gap-3.5 sm:gap-5 flex-wrap">
            <span className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight select-none">
              PDF
            </span>

            {/* THE 3D MOTION SHAPE (Tilted glowing 3D document badge with floating animation) */}
            <motion.div
              className="inline-flex items-center justify-center cursor-pointer"
              animate={{
                y: [0, -7, 0],
                rotate: [-14, -8, -14],
              }}
              transition={{
                duration: 3.8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              whileHover={{
                scale: 1.15,
                rotate: 0,
                transition: { duration: 0.25 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-13 h-13 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-[16px] sm:rounded-[20px] bg-gradient-to-br from-[#FF4E64] via-[#FF6E51] to-[#FFA07A] p-[2px] shadow-[0_12px_32px_rgba(255,94,98,0.45)] relative overflow-hidden group">
                {/* Glossy top sheen highlight */}
                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/35 to-transparent rounded-t-[14px] pointer-events-none" />
                
                {/* Inner document surface */}
                <div className="w-full h-full rounded-[14px] sm:rounded-[18px] bg-gradient-to-b from-[#FF5E62] to-[#FF8E53] flex flex-col items-center justify-center gap-1.5 sm:gap-2 px-3 shadow-inner">
                  {/* Document stripes */}
                  <div className="h-1.5 w-full bg-white/95 rounded-full shadow-xs" />
                  <div className="h-1.5 w-4/5 bg-white/90 rounded-full shadow-xs self-start" />
                  <div className="h-1.5 w-3/5 bg-white/85 rounded-full shadow-xs self-start" />
                </div>
              </div>
            </motion.div>

            <span className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight select-none">
              nerd
            </span>
          </div>

          {/* Sub-headline: Large Muted Text (just like "developers love" in the screenshot) */}
          <div className="text-3xl sm:text-5xl md:text-6xl font-black text-[#52525B] tracking-tight mt-1 sm:mt-2 select-none">
            workspace you love
          </div>

          {/* Subtitle description */}
          <p className="text-zinc-400 text-sm sm:text-base mt-4 max-w-xl mx-auto leading-relaxed">
            Discover tips, resources, and guidance to maximize experience with PDFinity.
          </p>

          {/* ─── SCREENSHOT-MATCHED SEARCH BAR (DARK PILL WITH CTRL+K) ─── */}
          <form onSubmit={handleSearchSubmit} className="mt-8 max-w-xl mx-auto">
            <div className="relative flex items-center bg-[#121622] hover:bg-[#161B29] border border-[#232B3D] focus-within:border-zinc-500 rounded-xl px-4 py-2.5 sm:py-3 shadow-xl shadow-black/50 transition-all">
              <i className="bi bi-search text-zinc-400 text-sm mr-3"></i>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search PDF tools, workspaces, guides..."
                className="w-full bg-transparent text-sm text-white placeholder-zinc-500 outline-none"
              />
              <div className="hidden sm:flex items-center gap-1 bg-[#1A202E] border border-white/5 text-zinc-400 text-[11px] font-mono px-2 py-0.5 rounded ml-2 shrink-0">
                <span>Ctrl</span>
                <span>K</span>
              </div>
              <button
                type="submit"
                className="ml-2.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#FF5E62] to-[#FF8E53] hover:opacity-90 text-white text-xs font-bold transition-all shadow-sm shrink-0 flex items-center gap-1.5"
              >
                <span>Search</span>
                <i className="bi bi-arrow-right text-[11px]"></i>
              </button>
            </div>
          </form>

          {/* ─── SCREENSHOT-MATCHED POPULAR TAG CHIPS ─── */}
          <div className="flex items-center justify-center gap-2 mt-4 flex-wrap text-xs">
            <span className="text-zinc-500 font-medium">Popular:</span>
            {popularChips.map((chip, idx) => (
              <Link
                key={idx}
                to={chip.to}
                className="bg-[#121622] hover:bg-[#1C2232] text-zinc-300 hover:text-white border border-[#232938] hover:border-zinc-500 px-3 py-1 rounded-lg text-xs font-medium transition-all shadow-xs"
              >
                {chip.label}
              </Link>
            ))}
          </div>

          {/* Quick Action Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-7">
            <Link
              to="/academic"
              className="btn-lime text-xs uppercase tracking-wider py-3 px-5 shadow-lg shadow-orange-500/20"
            >
              <i className="bi bi-mortarboard-fill"></i>
              <span>Academic Studio</span>
            </Link>

            <Link
              to="/workspace"
              className="btn-outline-primary text-xs uppercase tracking-wider py-3 px-5"
            >
              <i className="bi bi-briefcase-fill text-white"></i>
              <span>Document Tray</span>
            </Link>

            <Link
              to="/health"
              className="inline-flex items-center gap-2 text-xs font-bold text-zinc-300 hover:text-white bg-[#121622] hover:bg-[#1A2030] border border-[#232B3D] px-4 py-3 rounded-xl transition-all"
            >
              <i className="bi bi-heart-pulse text-emerald-400"></i>
              <span>PDF Health Score</span>
            </Link>
          </div>

        </div>

        {/* ─── INTERACTIVE 3D DOCUMENT STAGE SHOWCASE ─── */}
        <div className="mt-8 mb-14">
          <div className="text-center mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 flex items-center justify-center gap-1.5">
              <i className="bi bi-mouse text-zinc-400"></i> Move your cursor to rotate and explore document depth in 3D
            </span>
          </div>
          <Interactive3DStage />
        </div>

        {/* Section Heading */}
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded">
              Cursor-Reactive Grid
            </span>
            <h2 className="text-xl font-black text-white mt-1">Specialized Workspaces</h2>
          </div>
          <p className="text-xs text-zinc-400">Hover over cards for 3D tilt and cursor spotlight sheen</p>
        </div>

        {/* 6 Core Workspaces Grid with Cursor-Driven 3D Tilt */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {workspaces.map((w, i) => (
            <Tilt3DCard key={i} maxTilt={10} scale={1.03}>
              <Link
                to={w.to}
                className="p-5 rounded-3xl bg-[#0D111C] border border-[#1E2638] shadow-xl hover:border-zinc-500 hover:bg-[#121726] transition-all flex flex-col justify-between h-full group text-left relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-12 h-12 rounded-2xl ${w.bg} flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform shadow-xs`}>
                      <i className={`bi ${w.icon} ${w.color}`}></i>
                    </div>
                    <span className="text-[10px] font-bold text-zinc-400 bg-[#161D2B] border border-white/5 px-2.5 py-1 rounded-full group-hover:bg-zinc-800 group-hover:text-white transition-colors">
                      {w.badge}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                    {w.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{w.desc}</p>
                </div>

                <div className="pt-4 mt-3 border-t border-[#1E2638] flex items-center justify-between text-xs font-bold text-zinc-300 group-hover:text-amber-400">
                  <span>Enter Workspace</span>
                  <i className="bi bi-arrow-right transition-transform group-hover:translate-x-1"></i>
                </div>
              </Link>
            </Tilt3DCard>
          ))}
        </div>

      </div>
    </section>
  );
}
