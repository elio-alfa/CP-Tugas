import React from 'react';
import { User } from '../types/index.js';
import { 
  Store, 
  UserCheck, 
  LogOut, 
  AlertTriangle, 
  Menu,
  ShieldAlert,
  ArrowRightLeft
} from 'lucide-react';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
  onSwitchDemo: (role: 'admin' | 'petugas') => void;
  lowStockCount: number;
  onNavigateToLowStock: () => void;
  onToggleSidebarMobile: () => void;
  activeTabTitle: string;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onLogout,
  onSwitchDemo,
  lowStockCount,
  onNavigateToLowStock,
  onToggleSidebarMobile,
  activeTabTitle,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
      <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Left: Mobile menu toggle + Page title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebarMobile}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-lg lg:hidden hover:bg-slate-100 transition-colors"
            aria-label="Buka navigasi"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>{activeTabTitle}</span>
            </h1>
            <p className="text-xs text-slate-500 hidden sm:block">
              Toko Sembako Berkah Mandiri · Sistem Informasi Manajemen Stok
            </p>
          </div>
        </div>

        {/* Right: Actions, Demo Switcher, Low stock alert, Academic tools, and User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Low Stock Warning Button */}
          {lowStockCount > 0 && (
            <button
              onClick={onNavigateToLowStock}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors cursor-pointer"
              title="Lihat barang yang memerlukan reorder"
            >
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span className="hidden md:inline">Perlu Restock:</span>
              <span className="font-bold">{lowStockCount} item</span>
            </button>
          )}

          {/* Academic Demo Role Switcher */}
          <div className="hidden xl:flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <span className="text-[11px] font-medium text-slate-500 px-2 flex items-center gap-1">
              <ArrowRightLeft className="w-3 h-3" />
              Demo Role:
            </span>
            <button
              onClick={() => onSwitchDemo('admin')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
                user?.role === 'admin'
                  ? 'bg-slate-900 text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              Admin (Pemilik)
            </button>
            <button
              onClick={() => onSwitchDemo('petugas')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
                user?.role === 'petugas'
                  ? 'bg-emerald-700 text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              Petugas (Kasir)
            </button>
          </div>

          {/* Active User Badge & Logout */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="text-right hidden md:block">
              <p className="text-xs font-semibold text-slate-900 leading-none">{user?.name}</p>
              <p className="text-[10px] text-slate-500 mt-0.5 flex items-center justify-end gap-1">
                {user?.role === 'admin' ? (
                  <span className="text-indigo-600 font-semibold">Administrator</span>
                ) : (
                  <span className="text-emerald-700 font-semibold">Petugas Kasir</span>
                )}
              </p>
            </div>

            <button
              onClick={onLogout}
              className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              title="Logout dari sistem"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
