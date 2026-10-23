import React, { useState } from 'react';
import { AlertCircle, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { StoreLogo } from './StoreLogo.js';

interface LoginModalProps {
  onLogin: (credentials: { username: string; password: string }) => Promise<void>;
  onSwitchDemo: (role: 'admin' | 'petugas') => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onLogin, onSwitchDemo }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      setSubmitting(true);
      await onLogin({ username, password });
    } catch (err: any) {
      setErrorMsg(err.message || 'Username atau kata sandi tidak valid.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelectPreset = (u: string, p: string, role: 'admin' | 'petugas') => {
    setUsername(u);
    setPassword(p);
    setErrorMsg(null);
    onSwitchDemo(role);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header Branding */}
        <div className="p-6 border-b border-slate-100 text-center flex flex-col items-center">
          <div className="mb-3">
            <StoreLogo size="lg" />
          </div>
          <h1 className="text-base font-bold text-slate-900 tracking-tight">
            Toko Sembako Berkah Mandiri
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Sistem Informasi Manajemen Persediaan & Kasir Penjualan
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-md flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Username / Identitas Pengguna
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full py-2 px-3 text-xs rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 font-mono"
                placeholder="admin / kasir"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Kata Sandi
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-2 px-3 text-xs rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 font-mono"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded shadow-2xs transition-colors cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              <span>{submitting ? 'Memproses...' : 'Masuk ke Sistem'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Access Account Selector */}
          <div className="pt-4 border-t border-slate-100">
            <p className="text-[11px] font-semibold text-slate-400 mb-2">
              Akses Cepat Pengujian:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleSelectPreset('admin', 'admin123', 'admin')}
                className={`p-2.5 rounded border text-left transition-colors cursor-pointer ${
                  username === 'admin' 
                    ? 'border-slate-900 bg-slate-50' 
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />
                  <span>Admin</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">Pemilik (Akses Penuh)</p>
              </button>

              <button
                type="button"
                onClick={() => handleSelectPreset('kasir', 'kasir123', 'petugas')}
                className={`p-2.5 rounded border text-left transition-colors cursor-pointer ${
                  username === 'kasir' 
                    ? 'border-slate-900 bg-slate-50' 
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900">
                  <UserCheck className="w-3.5 h-3.5 text-slate-700" />
                  <span>Petugas</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">Kasir & Operasional</p>
              </button>
            </div>
          </div>
        </div>

        {/* Quiet Footer */}
        <div className="py-2.5 px-6 bg-slate-50 border-t border-slate-100 text-center text-[10px] text-slate-400 font-mono">
          Manajemen Stok Sembako · Sesi Aman
        </div>
      </div>
    </div>
  );
};
