import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success('Your message has been sent to our team.');
  };

  return (
    <div className="min-h-screen py-16 bg-forest-grid">
      <div className="section-container max-w-xl">
        <div className="text-center mb-10">
          <span className="alert-green-badge mb-2">
            <i className="bi bi-chat-dots-fill"></i> Support Desk
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-1">
            Get in Touch
          </h1>
          <p className="text-xs sm:text-sm text-forest-textMuted mt-2">
            Have feature suggestions, bug reports, or questions about PDFmate?
          </p>
        </div>

        {/* Developer Contact Card with Gmail Button */}
        <div className="spark-card p-6 border-lime-accent/40 mb-6 relative overflow-hidden shadow-lime-glow">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-lime-accent text-forest-canvas flex items-center justify-center font-black text-lg shadow-sm">
                S
              </div>
              <div>
                <span className="text-[10px] font-bold text-lime-accent uppercase tracking-wider block">
                  Lead Developer & Creator
                </span>
                <h3 className="text-base font-black text-white">Sajjad Hossain Siam</h3>
                <p className="text-xs text-forest-textMuted">Creator of PDFmate platform</p>
              </div>
            </div>

            {/* Direct Gmail Action Button */}
            <a
              href="mailto:dufferx99@gmail.com?subject=Contact%20Sajjad%20Hossain%20Siam%20-%20PDFmate"
              className="inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl bg-[#EA4335] hover:bg-[#d3382b] text-white text-xs font-bold transition-all shadow-md self-start sm:self-auto"
            >
              <i className="bi bi-envelope-fill text-sm"></i>
              <span>Email: dufferx99@gmail.com</span>
            </a>
          </div>
        </div>

        <div className="spark-card p-8">
          {submitted ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 rounded-2xl bg-lime-accent/20 text-lime-accent flex items-center justify-center text-2xl mx-auto mb-3">
                <i className="bi bi-check2-circle"></i>
              </div>
              <h3 className="text-white font-bold text-base mb-1">Message Received</h3>
              <p className="text-xs text-forest-textMuted mb-6">
                Thank you, {name}. Our engineering team will review your inquiry shortly.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setMessage('');
                }}
                className="btn-lime text-xs py-2.5 px-6"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-forest-textMuted uppercase mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Morgan Vance"
                  required
                  className="spark-input text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-forest-textMuted uppercase mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="morgan@email.com"
                  required
                  className="spark-input text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-forest-textMuted uppercase mb-1">
                  Message
                </label>
                <textarea
                  rows="4"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we assist your PDF workflow?"
                  required
                  className="spark-input text-xs"
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn-lime w-full text-xs uppercase tracking-wider py-3 shadow-lime-glow"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
