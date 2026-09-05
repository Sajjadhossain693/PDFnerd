import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-[#161C28] bg-[#05070B] mt-20">
      <div className="section-container py-12">
        {/* Upper footer links grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-10 border-b border-[#1E2638]">
          {/* Col 1: Brand Info */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-3 group inline-block">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF4E64] via-[#FF6E51] to-[#FFA07A] flex items-center justify-center shadow-md shadow-orange-500/20">
                <i className="bi bi-mortarboard-fill text-white text-sm"></i>
              </div>
              <span className="text-xl font-black text-white">
                PDF<span className="text-[#FF8E53]">nerd</span>
              </span>
            </Link>
            <p className="text-zinc-400 text-xs leading-relaxed max-w-sm mb-4">
              An Intelligent Document Workspace combining PDF utilities, document intelligence, accessibility analysis, privacy tools, and academic document generation.
            </p>

            {/* Developer Contact Card */}
            <div className="p-3.5 rounded-xl bg-[#0D111C] border border-[#1E2638] shadow-lg mb-4 max-w-sm">
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#1E2638] text-white flex items-center justify-center font-bold text-xs">
                    S
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white leading-none">Sajjad Hossain Siam</p>
                    <p className="text-[10px] text-zinc-400 font-medium mt-0.5">Lead Developer & Creator</p>
                  </div>
                </div>
              </div>
              
              {/* Gmail Button */}
              <a
                href="mailto:dufferx99@gmail.com?subject=Inquiry%20from%20PDFnerd"
                className="inline-flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg bg-[#EA4335] hover:bg-[#d3382b] text-white text-xs font-bold transition-all shadow-sm group"
                title="Send direct email to Sajjad Hossain Siam"
              >
                <i className="bi bi-envelope-fill text-sm"></i>
                <span className="text-white">dufferx99@gmail.com</span>
              </a>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs text-zinc-400 font-medium">All Intelligent Workspace Engines Active</span>
            </div>
          </div>

          {/* Col 2: Academic Studio */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Academic Suite</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/academic" className="text-zinc-400 hover:text-white transition-colors">Cover Creator</Link></li>
              <li><Link to="/academic" className="text-zinc-400 hover:text-white transition-colors">Document Builder</Link></li>
              <li><Link to="/academic/tools" className="text-zinc-400 hover:text-white transition-colors">Word Counter</Link></li>
              <li><Link to="/academic/tools" className="text-zinc-400 hover:text-white transition-colors">Citation Helper</Link></li>
              <li><Link to="/study" className="text-zinc-400 hover:text-white transition-colors">Exam Study Mode</Link></li>
            </ul>
          </div>

          {/* Col 3: Intelligence & Privacy */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Intelligence & Security</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/health" className="text-zinc-400 hover:text-white transition-colors">PDF Health Score</Link></li>
              <li><Link to="/doctor" className="text-zinc-400 hover:text-white transition-colors">Smart PDF Doctor</Link></li>
              <li><Link to="/accessibility" className="text-zinc-400 hover:text-white transition-colors">Accessibility (WCAG)</Link></li>
              <li><Link to="/privacy-scanner" className="text-zinc-400 hover:text-white transition-colors">Privacy Scanner</Link></li>
              <li><Link to="/ai-assistant" className="text-zinc-400 hover:text-white transition-colors">Ask My Document</Link></li>
            </ul>
          </div>

          {/* Col 4: Platform & Utilities */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Workspaces</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/workspace" className="text-zinc-400 hover:text-white transition-colors">Unified Tray</Link></li>
              <li><Link to="/workflows" className="text-zinc-400 hover:text-white transition-colors">One-Click Workflows</Link></li>
              <li><Link to="/tools" className="text-zinc-400 hover:text-white transition-colors">Browse All 26 Tools</Link></li>
              <li><Link to="/dashboard" className="text-zinc-400 hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link to="/pricing" className="text-zinc-400 hover:text-white transition-colors">Open Source Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold flex items-center gap-1.5">
              <i className="bi bi-mortarboard-fill text-amber-400 text-sm"></i> PDFnerd
            </span>
            <span className="text-zinc-700">|</span>
            <span>&copy; {new Date().getFullYear()} PDFnerd. Powered by Open Source Stack.</span>
          </div>
          <div className="flex items-center gap-4 text-zinc-400">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
