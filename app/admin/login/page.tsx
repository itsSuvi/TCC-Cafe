'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, ArrowRight, Sparkles, ChefHat } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid credentials');
      }

      // Store admin session token
      localStorage.setItem('classic_crush_admin_session', 'true');
      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = () => {
    setEmail('admin@classiccrush.com');
    setPassword('admin123');
  };

  return (
    <div className="min-h-screen bg-[#1A0F08] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#23140C] border border-[#3B2416] rounded-3xl p-8 sm:p-10 shadow-2xl text-white space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#C89B2B] to-[#E7C86A] text-[#23140C] flex items-center justify-center mx-auto shadow-lg">
            <ChefHat className="w-9 h-9" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#E7C86A]">
              Staff & Kitchen Command
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              THE CLASSIC CRUSH
            </h1>
            <p className="text-xs text-stone-400">
              Bakery & Café • Admin Portal
            </p>
          </div>
        </div>

        {/* Demo Quick Fill Banner */}
        <div className="bg-white/5 border border-white/10 p-3 rounded-2xl flex items-center justify-between text-xs">
          <div>
            <span className="text-[#E7C86A] font-bold block">Quick Demo Login:</span>
            <span className="text-stone-300">admin@classiccrush.com / admin123</span>
          </div>
          <button
            type="button"
            onClick={handleQuickFill}
            className="bg-[#C89B2B] hover:bg-[#E7C86A] text-[#23140C] px-3 py-1.5 rounded-xl font-bold text-xs transition-colors"
          >
            Auto-fill
          </button>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/40 text-red-300 p-3 rounded-xl text-xs">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-400 block mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@classiccrush.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#C89B2B]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-400 block mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#C89B2B]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C89B2B] hover:bg-[#E7C86A] text-[#23140C] py-3.5 rounded-xl font-black text-sm tracking-wide shadow-lg flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 text-center">
          <Link
            href="/"
            className="text-xs text-stone-400 hover:text-white transition-colors"
          >
            ← Return to Customer Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
