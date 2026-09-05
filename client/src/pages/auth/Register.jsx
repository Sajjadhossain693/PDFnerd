import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SparkAsterisk from '../../components/ui/SparkAsterisk';
import toast from 'react-hot-toast';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('All fields are required.');
      return;
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long.');
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Registration failed.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
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
            Get started with 100% free, high-speed document operations
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-white p-8 border border-slate-200 rounded-2xl shadow-sm">
          <h2 className="text-xl font-black text-slate-900 mb-6">Create Account</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Morgan"
                required
                className="spark-input text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@company.com"
                required
                className="spark-input text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Password (min 8 characters)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                minLength={8}
                className="spark-input text-xs"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn-lime w-full text-xs uppercase tracking-wider py-3 shadow-sm"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <i className="bi bi-arrow-repeat animate-spin"></i> Creating Account...
                  </span>
                ) : (
                  'Create Free Account'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            Already registered?{' '}
            <Link to="/login" className="text-slate-900 font-bold hover:underline transition-colors">
              Sign in
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
