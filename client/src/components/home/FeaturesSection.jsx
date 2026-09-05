import { Link } from 'react-router-dom';

const FEATURES = [
  {
    icon: 'bi-shield-lock-fill',
    title: 'Zero-Log Confidentiality',
    description: 'All file processing occurs in-memory with SSL encryption. Files are strictly erased after 60 minutes with zero data harvesting.',
    color: '#0F172A',
  },
  {
    icon: 'bi-lightning-charge-fill',
    title: 'High-Throughput Speed',
    description: 'Powered by streaming algorithms and pure client/server pipelines. Instant merges, compressions, and page rotations.',
    color: '#0F172A',
  },
  {
    icon: 'bi-patch-check-fill',
    title: '100% Free Core Suite',
    description: 'No trial periods, no hidden fees, and zero watermarks added to your documents. Unlimited core operations.',
    color: '#0F172A',
  },
  {
    icon: 'bi-phone-fill',
    title: 'Precision Mobile & Desktop',
    description: 'Meticulously crafted responsive interface. Work on your mobile phone, tablet, or high-resolution workstation.',
    color: '#0F172A',
  },
  {
    icon: 'bi-key-fill',
    title: 'Bank-Grade Cryptography',
    description: 'Protect sensitive files with robust encryption and remove access controls securely when authorized.',
    color: '#0F172A',
  },
  {
    icon: 'bi-cpu-fill',
    title: 'Open Source Reliability',
    description: 'Built upon battle-tested open-source libraries: pdf-lib, Express, and standard cryptographic primitives.',
    color: '#0F172A',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-16 bg-[#07090E] border-t border-[#161C28]">
      <div className="section-container">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121622] border border-[#232B3D] text-zinc-300 text-xs font-bold mb-3 shadow-sm">
            <i className="bi bi-asterisk text-xs text-amber-400"></i> Engineering Standards
          </span>
          <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight mt-1">
            Built for Care & Precision
          </h2>
          <p className="text-zinc-400 text-sm mt-2">
            Every PDF tool in the PDFinity suite follows stringent quality, privacy, and speed benchmarks.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {FEATURES.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#0D111C] border border-[#1E2638] rounded-2xl p-6 flex flex-col justify-between shadow-lg shadow-black/30 hover:border-zinc-500 hover:bg-[#121726] transition-all"
            >
              <div>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-4 bg-[#151A27] text-amber-400 border border-[#232B3D]"
                >
                  <i className={`bi ${item.icon}`}></i>
                </div>
                <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#1E2638] flex items-center gap-1.5 text-[11px] font-semibold text-zinc-300">
                <i className="bi bi-check2 text-emerald-400 font-bold"></i>
                <span>Active Standard</span>
              </div>
            </div>
          ))}
        </div>

        {/* Level Up Promo CTA Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0D111C] via-[#121726] to-[#151B2A] border border-[#1E2638] p-8 md:p-10 shadow-2xl">
          {/* Decorative Asterisk SVG in background */}
          <svg
            className="absolute -right-8 -bottom-8 w-60 h-60 opacity-5 pointer-events-none"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g transform="translate(50,50)">
              <rect x="-6" y="-45" width="12" height="90" rx="6" ry="6" fill="#FFFFFF" />
              <rect x="-6" y="-45" width="12" height="90" rx="6" ry="6" fill="#FFFFFF" transform="rotate(60)" />
              <rect x="-6" y="-45" width="12" height="90" rx="6" ry="6" fill="#FFFFFF" transform="rotate(120)" />
            </g>
          </svg>

          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#1E2638] border border-white/10 text-amber-300 text-xs font-bold mb-3">
              <i className="bi bi-arrow-up-right"></i> Promotion
            </span>
            <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-2">
              Level up your document management to the next level.
            </h3>
            <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
              Experience seamless batch processing, custom watermarks, encryption, and upcoming AI summaries without subscription paywalls.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link to="/tools" className="btn-lime text-xs font-bold uppercase tracking-wider py-3 px-6 shadow-lg shadow-orange-500/20">
                Check the Tools Now
              </Link>
              <Link to="/pricing" className="btn-forest-outline text-xs py-3 px-6">
                View Free vs Pro Limits
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
