import React, { useState, useRef, useEffect } from 'react';
import { User, StoreSettings } from '../types/index.js';
import { 
  Menu, 
  Bell, 
  LogOut, 
  User as UserIcon, 
  ChevronDown, 
  Check, 
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

interface HeaderProps {
  user: User | null;
  settings?: StoreSettings | null;
  onLogout: () => void;
  onSwitchDemo: (role: 'admin' | 'petugas') => void;
  lowStockCount: number;
  onNavigateToLowStock: () => void;
  onToggleSidebarMobile: () => void;
  activeTabTitle: string;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  settings,
  onLogout,
  onSwitchDemo,
  lowStockCount,
  onNavigateToLowStock,
  onToggleSidebarMobile,
  activeTabTitle,
}) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isAdmin = user?.role === 'admin';

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80">
      <div className="px-4 sm:px-6 lg:px-8 h-15 flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Clean Breadcrumb trail */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onToggleSidebarMobile}
            className="p-1.5 text-slate-500 hover:text-slate-800 rounded-md lg:hidden hover:bg-slate-100 transition-colors"
            aria-label="Buka navigasi"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs truncate">
            <span className="font-semibold text-slate-500 hidden sm:inline truncate">
              {settings?.store_name || 'Toko Sembako Berkah Mandiri'}
            </span>
            <span className="text-slate-300 hidden sm:inline" aria-hidden="true">/</span>
            <span className="font-bold text-slate-900 truncate text-sm">
              {activeTabTitle}
            </span>
          </nav>
        </div>

        {/* Right: Low Stock Alert, Role switcher, User menu */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* Low Stock Indicator */}
          {lowStockCount > 0 ? (
            <button
              onClick={onNavigateToLowStock}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 rounded-md transition-colors cursor-pointer"
              title={`${lowStockCount} barang membutuhkan pemesanan ulang`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="tabular-nums font-semibold font-mono">{lowStockCount}</span>
              <span className="hidden sm:inline text-amber-800 font-medium">Stok Kritis</span>
            </button>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 px-2 py-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Stok Aman</span>
            </div>
          )}

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          {/* User Profile & Role Switcher Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer text-left"
              aria-expanded={userDropdownOpen}
              aria-haspopup="true"
            >
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-semibold">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="hidden md:block">
                <p className="text-xs font-semibold text-slate-900 leading-tight truncate max-w-[130px]">
                  {user?.name}
                </p>
                <p className="text-[11px] text-slate-500 leading-tight">
                  {isAdmin ? 'Pemilik Toko' : 'Petugas Kasir'}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {/* Dropdown Menu */}
            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50 animate-in fade-in-50 zoom-in-95">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                  <p className="text-[11px] text-slate-500 font-mono">{user?.username}</p>
                </div>

                {/* Role Switcher */}
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 mb-1.5">
                    Ganti Peran Pengguna
                  </p>
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        onSwitchDemo('admin');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-2 py-1.5 text-xs rounded hover:bg-slate-50 text-left transition-colors cursor-pointer"
                    >
                      <span className={isAdmin ? 'font-semibold text-slate-900' : 'text-slate-600'}>
                        Admin (Pemilik)
                      </span>
                      {isAdmin && <Check className="w-3.5 h-3.5 text-slate-900" />}
                    </button>
                    <button
                      onClick={() => {
                        onSwitchDemo('petugas');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-2 py-1.5 text-xs rounded hover:bg-slate-50 text-left transition-colors cursor-pointer"
                    >
                      <span className={!isAdmin ? 'font-semibold text-slate-900' : 'text-slate-600'}>
                        Petugas (Kasir)
                      </span>
                      {!isAdmin && <Check className="w-3.5 h-3.5 text-slate-900" />}
                    </button>
                  </div>
                </div>

                {/* Logout Option */}
                <div className="p-1">
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Keluar dari Akun</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
