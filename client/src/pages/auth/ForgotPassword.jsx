import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import SparkAsterisk from '../../components/ui/SparkAsterisk';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSubmitted(true);
      toast.success('Password reset instructions generated.');
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-16 flex items-center justify-center bg-forest-grid px-4">
      <div className="w-full max-w-md">
        
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-2">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-sm">
              <SparkAsterisk className="w-6 h-6" fill="#FFFFFF" />
            </div>
            <span className="text-2xl font-black text-slate-900">
              PDF<span className="text-slate-600">mate</span>
            </span>
          </Link>
        </div>

        <div className="bg-white p-8 border border-slate-200 rounded-2xl shadow-sm">
          <h2 className="text-xl font-black text-slate-900 mb-2">Reset Password</h2>
          <p className="text-xs text-slate-500 mb-6">
            Enter the email associated with your account to receive instructions.
          </p>

          {submitted ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center text-xl mx-auto mb-3">
                <i className="bi bi-envelope-check-fill"></i>
              </div>
              <h4 className="text-slate-900 font-bold text-sm mb-1">Check Your Inbox</h4>
              <p className="text-xs text-slate-500 mb-6">
                If an account exists for {email}, a recovery link has been dispatched.
              </p>
              <Link to="/login" className="btn-lime text-xs py-2.5 px-6">
                Back to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  required
                  className="spark-input text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-lime w-full text-xs uppercase tracking-wider py-3 shadow-sm"
              >
                {loading ? 'Sending...' : 'Send Recovery Link'}
              </button>

              <div className="text-center pt-3">
                <Link to="/login" className="text-xs text-slate-500 hover:text-slate-900 transition-colors">
                  Remember password? Sign in
                </Link>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
