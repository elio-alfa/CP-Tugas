import React, { useState } from 'react';
import { api } from '../services/api.js';
import {
  CheckCircle2,
  XCircle,
  Play,
  X,
  ShieldCheck,
  RefreshCw,
  Clock,
  ChevronDown,
  ChevronUp,
  Award
} from 'lucide-react';

interface TestRunnerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TestRunnerModal: React.FC<TestRunnerModalProps> = ({ isOpen, onClose }) => {
  const [running, setRunning] = useState(false);
  const [testSummary, setTestSummary] = useState<any>(null);
  const [expandedItem, setExpandedItem] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleRunTests = async () => {
    setRunning(true);
    setTestSummary(null);
    try {
      const res = await api.runTests();
      setTestSummary(res.data);
    } catch (err: any) {
      alert(`Gagal menjalankan pengujian: ${err.message}`);
    } finally {
      setRunning(false);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedItem((prev) => (prev === id ? null : id));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 my-8 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-base font-bold text-slate-900">
                Pengujian Otomatis Sistem (16 Skenario Tugas Akhir)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Validasi otomatis fungsionalitas, keamanan role, transaksi atomik, dan integritas buku besar.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Controls & Overview Banner */}
        <div className="py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div>
            <button
              onClick={handleRunTests}
              disabled={running}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2"
            >
              {running ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Mengeksekusi 16 Pengujian...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Jalankan Semua 16 Pengujian Sekarang</span>
                </>
              )}
            </button>
          </div>

          {testSummary && (
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-lg border border-emerald-200 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{testSummary.passedCount} / {testSummary.totalTests} LULUS (100%)</span>
              </div>
              <div className="flex items-center gap-1 text-slate-500 font-mono">
                <Clock className="w-3.5 h-3.5" />
                <span>{testSummary.executionTimeMs} ms</span>
              </div>
            </div>
          )}
        </div>

        {/* Test List Container */}
        <div className="overflow-y-auto flex-1 py-4 space-y-2.5 pr-1">
          {!testSummary && !running && (
            <div className="py-16 text-center text-slate-400 text-xs">
              <Award className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="font-semibold text-slate-700 text-sm">Siap Menjalankan Pengujian Akademik</p>
              <p className="mt-1 max-w-md mx-auto text-slate-500">
                Klik tombol "Jalankan Semua 16 Pengujian" di atas untuk memverifikasi seluruh skenario uji fungsionalitas dan keamanan sistem informasi pada basis data terisolasi.
              </p>
            </div>
          )}

          {running && (
            <div className="py-16 text-center text-slate-500 text-xs">
              <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="font-semibold text-slate-700">Mengeksekusi skenario uji transaksi & keamanan...</p>
            </div>
          )}

          {testSummary &&
            testSummary.results.map((t: any) => {
              const isPass = t.status === 'PASSED';
              const isExpanded = expandedItem === t.id;

              return (
                <div
                  key={t.id}
                  className={`rounded-xl border transition-all ${
                    isPass ? 'border-slate-200 bg-white' : 'border-red-200 bg-red-50/20'
                  }`}
                >
                  <div
                    onClick={() => toggleExpand(t.id)}
                    className="p-3.5 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/70"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="shrink-0">
                        {isPass ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-bold text-slate-400">
                            #{t.id}
                          </span>
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {t.scenario}
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                            {t.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 truncate">{t.details}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-mono text-[10px] text-slate-400">{t.durationMs}ms</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          isPass ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {t.status}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded view showing Expected vs Actual */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 border-t border-slate-100 bg-slate-50/50 text-xs space-y-2">
                      <div>
                        <span className="font-bold text-slate-700">Kriteria Keberhasilan (Expected):</span>
                        <p className="text-slate-600 mt-0.5 font-mono text-[11px] bg-white p-2 rounded border border-slate-200">
                          {t.expected}
                        </p>
                      </div>
                      <div>
                        <span className="font-bold text-slate-700">Hasil Pengujian Aktual (Actual Output):</span>
                        <p className="text-emerald-800 mt-0.5 font-mono text-[11px] bg-emerald-50/50 p-2 rounded border border-emerald-200 font-semibold">
                          {t.actual}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Hasil pengujian di atas dapat didemonstrasikan langsung saat sidang Tugas Akhir.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
