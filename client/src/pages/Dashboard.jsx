import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import SparkAsterisk from '../components/ui/SparkAsterisk';

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch real user history from backend
  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      api
        .get('/pdf/history')
        .then((res) => {
          if (res.data.success && res.data.history.length > 0) {
            setHistory(res.data.history);
          } else {
            // Default sample items if new user
            setHistory(defaultHistory);
          }
        })
        .catch(() => {
          setHistory(defaultHistory);
        })
        .finally(() => setLoading(false));
    } else {
      setHistory(defaultHistory);
    }
  }, [isAuthenticated]);

  const defaultHistory = [
    {
      _id: '1',
      toolUsed: 'merge',
      originalFileName: 'Q1_Financial_Report_Consolidated.pdf',
      createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      fileSizeBytes: 4200000,
      outputSizeBytes: 3800000,
      status: 'success',
      icon: 'bi-files',
    },
    {
      _id: '2',
      toolUsed: 'compress',
      originalFileName: 'Product_Catalog_2026_HighRes.pdf',
      createdAt: new Date(Date.now() - 1000 * 60 * 65).toISOString(),
      fileSizeBytes: 12500000,
      outputSizeBytes: 4200000,
      status: 'success',
      icon: 'bi-file-zip',
    },
    {
      _id: '3',
      toolUsed: 'jpg-to-pdf',
      originalFileName: 'Expense_Receipts_March_Bundle.pdf',
      createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      fileSizeBytes: 8400000,
      outputSizeBytes: 3100000,
      status: 'success',
      icon: 'bi-file-earmark-image',
    },
    {
      _id: '4',
      toolUsed: 'protect',
      originalFileName: 'Confidential_Executive_Agreement.pdf',
      createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
      fileSizeBytes: 2100000,
      outputSizeBytes: 2150000,
      status: 'success',
      icon: 'bi-shield-lock',
    },
  ];

  const handleDeleteItem = (id) => {
    if (isAuthenticated) {
      api.delete(`/pdf/history/${id}`).catch(() => {});
    }
    setHistory((prev) => prev.filter((item) => item._id !== id));
    toast.success('History entry removed');
  };

  return (
    <div className="min-h-screen bg-forest-canvas pb-20">
      <div className="section-container pt-8">
        
        {/* START: Dashboard Header Banner matching PDFinity */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-forest-border">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lime-accent text-xs font-bold uppercase tracking-wider">
                PDFinity Workspace Console
              </span>
              <span className="text-forest-border">•</span>
              <span className="text-xs text-forest-textMuted font-medium">
                {user ? `${user.name} (${user.plan.toUpperCase()} Plan)` : 'Guest Session'}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Intelligent Workspace Dashboard
            </h1>
            <p className="text-forest-textMuted text-xs sm:text-sm mt-1">
              An intelligent document workspace for students, professionals, and everyday PDF tasks.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/workspace"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-forest-card border border-forest-border text-xs font-semibold text-white hover:bg-slate-50 transition-colors"
            >
              <i className="bi bi-briefcase text-emerald-600"></i>
              <span>Open Working Tray</span>
            </Link>
          </div>
        </div>
        {/* END: Dashboard Header Banner */}

        {/* START: Main Layout Grid (2 Columns: Dashboard + Performance Pane) */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

          {/* TOP & LEFT AREA (9 cols on xl) */}
          <div className="xl:col-span-9 space-y-6">
            
            {/* TOP AREA: Quick Info Stat Cards Row (Full Width) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              {/* Stat Card 1: Green Alert Banner */}
              <div className="alert-green-card">
                <div className="relative z-10">
                  <span className="alert-green-badge">
                    <i className="bi bi-asterisk"></i> Update
                  </span>
                  <div className="alert-green-date">March 14th 2026</div>
                  <div className="alert-green-text">
                    File processing throughput increased 40% in 1 week
                  </div>
                </div>
                <Link to="/tools" className="alert-green-link z-10">
                  <span>See All Tools</span>
                  <i className="bi bi-arrow-right"></i>
                </Link>

                {/* Inline SVG geometric decoration */}
                <svg className="alert-green-bg-shape" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g transform="translate(50,50)">
                    <rect x="-6" y="-45" width="12" height="90" rx="6" ry="6" fill="#B4F105" />
                    <rect x="-6" y="-45" width="12" height="90" rx="6" ry="6" fill="#B4F105" transform="rotate(60)" />
                    <rect x="-6" y="-45" width="12" height="90" rx="6" ry="6" fill="#B4F105" transform="rotate(120)" />
                  </g>
                </svg>
              </div>

              {/* Stat Card 2: Net Documents Processed */}
              <div className="spark-card p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-forest-textMuted font-bold uppercase tracking-wider">
                      Documents Converted
                    </span>
                    <button type="button" aria-label="More" className="text-forest-textMuted hover:text-white">
                      <i className="bi bi-three-dots"></i>
                    </button>
                  </div>
                  <div className="text-3xl font-black text-white mb-2">
                    196,420
                  </div>
                  <div className="trend-badge trend-up">
                    <i className="bi bi-arrow-up-right"></i>
                    <span>+35% from last month</span>
                  </div>
                </div>
                {/* SVG sparkline */}
                <div className="mt-4 pt-3 border-t border-forest-borderMuted">
                  <svg className="w-full h-8 stroke-lime-accent fill-none" viewBox="0 0 200 32">
                    <path d="M0,24 Q30,6 60,18 T120,8 T160,16 T200,4" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>
              </div>

              {/* Stat Card 3: Storage Bandwidth Saved */}
              <div className="spark-card p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-forest-textMuted font-bold uppercase tracking-wider">
                      Bandwidth Saved
                    </span>
                    <button type="button" aria-label="More" className="text-forest-textMuted hover:text-white">
                      <i className="bi bi-three-dots"></i>
                    </button>
                  </div>
                  <div className="text-3xl font-black text-white mb-2">
                    32.0 <span className="text-sm font-semibold text-lime-accent">GB</span>
                  </div>
                  <div className="trend-badge trend-down">
                    <i className="bi bi-arrow-down-left"></i>
                    <span>-24% average size</span>
                  </div>
                </div>
                {/* SVG sparkline */}
                <div className="mt-4 pt-3 border-t border-forest-borderMuted">
                  <svg className="w-full h-8 stroke-brand-orange fill-none" viewBox="0 0 200 32">
                    <path d="M0,8 Q40,24 80,12 T140,20 T200,6" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>
              </div>

            </div>

            {/* SPECIALIZED WORKSPACES HUB */}
            <div className="spark-card p-6">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-forest-border">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Intelligent Suites
                  </span>
                  <h2 className="text-lg font-black text-slate-900 mt-1">Specialized Workspaces</h2>
                </div>
                <Link to="/workspace" className="text-xs font-bold text-blue-600 hover:text-blue-800">
                  Open Working Tray →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { to: '/academic', title: 'Academic Studio', desc: 'Cover creator & multi-page doc builder', icon: 'bi-mortarboard', color: 'text-blue-600' },
                  { to: '/health', title: 'PDF Health & Doctor', desc: '0-100 diagnostic & automated healing', icon: 'bi-heart-pulse', color: 'text-emerald-600' },
                  { to: '/accessibility', title: 'Accessibility Compliance', desc: 'PDF/UA-1 & WCAG 2.2 audit rules', icon: 'bi-universal-access', color: 'text-purple-600' },
                  { to: '/privacy-scanner', title: 'Privacy Scanner', desc: 'PII detection & document sanitization', icon: 'bi-shield-check', color: 'text-rose-600' },
                  { to: '/study', title: 'Exam & Study Mode', desc: 'Summary, flashcard decks & MCQ quiz', icon: 'bi-book-half', color: 'text-indigo-600' },
                  { to: '/workflows', title: 'One-Click Workflows', desc: 'Chained pipelines executed in 1 click', icon: 'bi-diagram-3', color: 'text-amber-600' },
                ].map((ws, i) => (
                  <Link
                    key={i}
                    to={ws.to}
                    className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all flex items-start gap-3 group text-left"
                  >
                    <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-base shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                      <i className={`bi ${ws.icon} ${ws.color}`}></i>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {ws.title}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{ws.desc}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* REVENUE / PROCESSING CHART COMPONENT */}
            <div className="spark-card p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-lg font-black text-white">Daily Throughput Activity</h2>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-white">196,420 MB</span>
                    <span className="trend-badge trend-up text-[10px]">+35% from last month</span>
                  </div>
                </div>

                {/* Custom Legends */}
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-forest-medium border border-forest-border"></span>
                    <span className="text-forest-textMuted font-medium">Input Volume</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-lime-accent shadow-lime-glow"></span>
                    <span className="text-forest-textMuted font-medium">Optimized Output</span>
                  </div>
                </div>
              </div>

              {/* Graphic Activity Chart */}
              <div className="w-full h-44 relative flex items-end justify-between gap-2 pt-6 px-2">
                {[
                  { day: 'Mon', inH: 60, outH: 35 },
                  { day: 'Tue', inH: 80, outH: 45 },
                  { day: 'Wed', inH: 95, outH: 52 },
                  { day: 'Thu', inH: 70, outH: 40 },
                  { day: 'Fri', inH: 110, outH: 65 },
                  { day: 'Sat', inH: 55, outH: 30 },
                  { day: 'Sun', inH: 75, outH: 42 },
                ].map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="w-full max-w-[28px] flex items-end justify-center gap-1 h-full">
                      <div
                        className="w-1/2 bg-forest-medium rounded-t-sm transition-all group-hover:bg-forest-light"
                        style={{ height: `${item.inH}%` }}
                        title={`Input: ${item.inH} MB`}
                      />
                      <div
                        className="w-1/2 bg-lime-accent rounded-t-sm shadow-lime-glow transition-all group-hover:brightness-110"
                        style={{ height: `${item.outH}%` }}
                        title={`Output: ${item.outH} MB`}
                      />
                    </div>
                    <span className="text-[10px] text-forest-textMuted font-semibold">{item.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* DETAILS AREA: Transactions List + Product Overview Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Column: Transaction / Recent Processing History List (7 cols) */}
              <div className="lg:col-span-7 spark-card p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-black text-white">Recent Operations</h2>
                    <div className="flex items-center gap-2">
                      <Link
                        to="/tools"
                        className="text-xs text-lime-accent font-semibold hover:underline"
                      >
                        + New Operation
                      </Link>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {history.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center justify-between p-3 rounded-xl bg-forest-dark border border-forest-borderMuted hover:border-lime-accent/30 transition-all"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-lg bg-forest-light text-lime-accent flex items-center justify-center text-base flex-shrink-0">
                            <i className={`bi ${item.icon || 'bi-file-earmark-check'}`}></i>
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white truncate max-w-[180px] sm:max-w-[220px]">
                              {item.originalFileName}
                            </p>
                            <p className="text-[10px] text-forest-textMuted">
                              {new Date(item.createdAt).toLocaleDateString()} • {item.toolUsed.toUpperCase()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs font-bold text-lime-accent">
                            {Math.round((item.outputSizeBytes || item.fileSizeBytes) / 1024)} KB
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteItem(item._id)}
                            aria-label="Delete entry"
                            className="w-7 h-7 rounded-lg bg-forest-canvas hover:bg-red-500/20 text-forest-textMuted hover:text-red-400 flex items-center justify-center text-xs transition-colors"
                          >
                            <i className="bi bi-trash3"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-forest-borderMuted text-center">
                  <span className="text-[11px] text-forest-textMuted">
                    Files auto-deleted from server memory 60 mins after conversion.
                  </span>
                </div>
              </div>

              {/* Column: Product / Tool Overview Progress (5 cols) */}
              <div className="lg:col-span-5 spark-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-black text-white">Tool Breakdown</h2>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-lime-accent/15 text-lime-accent">
                    Active
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Item 1 */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-forest-textMuted">Merge Operations</span>
                      <span className="text-white">233</span>
                    </div>
                    <div className="w-full bg-forest-dark rounded-full h-2 overflow-hidden">
                      <div className="bg-lime-accent h-full rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-forest-textMuted">Compress Reductions</span>
                      <span className="text-white">23</span>
                    </div>
                    <div className="w-full bg-forest-dark rounded-full h-2 overflow-hidden">
                      <div className="bg-lime-accent/50 h-full rounded-full" style={{ width: '40%' }}></div>
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-forest-textMuted">Conversions (JPG/PDF)</span>
                      <span className="text-white">482</span>
                    </div>
                    <div className="w-full bg-forest-dark rounded-full h-2 overflow-hidden">
                      <div className="bg-lime-accent h-full rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>

                  {/* Item 4 */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-forest-textMuted">Protected & Encrypted</span>
                      <span className="text-white">18</span>
                    </div>
                    <div className="w-full bg-forest-dark rounded-full h-2 overflow-hidden">
                      <div className="bg-brand-orange h-full rounded-full" style={{ width: '30%' }}></div>
                    </div>
                  </div>

                  {/* Item 5 */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-forest-textMuted">Total In-Memory Buffer</span>
                      <span className="text-white">1,420 MB</span>
                    </div>
                    <div className="w-full bg-forest-dark rounded-full h-2 overflow-hidden">
                      <div className="bg-lime-accent h-full rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* RIGHT AREA: Performance Details Sidebar Panel (3 cols on xl) */}
          <div className="xl:col-span-3 space-y-6">
            
            {/* Total View / Tool Performance Donut Chart card */}
            <div className="spark-card p-6 flex flex-col justify-between">
              <div className="mb-4">
                <h2 className="text-base font-black text-white">Platform Performance</h2>
                <p className="text-[11px] text-forest-textMuted">Global distribution metrics</p>
              </div>

              {/* Visual Circular/Donut Graphic */}
              <div className="relative w-36 h-36 mx-auto my-2 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="38" stroke="#162E25" strokeWidth="10" fill="none" />
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    stroke="#B4F105"
                    strokeWidth="10"
                    strokeDasharray="238"
                    strokeDashoffset="75"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    stroke="#FF7A00"
                    strokeWidth="10"
                    strokeDasharray="238"
                    strokeDashoffset="195"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-xl font-black text-white">99.8%</span>
                  <span className="text-[9px] text-forest-textMuted font-bold uppercase">Success</span>
                </div>
              </div>

              {/* Custom Legends below the chart */}
              <div className="space-y-2 pt-4 border-t border-forest-borderMuted text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-lime-accent"></span>
                    <span className="text-forest-textMuted">Organize Suite</span>
                  </div>
                  <span className="text-white font-bold">65%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-forest-medium"></span>
                    <span className="text-forest-textMuted">Convert Suite</span>
                  </div>
                  <span className="text-white font-bold">25%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-orange"></span>
                    <span className="text-forest-textMuted">Security</span>
                  </div>
                  <span className="text-white font-bold">10%</span>
                </div>
              </div>
            </div>

            {/* Level Up Promotion CTA banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-forest-card via-forest-light to-forest-canvas border border-lime-accent/30 p-6 shadow-forest-card">
              {/* Inline SVG geometric decoration (Lime green 6-pointed star/asterisk) */}
              <svg className="alert-green-bg-shape" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(50,50)">
                  <rect x="-6" y="-45" width="12" height="90" rx="6" ry="6" fill="#B4F105" />
                  <rect x="-6" y="-45" width="12" height="90" rx="6" ry="6" fill="#B4F105" transform="rotate(60)" />
                  <rect x="-6" y="-45" width="12" height="90" rx="6" ry="6" fill="#B4F105" transform="rotate(120)" />
                </g>
              </svg>

              <div className="relative z-10">
                <h3 className="text-lg font-black text-white tracking-tight leading-snug mb-1">
                  Level up your document management to the next level.
                </h3>
                <p className="text-xs text-forest-textMuted mb-5 leading-relaxed">
                  An easy way to manage, batch-convert and secure documents with care and precision.
                </p>
                <Link
                  to="/pricing"
                  className="btn-lime w-full text-xs uppercase tracking-wider py-2.5"
                >
                  Check the updates now
                </Link>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
