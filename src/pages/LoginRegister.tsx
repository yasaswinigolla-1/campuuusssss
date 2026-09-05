import { useState, type FormEvent } from 'react';
import { Compass, Mail, Lock, User as UserIcon, AlertCircle } from 'lucide-react';
import type { Store } from '../store';

interface Props {
  store: Store;
  onSuccess: () => void;
}

export function LoginRegister({ store, onSuccess }: Props) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (mode === 'register') {
      if (!email.trim() || !name.trim() || !password) {
        setError('Please fill in all fields.');
        return;
      }
      if (!email.includes('@')) {
        setError('Please enter a valid college email.');
        return;
      }
      if (password.length < 4) {
        setError('Password must be at least 4 characters.');
        return;
      }
      setLoading(true);
      const err = store.register(email.trim(), name.trim(), password);
      setLoading(false);
      if (err) {
        setError(err);
        return;
      }
      onSuccess();
    } else {
      if (!email.trim() || !password) {
        setError('Please enter your email and password.');
        return;
      }
      setLoading(true);
      const err = store.login(email.trim(), password);
      setLoading(false);
      if (err) {
        setError(err);
        return;
      }
      onSuccess();
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-navy-700 text-cream-50">
            <Compass className="h-7 w-7" />
          </div>
          <h1 className="font-serif text-2xl font-semibold text-navy-800">CampusFind</h1>
          <p className="mt-1 text-sm text-navy-400">Lost & Found for your campus community</p>
        </div>

        <div className="rounded-xl border border-cream-200 bg-white p-8">
          {/* Toggle */}
          <div className="mb-6 flex rounded-lg bg-cream-100 p-1">
            <button
              onClick={() => { setMode('login'); setError(''); }}
              className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                mode === 'login' ? 'bg-white text-navy-700 shadow-sm' : 'text-navy-400'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => { setMode('register'); setError(''); }}
              className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                mode === 'register' ? 'bg-white text-navy-700 shadow-sm' : 'text-navy-400'
              }`}
            >
              Register
            </button>
          </div>

          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-navy-600">Full name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-300" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full rounded-lg border border-cream-300 bg-cream-50 py-2.5 pl-10 pr-3 text-sm text-navy-700 placeholder:text-navy-300 focus:border-navy-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-navy-200"
                  />
                </div>
              </div>
            )}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy-600">College email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-300" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@campus.edu"
                  className="w-full rounded-lg border border-cream-300 bg-cream-50 py-2.5 pl-10 pr-3 text-sm text-navy-700 placeholder:text-navy-300 focus:border-navy-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-navy-200"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy-600">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-300" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-cream-300 bg-cream-50 py-2.5 pl-10 pr-3 text-sm text-navy-700 placeholder:text-navy-300 focus:border-navy-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-navy-200"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-amber-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-600 disabled:opacity-50"
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Log in' : 'Create account'}
            </button>
          </form>

          {mode === 'login' && (
            <p className="mt-4 text-center text-xs text-navy-400">
              Try the demo: <span className="font-medium text-navy-500">demo@campus.edu / demo123</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
