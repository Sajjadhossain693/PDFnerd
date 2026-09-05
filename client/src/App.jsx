import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { WorkspaceProvider } from './context/WorkspaceContext';
import Layout from './components/layout/Layout';

// Pages
import Home from './pages/Home';
import AllTools from './pages/AllTools';
import Dashboard from './pages/Dashboard';
import Pricing from './pages/Pricing';
import About from './pages/About';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// PDFinity Specialized Workspaces
import AcademicStudio from './pages/academic/AcademicStudio';
import AcademicTextTools from './pages/academic/AcademicTextTools';
import CoverPageGenerator from './pages/academic/CoverPageGenerator';
import PdfHealthPage from './pages/health/PdfHealthPage';
import PdfDoctorPage from './pages/health/PdfDoctorPage';
import AccessibilityPage from './pages/accessibility/AccessibilityPage';
import PrivacyScannerPage from './pages/privacy/PrivacyScannerPage';
import StudyModePage from './pages/study/StudyModePage';
import AiAssistantPage from './pages/ai/AiAssistantPage';
import WorkflowsPage from './pages/workflows/WorkflowsPage';
import UnifiedWorkspacePage from './pages/workspace/UnifiedWorkspacePage';

// Core Utility Tool Pages
import MergePdf from './pages/tool/MergePdf';
import SplitPdf from './pages/tool/SplitPdf';
import CompressPdf from './pages/tool/CompressPdf';
import JpgToPdf from './pages/tool/JpgToPdf';
import RotatePdf from './pages/tool/RotatePdf';
import Watermark from './pages/tool/Watermark';
import ProtectPdf from './pages/tool/ProtectPdf';
import UnlockPdf from './pages/tool/UnlockPdf';
import DeletePages from './pages/tool/DeletePages';
import ExtractPages from './pages/tool/ExtractPages';
import GenericToolPage from './pages/tool/GenericToolPage';

// 404 Component
function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-forest-grid">
      <span className="inline-block px-3 py-1 bg-slate-900 text-white rounded-full text-xs font-bold uppercase tracking-wider mb-3">
        Error 404
      </span>
      <h1 className="text-5xl font-black text-slate-900 mb-2">Workspace Page Not Found</h1>
      <p className="text-slate-500 text-xs sm:text-sm max-w-md mb-6">
        The requested PDFinity tool or workspace view was not found on this system.
      </p>
      <a href="/" className="btn-lime text-xs uppercase tracking-wider py-3 px-6">
        Return to Workspace Home
      </a>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <WorkspaceProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: '#0F172A',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                fontSize: '12px',
                fontWeight: '600',
                borderRadius: '12px',
              },
              success: {
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#0F172A',
                },
              },
            }}
          />

          <Routes>
            <Route path="/" element={<Layout />}>
              {/* Main Workspace Landing & Dashboard */}
              <Route index element={<Home />} />
              <Route path="tools" element={<AllTools />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="pricing" element={<Pricing />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="privacy-policy" element={<PrivacyPolicy />} />
              <Route path="terms-of-service" element={<TermsOfService />} />

              {/* PDFinity Specialized Intelligent Workspaces */}
              <Route path="cover-page" element={<CoverPageGenerator />} />
              <Route path="academic" element={<AcademicStudio />} />
              <Route path="academic/tools" element={<AcademicTextTools />} />
              <Route path="health" element={<PdfHealthPage />} />
              <Route path="doctor" element={<PdfDoctorPage />} />
              <Route path="accessibility" element={<AccessibilityPage />} />
              <Route path="privacy-scanner" element={<PrivacyScannerPage />} />
              <Route path="study" element={<StudyModePage />} />
              <Route path="ai-assistant" element={<AiAssistantPage />} />
              <Route path="workflows" element={<WorkflowsPage />} />
              <Route path="workspace" element={<UnifiedWorkspacePage />} />

              {/* Core 20+ PDF Utility Routes */}
              <Route path="tools/merge-pdf" element={<MergePdf />} />
              <Route path="tools/split-pdf" element={<SplitPdf />} />
              <Route path="tools/compress-pdf" element={<CompressPdf />} />
              <Route path="tools/jpg-to-pdf" element={<JpgToPdf />} />
              <Route path="tools/rotate-pdf" element={<RotatePdf />} />
              <Route path="tools/watermark" element={<Watermark />} />
              <Route path="tools/protect-pdf" element={<ProtectPdf />} />
              <Route path="tools/unlock-pdf" element={<UnlockPdf />} />
              <Route path="tools/delete-pages" element={<DeletePages />} />
              <Route path="tools/extract-pages" element={<ExtractPages />} />

              {/* Dynamic Route for all remaining tools */}
              <Route path="tools/:toolId" element={<GenericToolPage />} />

              {/* Auth Routes */}
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="forgot-password" element={<ForgotPassword />} />

              {/* Catch-all 404 */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </WorkspaceProvider>
    </AuthProvider>
  );
}
