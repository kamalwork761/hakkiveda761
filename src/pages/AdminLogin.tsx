import React, { useState } from 'react';
import { Lock, KeyRound, Mail, Shield, ArrowLeft, AlertCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onReturnToStore: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onReturnToStore }) => {
  const { authenticateAdmin } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const res = await authenticateAdmin(email, password);
      if (res.success) {
        onLoginSuccess();
      } else {
        setErrorMsg(res.message || 'Invalid email or password.');
      }
    } catch (err) {
      setErrorMsg('Invalid email or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--brand-primary-deeper)] text-slate-100 font-sans flex flex-col justify-between p-4 sm:p-8 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[var(--brand-gold)]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[var(--brand-primary-dark)]/80 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Header */}
      <div className="flex items-center justify-between max-w-5xl mx-auto w-full z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 border-2 border-[var(--brand-gold)] flex items-center justify-center rotate-45 bg-[var(--brand-primary-dark)]">
            <span className="-rotate-45 font-bold font-brand text-[var(--brand-gold)] text-base">HV</span>
          </div>
          <div>
            <h1 className="text-xl font-bold font-brand tracking-widest text-[var(--brand-gold)]">HAKKIVEDA</h1>
            <p className="text-[9px] uppercase tracking-widest text-slate-300">Secure Store Command Center</p>
          </div>
        </div>

        <button
          onClick={onReturnToStore}
          className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-[var(--brand-gold)] bg-[var(--brand-primary-dark)]/80 px-4 py-2 rounded-full border border-white/10 transition-all hover:border-[var(--brand-gold)]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Store Front</span>
        </button>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto my-auto z-10 my-8">
        <div className="bg-[var(--brand-primary-dark)]/90 border border-[var(--brand-gold)]/40 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          <div className="text-center space-y-3 mb-8">
            <div className="w-14 h-14 bg-[var(--brand-gold)]/20 border-2 border-[var(--brand-gold)] text-[var(--brand-gold)] rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold font-serif-luxury text-slate-100">Private Admin Portal</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Authorized access only. Enter master credentials to manage catalog, orders, and site settings.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-3.5 bg-rose-950/80 border border-rose-500/50 rounded-xl text-rose-200 text-xs flex items-center gap-3 animate-in fade-in">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 font-sans">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--brand-gold)]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter admin email"
                  className="w-full bg-[var(--brand-primary-deeper)] border border-white/20 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[var(--brand-gold)] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Master Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--brand-gold)]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[var(--brand-primary-deeper)] border border-white/20 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[var(--brand-gold)] transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white transition-all shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 mt-2 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Verifying Security Hash...</span>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  <span>Authenticate & Open Dashboard</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center space-y-2">
            <p className="text-[11px] text-slate-400 font-mono flex items-center justify-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[var(--brand-gold)]" />
              <span>Secure Session Authentication</span>
            </p>
          </div>
        </div>
      </div>

      {/* Footer copyright */}
      <div className="text-center text-[10px] text-slate-400 font-sans uppercase tracking-widest z-10">
        © 2026 HAKKIVEDA Herbal Enterprises • Private Management Area
      </div>
    </div>
  );
};
