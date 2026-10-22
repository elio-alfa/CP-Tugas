import React, { useState } from 'react';
import { Store, ShieldCheck, UserCheck, KeyRound, AlertCircle, ArrowRight } from 'lucide-react';

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
      setErrorMsg(err.message || 'Username atau password salah.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelectPreset = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Banner */}
        <div className="bg-slate-900 p-6 text-center text-white border-b border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center mb-3 border border-emerald-500/30">
            <Store className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold tracking-tight">TOKO SEMBAKO BERKAH MANDIRI</h2>
          <p className="text-xs text-slate-400 mt-1">
            Sistem Informasi Manajemen Stok & Point of Sale (POS) Berbasis Web
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Username atau Email
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full py-2.5 px-3 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800"
                placeholder="admin atau kasir"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-2.5 px-3 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{submitting ? 'Memverifikasi...' : 'Masuk ke Sistem'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Credentials Switcher for Thesis Defense */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">
              Pilihan Akun Demo Sidang Tugas Akhir
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  handleSelectPreset('admin', 'admin123');
                  onSwitchDemo('admin');
                }}
                className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Administrator</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">Pemilik Toko (Full Access)</p>
                <p className="text-[10px] font-mono text-slate-400 mt-1">admin / admin123</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleSelectPreset('kasir', 'kasir123');
                  onSwitchDemo('petugas');
                }}
                className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Petugas Kasir</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">Operasional & Gudang</p>
                <p className="text-[10px] font-mono text-slate-400 mt-1">kasir / kasir123</p>
              </button>
            </div>
          </div>
        </div>

        {/* Academic Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center text-[11px] text-slate-500">
          Tugas Akhir Sarjana Sistem Informasi · Versi Siap Sidang
        </div>
      </div>
    </div>
  );
};
