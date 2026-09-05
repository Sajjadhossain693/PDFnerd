import { Link } from 'react-router-dom';
import SparkAsterisk from '../components/ui/SparkAsterisk';

export default function Pricing() {
  return (
    <div className="min-h-screen py-16 bg-forest-grid">
      <div className="section-container max-w-5xl">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="alert-green-badge mb-3">
            <i className="bi bi-tag-fill"></i> Subscription Architecture
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-1">
            Transparent, Honest Pricing
          </h1>
          <p className="text-xs sm:text-sm text-forest-textMuted mt-3">
            Start with our generous free tier or upgrade for heavy batch processing and enterprise limits.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          
          {/* Free Tier Card */}
          <div className="spark-card p-8 border-forest-border flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-forest-textMuted uppercase tracking-wider">
                  Community Tier
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-forest-light text-white border border-forest-border">
                  Standard
                </span>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-black text-white">$0</span>
                <span className="text-xs text-forest-textMuted ml-2 font-medium">/ forever free</span>
                <p className="text-xs text-forest-textMuted mt-2">
                  Everything you need for everyday document edits and standard tasks.
                </p>
              </div>

              <div className="space-y-3 text-xs text-forest-textMuted mb-8">
                <div className="flex items-center gap-2.5 text-white">
                  <i className="bi bi-check2 text-lime-accent font-bold"></i>
                  <span>All 26 PDF utilities included</span>
                </div>
                <div className="flex items-center gap-2.5 text-white">
                  <i className="bi bi-check2 text-lime-accent font-bold"></i>
                  <span>10 MB max file size per document</span>
                </div>
                <div className="flex items-center gap-2.5 text-white">
                  <i className="bi bi-check2 text-lime-accent font-bold"></i>
                  <span>Up to 20 files per merge batch</span>
                </div>
                <div className="flex items-center gap-2.5 text-white">
                  <i className="bi bi-check2 text-lime-accent font-bold"></i>
                  <span>Zero watermarks added</span>
                </div>
                <div className="flex items-center gap-2.5 text-white">
                  <i className="bi bi-check2 text-lime-accent font-bold"></i>
                  <span>Automatic 60-minute file purge</span>
                </div>
              </div>
            </div>

            <Link
              to="/tools"
              className="btn-forest-outline w-full text-xs uppercase tracking-wider py-3 text-center"
            >
              Get Started Free
            </Link>
          </div>

          {/* Pro Tier Card */}
          <div className="spark-card p-8 border-lime-accent/50 relative overflow-hidden flex flex-col justify-between shadow-lime-glow">
            {/* Background shape */}
            <svg
              className="alert-green-bg-shape opacity-10"
              viewBox="0 0 100 100"
              fill="none"
            >
              <g transform="translate(50,50)">
                <rect x="-6" y="-45" width="12" height="90" rx="6" ry="6" fill="#B4F105" />
                <rect x="-6" y="-45" width="12" height="90" rx="6" ry="6" fill="#B4F105" transform="rotate(60)" />
                <rect x="-6" y="-45" width="12" height="90" rx="6" ry="6" fill="#B4F105" transform="rotate(120)" />
              </g>
            </svg>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-lime-accent uppercase tracking-wider">
                  Power Tier
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-lime-accent/20 text-lime-accent border border-lime-accent/40">
                  Most Popular
                </span>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-black text-white">$9</span>
                <span className="text-xs text-forest-textMuted ml-2 font-medium">/ month</span>
                <p className="text-xs text-forest-textMuted mt-2">
                  Uncapped performance for high-volume enterprise and research workflows.
                </p>
              </div>

              <div className="space-y-3 text-xs text-forest-textMuted mb-8">
                <div className="flex items-center gap-2.5 text-white">
                  <i className="bi bi-check2 text-lime-accent font-bold"></i>
                  <span><strong>100 MB</strong> max file size per document</span>
                </div>
                <div className="flex items-center gap-2.5 text-white">
                  <i className="bi bi-check2 text-lime-accent font-bold"></i>
                  <span><strong>50+ files</strong> per batch merge</span>
                </div>
                <div className="flex items-center gap-2.5 text-white">
                  <i className="bi bi-check2 text-lime-accent font-bold"></i>
                  <span>High-priority dedicated processing lane</span>
                </div>
                <div className="flex items-center gap-2.5 text-white">
                  <i className="bi bi-check2 text-lime-accent font-bold"></i>
                  <span>Full OCR & Structured Data extraction</span>
                </div>
                <div className="flex items-center gap-2.5 text-white">
                  <i className="bi bi-check2 text-lime-accent font-bold"></i>
                  <span>AI Summary & Ask Questions PDF suite</span>
                </div>
              </div>
            </div>

            <Link
              to="/register"
              className="btn-lime w-full text-xs uppercase tracking-wider py-3 text-center shadow-lime-glow"
            >
              Upgrade to Pro (Early Access)
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
