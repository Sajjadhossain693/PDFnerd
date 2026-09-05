import { Link } from 'react-router-dom';
import SparkAsterisk from '../components/ui/SparkAsterisk';

export default function About() {
  return (
    <div className="min-h-screen py-16 bg-forest-grid">
      <div className="section-container max-w-4xl">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <SparkAsterisk className="w-6 h-6" fill="#B4F105" />
            <span className="text-lime-accent font-black tracking-tight text-lg">
              PDFmate Architecture
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Document Engineering with Care & Precision
          </h1>
          <p className="text-xs sm:text-sm text-forest-textMuted max-w-xl mx-auto mt-3">
            Built as a modern, high-speed, completely transparent alternative to ad-cluttered commercial PDF services.
          </p>
        </div>

        {/* Content Card */}
        <div className="space-y-6">
          <div className="spark-card p-8">
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <i className="bi bi-shield-check text-lime-accent"></i> The Zero-Compromise Privacy Model
            </h2>
            <p className="text-xs sm:text-sm text-forest-textMuted leading-relaxed">
              Most online PDF services rely on aggressive telemetry, retain user uploads for advertising, or inject watermarks onto your documents. PDFmate was engineered with an unyielding principle: your documents belong strictly to you. Every file uploaded is processed in an in-memory execution container and wiped permanently after 60 minutes.
            </p>
          </div>

          <div className="spark-card p-8">
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <i className="bi bi-cpu text-lime-accent"></i> Powered by Free & Open Source Tech
            </h2>
            <p className="text-xs sm:text-sm text-forest-textMuted leading-relaxed mb-4">
              We leverage pure JavaScript streaming with <code>pdf-lib</code>, Node.js, Express, Sharp, and Vite to eliminate costly external cloud APIs. This keeps the operational cost near $0 while delivering instantaneous response times.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-forest-dark border border-forest-border">
                <span className="text-xs font-bold text-white block">React + Vite</span>
                <span className="text-[10px] text-forest-textMuted">Frontend</span>
              </div>
              <div className="p-3 rounded-xl bg-forest-dark border border-forest-border">
                <span className="text-xs font-bold text-white block">Express + Node</span>
                <span className="text-[10px] text-forest-textMuted">Backend</span>
              </div>
              <div className="p-3 rounded-xl bg-forest-dark border border-forest-border">
                <span className="text-xs font-bold text-white block">pdf-lib</span>
                <span className="text-[10px] text-forest-textMuted">PDF Engine</span>
              </div>
              <div className="p-3 rounded-xl bg-forest-dark border border-forest-border">
                <span className="text-xs font-bold text-white block">MongoDB</span>
                <span className="text-[10px] text-forest-textMuted">History Atlas</span>
              </div>
            </div>
          </div>

          {/* Developer Card */}
          <div className="spark-card p-6 border-lime-accent/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-lime-accent text-forest-canvas flex items-center justify-center font-black text-base shadow-sm">
                S
              </div>
              <div>
                <span className="text-[10px] font-bold text-lime-accent uppercase tracking-wider block">
                  Lead Developer
                </span>
                <h3 className="text-sm font-bold text-white">Sajjad Hossain Siam</h3>
                <p className="text-xs text-forest-textMuted">Architect & Developer of PDFmate</p>
              </div>
            </div>

            <a
              href="mailto:dufferx99@gmail.com?subject=Contact%20Sajjad%20Hossain%20Siam%20-%20PDFmate"
              className="inline-flex items-center gap-2 py-2 px-4 rounded-xl bg-[#EA4335] hover:bg-[#d3382b] text-white text-xs font-bold transition-all shadow-md self-start sm:self-auto"
            >
              <i className="bi bi-envelope-fill"></i>
              <span>dufferx99@gmail.com</span>
            </a>
          </div>

          <div className="text-center pt-4">
            <Link to="/tools" className="btn-lime text-xs uppercase tracking-wider py-3 px-8 shadow-lime-glow">
              Explore Our Tools
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
