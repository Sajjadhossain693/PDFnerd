export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen py-16 bg-forest-grid">
      <div className="section-container max-w-3xl">
        <div className="text-center mb-10">
          <span className="alert-green-badge mb-2">
            <i className="bi bi-shield-check"></i> Privacy Architecture
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-1">
            Privacy Policy
          </h1>
          <p className="text-xs text-forest-textMuted mt-1">Last revised: March 2026</p>
        </div>

        <div className="spark-card p-8 space-y-6 text-xs sm:text-sm text-forest-textMuted leading-relaxed">
          <div>
            <h2 className="text-base font-bold text-white mb-2">1. The In-Memory Principle</h2>
            <p>
              Documents uploaded to PDFmate are processed strictly within transient server memory containers. We do not extract, read, analyze, copy, or index the textual or graphical contents of your files.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-white mb-2">2. Mandatory 60-Minute Auto-Purge</h2>
            <p>
              Any temporary staging artifacts created during merge, compression, or conversion are systematically deleted by automated cleanup schedulers within 60 minutes of completion.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-white mb-2">3. Account Metadata</h2>
            <p>
              If you register for an optional account, we store only your name, email address, password hash (salted with bcrypt), and high-level usage counters (e.g. number of files processed). No original documents are kept in our database.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-white mb-2">4. SSL / TLS Encryption</h2>
            <p>
              All traffic between your browser and our nodes is protected with modern SSL/TLS 256-bit encryption to prevent man-in-the-middle interception.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
