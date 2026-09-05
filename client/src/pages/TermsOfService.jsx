export default function TermsOfService() {
  return (
    <div className="min-h-screen py-16 bg-forest-grid">
      <div className="section-container max-w-3xl">
        <div className="text-center mb-10">
          <span className="alert-green-badge mb-2">
            <i className="bi bi-file-earmark-text"></i> Legal Agreement
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-1">
            Terms of Service
          </h1>
          <p className="text-xs text-forest-textMuted mt-1">Effective Date: March 2026</p>
        </div>

        <div className="spark-card p-8 space-y-6 text-xs sm:text-sm text-forest-textMuted leading-relaxed">
          <div>
            <h2 className="text-base font-bold text-white mb-2">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the PDFmate platform, you agree to comply with these terms. If you disagree with any segment, please discontinue use immediately.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-white mb-2">2. Permitted Document Processing</h2>
            <p>
              You warrant that you possess all requisite rights, licenses, and permissions for any files you upload. You agree not to upload malware, illegal material, or documents intended to disrupt system integrity.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-white mb-2">3. Service Availability & Limits</h2>
            <p>
              The platform is provided "as is" under standard open-source community terms. We strive for 99.9% operational uptime, but we do not guarantee uninterrupted processing during maintenance intervals.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-white mb-2">4. Fair Usage</h2>
            <p>
              Automated script scraping, denial-of-service abuse, or deliberate exploitation of file endpoints is strictly prohibited and subject to automated IP rate limiting.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
