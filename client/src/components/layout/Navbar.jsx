import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWorkspace } from '../../context/WorkspaceContext';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { activeDocument } = useWorkspace();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [workspacesOpen, setWorkspacesOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/tools?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#07090E]/95 backdrop-blur-md border-b border-[#1E2638] shadow-lg shadow-black/30'
          : 'bg-[#07090E]/85 backdrop-blur-sm border-b border-[#161C28]'
      }`}
    >
      <div className="section-container">
        <div className="flex items-center justify-between h-18 py-3">
          
          {/* Left: Brand & Workspaces Dropdown */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* PDFinity Brand Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF4E64] via-[#FF6E51] to-[#FFA07A] flex items-center justify-center transition-transform group-hover:scale-105 shadow-md shadow-orange-500/20">
                <i className="bi bi-mortarboard-fill text-white text-base"></i>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-white flex items-center gap-0.5">
                  PDF<span className="text-[#FF8E53]">inity</span>
                </span>
                <span className="text-[9px] text-zinc-400 -mt-1 font-bold tracking-wider uppercase">
                  Intelligent Workspace
                </span>
              </div>
            </Link>

            {/* Workspaces Menu */}
            <div className="relative hidden xl:block">
              <button
                type="button"
                onClick={() => setWorkspacesOpen(!workspacesOpen)}
                className="flex items-center gap-1.5 bg-[#121622] hover:bg-[#1A2030] text-zinc-200 px-3 py-1.5 rounded-xl border border-[#232B3D] text-xs font-bold transition-all"
              >
                <i className="bi bi-grid-3x3-gap-fill text-amber-400"></i>
                <span>Workspaces</span>
                <i className="bi bi-chevron-down text-[9px] text-zinc-400"></i>
              </button>

              {workspacesOpen && (
                <div
                  className="absolute left-0 mt-2 w-64 bg-[#0D111C] border border-[#1E2638] rounded-2xl shadow-2xl p-2 z-50 animate-fade-in"
                  onMouseLeave={() => setWorkspacesOpen(false)}
                >
                  <div className="px-3 py-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                    Specialized Workspaces
                  </div>
                  <Link
                    to="/cover-page"
                    onClick={() => setWorkspacesOpen(false)}
                    className="flex items-center gap-2.5 p-2 rounded-xl text-xs text-zinc-200 hover:bg-[#161D2C] hover:text-white transition-colors"
                  >
                    <i className="bi bi-file-earmark-richtext text-blue-400 text-sm"></i>
                    <div>
                      <div className="font-bold">Cover Page Generator</div>
                      <div className="text-[10px] text-zinc-400">DIU academic assignments & reports</div>
                    </div>
                  </Link>
                  <Link
                    to="/academic"
                    onClick={() => setWorkspacesOpen(false)}
                    className="flex items-center gap-2.5 p-2 rounded-xl text-xs text-zinc-200 hover:bg-[#161D2C] hover:text-white transition-colors"
                  >
                    <i className="bi bi-mortarboard text-amber-400 text-sm"></i>
                    <div>
                      <div className="font-bold">Academic Studio</div>
                      <div className="text-[10px] text-zinc-400">Document builder & profiles</div>
                    </div>
                  </Link>
                  <Link
                    to="/health"
                    onClick={() => setWorkspacesOpen(false)}
                    className="flex items-center gap-2.5 p-2 rounded-xl text-xs text-zinc-200 hover:bg-[#161D2C] hover:text-white transition-colors"
                  >
                    <i className="bi bi-heart-pulse text-emerald-400 text-sm"></i>
                    <div>
                      <div className="font-bold">PDF Health & Doctor</div>
                      <div className="text-[10px] text-zinc-400">0-100 audit & auto-healing</div>
                    </div>
                  </Link>
                  <Link
                    to="/accessibility"
                    onClick={() => setWorkspacesOpen(false)}
                    className="flex items-center gap-2.5 p-2 rounded-xl text-xs text-zinc-200 hover:bg-[#161D2C] hover:text-white transition-colors"
                  >
                    <i className="bi bi-universal-access text-purple-400 text-sm"></i>
                    <div>
                      <div className="font-bold">Accessibility & Compliance</div>
                      <div className="text-[10px] text-zinc-400">PDF/UA-1 & WCAG 2.2 checks</div>
                    </div>
                  </Link>
                  <Link
                    to="/privacy-scanner"
                    onClick={() => setWorkspacesOpen(false)}
                    className="flex items-center gap-2.5 p-2 rounded-xl text-xs text-zinc-200 hover:bg-[#161D2C] hover:text-white transition-colors"
                  >
                    <i className="bi bi-shield-check text-rose-400 text-sm"></i>
                    <div>
                      <div className="font-bold">Privacy Scanner</div>
                      <div className="text-[10px] text-zinc-400">Detect PII & metadata scrub</div>
                    </div>
                  </Link>
                  <Link
                    to="/study"
                    onClick={() => setWorkspacesOpen(false)}
                    className="flex items-center gap-2.5 p-2 rounded-xl text-xs text-zinc-200 hover:bg-[#161D2C] hover:text-white transition-colors"
                  >
                    <i className="bi bi-book-half text-cyan-400 text-sm"></i>
                    <div>
                      <div className="font-bold">Exam & Study Mode</div>
                      <div className="text-[10px] text-zinc-400">Flashcards, MCQs, & summaries</div>
                    </div>
                  </Link>
                  <Link
                    to="/workflows"
                    onClick={() => setWorkspacesOpen(false)}
                    className="flex items-center gap-2.5 p-2 rounded-xl text-xs text-zinc-200 hover:bg-[#161D2C] hover:text-white transition-colors"
                  >
                    <i className="bi bi-diagram-3 text-orange-400 text-sm"></i>
                    <div>
                      <div className="font-bold">One-Click Workflows</div>
                      <div className="text-[10px] text-zinc-400">Chained multi-tool pipelines</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Main Nav Links */}
            <div className="hidden lg:flex items-center gap-1">
              <NavLink
                to="/cover-page"
                className={({ isActive }) =>
                  `px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive ? 'bg-[#1E2638] text-white font-bold' : 'text-zinc-400 hover:text-white hover:bg-[#121622]'
                  }`
                }
              >
                Cover Page
              </NavLink>
              <NavLink
                to="/academic"
                className={({ isActive }) =>
                  `px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive ? 'bg-[#1E2638] text-white font-bold' : 'text-zinc-400 hover:text-white hover:bg-[#121622]'
                  }`
                }
              >
                Academic
              </NavLink>
              <NavLink
                to="/health"
                className={({ isActive }) =>
                  `px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive ? 'bg-[#1E2638] text-white font-bold' : 'text-zinc-400 hover:text-white hover:bg-[#121622]'
                  }`
                }
              >
                PDF Health
              </NavLink>
              <NavLink
                to="/accessibility"
                className={({ isActive }) =>
                  `px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive ? 'bg-[#1E2638] text-white font-bold' : 'text-zinc-400 hover:text-white hover:bg-[#121622]'
                  }`
                }
              >
                Accessibility
              </NavLink>
              <NavLink
                to="/privacy-scanner"
                className={({ isActive }) =>
                  `px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive ? 'bg-[#1E2638] text-white font-bold' : 'text-zinc-400 hover:text-white hover:bg-[#121622]'
                  }`
                }
              >
                Privacy
              </NavLink>
              <NavLink
                to="/study"
                className={({ isActive }) =>
                  `px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive ? 'bg-[#1E2638] text-white font-bold' : 'text-zinc-400 hover:text-white hover:bg-[#121622]'
                  }`
                }
              >
                Study Mode
              </NavLink>
              <NavLink
                to="/tools"
                className={({ isActive }) =>
                  `px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive ? 'bg-[#1E2638] text-white font-bold' : 'text-zinc-400 hover:text-white hover:bg-[#121622]'
                  }`
                }
              >
                All Tools
              </NavLink>
            </div>
          </div>

          {/* Right: Active Workspace Document Tray Pill & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Active Workspace Tray Indicator */}
            {activeDocument ? (
              <Link
                to="/workspace"
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all shadow-xs"
                title="Active Working File"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="truncate max-w-[130px]">{activeDocument.name}</span>
              </Link>
            ) : (
              <Link
                to="/workspace"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#121622] hover:bg-[#1A2030] border border-[#232B3D] text-zinc-300 text-xs font-bold transition-all"
              >
                <i className="bi bi-folder2 text-zinc-400"></i>
                <span>Workspace</span>
              </Link>
            )}

            {/* Search Button (Mobile/Tablet) */}
            <Link
              to="/tools"
              className="w-8 h-8 rounded-lg bg-[#121622] hover:bg-[#1A2030] border border-[#232B3D] flex items-center justify-center text-zinc-300 hover:text-white transition-all text-sm"
              title="Search Tools"
            >
              <i className="bi bi-search"></i>
            </Link>

            {/* Fullscreen button */}
            <button
              onClick={toggleFullscreen}
              aria-label="Toggle Fullscreen"
              className="w-8 h-8 rounded-lg bg-[#121622] hover:bg-[#1A2030] border border-[#232B3D] flex items-center justify-center text-zinc-300 hover:text-white transition-all text-sm hidden sm:flex"
            >
              <i className="bi bi-arrows-fullscreen"></i>
            </button>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-xl bg-[#121622] hover:bg-[#1A2030] border border-[#232B3D] text-xs font-bold text-zinc-200 transition-all"
                >
                  <div className="w-6 h-6 rounded-lg bg-[#1E2638] text-white flex items-center justify-center text-[10px]">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="hidden sm:inline">{user?.name?.split(' ')[0]}</span>
                </button>

                {profileOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-[#0D111C] border border-[#1E2638] rounded-xl shadow-2xl py-1.5 z-50 animate-fade-in"
                    onMouseLeave={() => setProfileOpen(false)}
                  >
                    <Link
                      to="/dashboard"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-300 hover:bg-[#161D2C] hover:text-white"
                    >
                      <i className="bi bi-speedometer2"></i> Dashboard
                    </Link>
                    <Link
                      to="/workspace"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-300 hover:bg-[#161D2C] hover:text-white"
                    >
                      <i className="bi bi-folder2-open"></i> Working Tray
                    </Link>
                    <div className="border-t border-[#1E2638] my-1"></div>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 text-left"
                    >
                      <i className="bi bi-box-arrow-right"></i> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-bold text-zinc-300 hover:text-white"
                >
                  Sign In
                </Link>
                <Link
                  to="/dashboard"
                  className="btn-lime text-xs py-1.5 px-3.5 shadow-sm"
                >
                  Dashboard
                </Link>
              </div>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-8 h-8 rounded-lg bg-[#121622] border border-[#232B3D] flex items-center justify-center text-zinc-300 hover:text-white"
            >
              <i className={`bi ${mobileOpen ? 'bi-x-lg' : 'bi-list'} text-base`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileOpen && (
          <div className="lg:hidden pb-4 pt-2 border-t border-[#1E2638] space-y-2">
            <div className="grid grid-cols-2 gap-2 px-1 pt-1">
              <Link
                to="/cover-page"
                onClick={() => setMobileOpen(false)}
                className="p-2.5 rounded-xl bg-[#0D111C] text-xs font-semibold text-white border border-[#1E2638] flex items-center gap-2"
              >
                <i className="bi bi-file-earmark-richtext text-blue-400"></i> Cover Page
              </Link>
              <Link
                to="/academic"
                onClick={() => setMobileOpen(false)}
                className="p-2.5 rounded-xl bg-[#0D111C] text-xs font-semibold text-white border border-[#1E2638] flex items-center gap-2"
              >
                <i className="bi bi-mortarboard text-amber-400"></i> Academic Studio
              </Link>
              <Link
                to="/health"
                onClick={() => setMobileOpen(false)}
                className="p-2.5 rounded-xl bg-[#0D111C] text-xs font-semibold text-white border border-[#1E2638] flex items-center gap-2"
              >
                <i className="bi bi-heart-pulse text-emerald-400"></i> PDF Health
              </Link>
              <Link
                to="/accessibility"
                onClick={() => setMobileOpen(false)}
                className="p-2.5 rounded-xl bg-[#0D111C] text-xs font-semibold text-white border border-[#1E2638] flex items-center gap-2"
              >
                <i className="bi bi-universal-access text-purple-400"></i> Accessibility
              </Link>
              <Link
                to="/privacy-scanner"
                onClick={() => setMobileOpen(false)}
                className="p-2.5 rounded-xl bg-[#0D111C] text-xs font-semibold text-white border border-[#1E2638] flex items-center gap-2"
              >
                <i className="bi bi-shield-check text-rose-400"></i> Privacy Scan
              </Link>
              <Link
                to="/study"
                onClick={() => setMobileOpen(false)}
                className="p-2.5 rounded-xl bg-[#0D111C] text-xs font-semibold text-white border border-[#1E2638] flex items-center gap-2"
              >
                <i className="bi bi-book text-cyan-400"></i> Study Mode
              </Link>
              <Link
                to="/workflows"
                onClick={() => setMobileOpen(false)}
                className="p-2.5 rounded-xl bg-[#0D111C] text-xs font-semibold text-white border border-[#1E2638] flex items-center gap-2"
              >
                <i className="bi bi-diagram-3 text-orange-400"></i> Workflows
              </Link>
              <Link
                to="/workspace"
                onClick={() => setMobileOpen(false)}
                className="p-2.5 rounded-xl bg-[#0D111C] text-xs font-semibold text-white border border-[#1E2638] flex items-center gap-2"
              >
                <i className="bi bi-folder2 text-zinc-400"></i> Workspace Tray
              </Link>
              <Link
                to="/tools"
                onClick={() => setMobileOpen(false)}
                className="p-2.5 rounded-xl bg-[#0D111C] text-xs font-semibold text-white border border-[#1E2638] flex items-center gap-2"
              >
                <i className="bi bi-grid text-zinc-400"></i> All Tools
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
