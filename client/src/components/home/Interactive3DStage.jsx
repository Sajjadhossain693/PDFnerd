import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Interactive3DStage() {
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isExploded, setIsExploded] = useState(false);
  const [activeLayer, setActiveLayer] = useState(null);

  // Smooth mouse movement tracking relative to center
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const rotX = mousePos.y * -28;
  const rotY = mousePos.x * 32;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-2xl mx-auto aspect-[16/11] flex items-center justify-center select-none cursor-grab active:cursor-grabbing"
      style={{ perspective: '1400px' }}
    >
      {/* Dynamic Ambient Background Glow that tracks cursor */}
      <div
        className="absolute w-72 h-72 rounded-full blur-3xl pointer-events-none transition-all duration-300 opacity-30"
        style={{
          background: 'radial-gradient(circle, #3B82F6 0%, #10B981 50%, transparent 70%)',
          transform: `translate(${mousePos.x * 120}px, ${mousePos.y * 120}px)`,
        }}
      />

      {/* Floating Interactive 3D Orbiting Badges */}
      <motion.div
        animate={{
          y: [-6, 6, -6],
          rotate: [-2, 2, -2],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          transform: `translate3d(${mousePos.x * -40}px, ${mousePos.y * -40}px, 60px)`,
        }}
        className="absolute top-2 left-4 sm:left-8 z-40 bg-[#0D111C]/90 backdrop-blur-md border border-[#1E2638] p-3 rounded-2xl shadow-2xl flex items-center gap-2.5"
      >
        <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-emerald-500/20">
          <i className="bi bi-heart-pulse-fill"></i>
        </div>
        <div>
          <div className="text-[10px] font-bold text-zinc-400 uppercase">Health Score</div>
          <div className="text-xs font-black text-white flex items-center gap-1">
            <span>94/100</span>
            <span className="text-[10px] text-emerald-400 font-bold">(+22 healed)</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        animate={{
          y: [6, -6, 6],
          rotate: [2, -2, 2],
        }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        style={{
          transform: `translate3d(${mousePos.x * 45}px, ${mousePos.y * 45}px, 70px)`,
        }}
        className="absolute bottom-4 right-4 sm:right-8 z-40 bg-[#0D111C]/90 backdrop-blur-md border border-[#1E2638] p-3 rounded-2xl shadow-2xl flex items-center gap-2.5"
      >
        <div className="w-8 h-8 rounded-xl bg-[#FF6B4A] text-white flex items-center justify-center font-bold text-xs shadow-md shadow-orange-500/20">
          <i className="bi bi-stars"></i>
        </div>
        <div>
          <div className="text-[10px] font-bold text-zinc-400 uppercase">AI Study Deck</div>
          <div className="text-xs font-black text-white">10 MCQs & Flashcards</div>
        </div>
      </motion.div>

      {/* Main 3D Card Stack Container */}
      <div
        className="relative w-64 sm:w-80 aspect-[1/1.3] transition-transform duration-150 ease-out"
        style={{
          transform: `rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(-3deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* LAYER 1: BASE SHADOW CARD */}
        <div
          className="absolute inset-0 rounded-3xl bg-black/70 blur-2xl transition-all duration-300"
          style={{
            transform: 'translateZ(-40px)',
          }}
        />

        {/* LAYER 2: SECURITY & PRIVACY SHIELD LAYER */}
        <div
          onMouseEnter={() => setActiveLayer('privacy')}
          onMouseLeave={() => setActiveLayer(null)}
          className={`absolute inset-0 rounded-3xl p-5 border transition-all duration-500 shadow-2xl ${
            isExploded
              ? 'translate-x-12 -translate-y-12 bg-[#0D111C]/95 border-rose-500/40 text-white'
              : 'bg-[#0D111C]/80 border-[#1E2638] backdrop-blur-sm text-zinc-200'
          }`}
          style={{
            transform: isExploded
              ? 'translate3d(50px, -50px, -20px) rotateZ(6deg)'
              : 'translate3d(0px, 0px, 0px)',
            transformStyle: 'preserve-3d',
          }}
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#1E2638]">
            <span className="text-[10px] font-black uppercase text-rose-400 tracking-wider flex items-center gap-1">
              <i className="bi bi-shield-check"></i> Privacy Shield
            </span>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              Zero PII Leak
            </span>
          </div>
          <div className="py-4 text-[11px] text-zinc-400">
            <div className="font-bold text-white text-xs mb-1">Automated Sanitizer</div>
            Metadata scrubbed, comments purged, and phone/email tokens masked.
          </div>
        </div>

        {/* LAYER 3: COMPLIANCE & ACCESSIBILITY LAYER */}
        <div
          onMouseEnter={() => setActiveLayer('accessibility')}
          onMouseLeave={() => setActiveLayer(null)}
          className={`absolute inset-0 rounded-3xl p-5 border transition-all duration-500 shadow-2xl ${
            isExploded
              ? '-translate-x-12 translate-y-12 bg-[#0D111C]/95 border-purple-500/40 text-white'
              : 'bg-[#0D111C]/85 border-[#1E2638] backdrop-blur-sm text-zinc-200'
          }`}
          style={{
            transform: isExploded
              ? 'translate3d(-50px, 50px, 30px) rotateZ(-5deg)'
              : 'translate3d(0px, 0px, 15px)',
            transformStyle: 'preserve-3d',
          }}
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#1E2638]">
            <span className="text-[10px] font-black uppercase text-purple-400 tracking-wider flex items-center gap-1">
              <i className="bi bi-universal-access"></i> PDF/UA-1 & WCAG 2.2
            </span>
            <span className="text-[10px] font-bold text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">
              Conformant
            </span>
          </div>
          <div className="py-4 text-[11px] text-zinc-400">
            <div className="font-bold text-white text-xs mb-1">Structured Tree Verification</div>
            Tagged reading order, figure alternate text, and document title validated.
          </div>
        </div>

        {/* LAYER 4: HERO ACADEMIC COVER PAGE (TOP CARD) */}
        <div
          className={`absolute inset-0 rounded-3xl p-6 bg-[#0E1322] border-2 border-[#242C44] shadow-2xl flex flex-col justify-between transition-all duration-500 ${
            isExploded ? 'ring-2 ring-amber-400/40' : ''
          }`}
          style={{
            transform: isExploded ? 'translate3d(0px, 0px, 80px)' : 'translate3d(0px, 0px, 30px)',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Top Bar on Document */}
          <div className="text-center pt-1">
            <div className="w-8 h-8 rounded-full bg-[#1A2234] text-amber-400 border border-amber-400/30 mx-auto flex items-center justify-center font-bold text-[10px] mb-2 shadow-sm">
              DIU
            </div>
            <div className="text-[11px] font-black uppercase text-white tracking-wide">
              Daffodil International University
            </div>
            <div className="text-[9px] text-zinc-400 font-semibold">Department of CSE</div>
          </div>

          {/* Topic Title */}
          <div className="text-center my-auto py-2">
            <span className="inline-block text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 mb-1.5">
              Term Project Report
            </span>
            <h4 className="text-xs font-black text-white leading-snug px-2">
              Architectural Analysis of Resilient Cloud Pipelines
            </h4>
            <div className="text-[9px] font-semibold text-[#FF8E53] mt-1">[CSE 412] Distributed Systems</div>
          </div>

          {/* Metadata Footer */}
          <div className="border-t border-[#1E2638] pt-3 flex items-center justify-between text-[9px] text-zinc-400">
            <div>
              <span className="font-bold text-white block">Alex M. Turner</span>
              <span>ID: 211-15-4098</span>
            </div>
            <div className="text-right">
              <span className="font-bold text-white block">Prof. Dr. Syed Akhter</span>
              <span>Dean, CSE</span>
            </div>
          </div>

          {/* Interactive cursor sheen overlay */}
          <div
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{
              background: `radial-gradient(circle 200px at ${((mousePos.x + 0.5) * 100).toFixed(1)}% ${((mousePos.y + 0.5) * 100).toFixed(1)}%, rgba(255, 255, 255, 0.08), transparent 70%)`,
            }}
          />
        </div>
      </div>

      {/* Explode / 3D Mode Toggle Controls */}
      <div className="absolute bottom-0 inset-x-0 flex items-center justify-center gap-2 z-40">
        <button
          type="button"
          onClick={() => setIsExploded(!isExploded)}
          className="inline-flex items-center gap-1.5 bg-[#121622]/95 hover:bg-[#1C2232] text-zinc-200 hover:text-white border border-[#232B3D] px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-xl backdrop-blur-sm group"
        >
          <i className={`bi ${isExploded ? 'bi-stack' : 'bi-layers'} text-amber-400 group-hover:text-amber-300`}></i>
          <span>{isExploded ? 'Collapse 3D Stack' : 'Explode 3D Workspace Layers'}</span>
        </button>
      </div>
    </div>
  );
}
