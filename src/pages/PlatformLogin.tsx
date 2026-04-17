import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogIn, Mail, Lock, ArrowLeft } from 'lucide-react';

export default function PlatformLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gmg-charcoal to-black text-white pt-24">
      <div className="max-w-md mx-auto px-6 py-20">
        <Link
          to="/platform"
          className="inline-flex items-center gap-2 text-gmg-gray hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Platform
        </Link>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-gmg-violet to-gmg-cyan mb-6">
            <LogIn className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-4xl font-bold mb-4">
            Platform Login
          </h1>
          <p className="text-gmg-gray">
            Access the Rocksteady Dashboard and GMG Platform
          </p>
        </div>

        <div className="relative p-8 bg-gradient-to-br from-gmg-graphite/60 to-gmg-charcoal rounded-3xl border border-white/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gmg-gray" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gmg-charcoal border border-white/10 rounded-xl text-white placeholder-gmg-gray focus:outline-none focus:border-gmg-violet transition-colors"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gmg-gray" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gmg-charcoal border border-white/10 rounded-xl text-white placeholder-gmg-gray focus:outline-none focus:border-gmg-violet transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-8 py-4 bg-gradient-to-r from-gmg-violet to-gmg-cyan text-white rounded-full font-semibold hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center">
            <button className="text-sm text-gmg-gray hover:text-white transition-colors">
              Forgot your password?
            </button>
          </div>
        </div>

        <div className="mt-8 p-6 bg-gmg-violet/10 border border-gmg-violet/20 rounded-2xl">
          <h3 className="font-semibold mb-2">Need Access?</h3>
          <p className="text-sm text-gmg-gray mb-4">
            Access to the GMG Platform is currently limited to select partners and artists.
          </p>
          <Link
            to="/get-started?service=platform-access"
            className="inline-block text-sm text-gmg-violet hover:text-white transition-colors font-medium"
          >
            Request Platform Access →
          </Link>
        </div>

        <p className="text-center text-xs text-gmg-gray mt-8">
          By signing in, you agree to GMG's Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
