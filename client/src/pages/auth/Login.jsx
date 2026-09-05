import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SparkAsterisk from '../../components/ui/SparkAsterisk';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in both email and password.');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Logged in successfully!');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Login failed.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail('demo@sparkpdf.com');
    setPassword('Password123');
  };

  return (
    <div className="min-h-screen py-16 flex items-center justify-center bg-forest-grid px-4">
      <div className="w-full max-w-md">
        
        {/* Brand Logo Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-2">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-sm">
              <SparkAsterisk className="w-6 h-6" fill="#FFFFFF" />
            </div>
            <span className="text-2xl font-black text-slate-900">
              PDF<span className="text-slate-600">mate</span>
            </span>
          </Link>
          <p className="text-xs text-slate-500">
            Sign in to access your file history and advanced limits
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white p-8 border border-slate-200 rounded-2xl shadow-sm">
          <h2 className="text-xl font-black text-slate-900 mb-6">Welcome Back</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@email.com"
                required
                className="spark-input text-xs"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold text-slate-600 uppercase">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] text-slate-900 hover:underline font-semibold"
                >
                  Forgot?
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="spark-input text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-lime w-full text-xs uppercase tracking-wider py-3 mt-2 shadow-sm"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <i className="bi bi-arrow-repeat animate-spin"></i> Authenticating...
                </span>
              ) : (
                'Sign In to Dashboard'
              )}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="text-xs text-slate-700 hover:text-slate-900 hover:underline font-bold"
            >
              ⚡ Fill Sample Credentials
            </button>
          </div>

          <div className="mt-4 text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-slate-900 font-bold hover:underline transition-colors">
              Create one for free
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
