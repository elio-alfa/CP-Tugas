import React from 'react';
import { User } from '../types/index.js';
import {
  LayoutDashboard,
  Package,
  Layers,
  Truck,
  ArrowDownLeft,
  ShoppingCart,
  Sliders,
  History,
  BarChart3,
  Users,
  Settings,
  Shield,
  X,
  Store
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'products'
  | 'categories'
  | 'suppliers'
  | 'stock-in'
  | 'sales-pos'
  | 'stock-opname'
  | 'stock-movements'
  | 'reports'
  | 'users'
  | 'settings';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  user: User | null;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  user,
  isOpenMobile,
  onCloseMobile,
}) => {
  const isAdmin = user?.role === 'admin';

  const navItem = (tab: NavTab, label: string, Icon: React.ElementType, adminOnly = false) => {
    if (adminOnly && !isAdmin) return null;
    const isActive = activeTab === tab;

    return (
      <button
        key={tab}
        onClick={() => {
          onSelectTab(tab);
          onCloseMobile();
        }}
        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer text-left ${
          isActive
            ? 'bg-slate-900 text-white shadow-xs'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
        }`}
      >
        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
        <span className="truncate">{label}</span>
      </button>
    );
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top: Logo & Store Brand */}
        <div>
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold shadow-xs">
                <Store className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 leading-tight">TOKO SEMBAKO</h2>
                <p className="text-[11px] font-semibold text-emerald-700">BERKAH MANDIRI</p>
              </div>
            </div>

            {/* Close button for mobile */}
            <button
              onClick={onCloseMobile}
              className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav List */}
          <nav className="p-3 space-y-6 overflow-y-auto max-h-[calc(100vh-140px)]">
            {/* Nav Group: UTAMA */}
            <div>
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Utama
              </p>
              <div className="space-y-1">
                {navItem('dashboard', 'Dashboard Stok', LayoutDashboard)}
              </div>
            </div>

            {/* Nav Group: MASTER DATA */}
            <div>
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Master Data
              </p>
              <div className="space-y-1">
                {navItem('products', 'Data Barang & SKU', Package)}
                {navItem('categories', 'Kategori Barang', Layers)}
                {navItem('suppliers', 'Data Pemasok', Truck)}
              </div>
            </div>

            {/* Nav Group: TRANSAKSI */}
            <div>
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Transaksi
              </p>
              <div className="space-y-1">
                {navItem('stock-in', 'Barang Masuk', ArrowDownLeft)}
                {navItem('sales-pos', 'Kasir POS (Penjualan)', ShoppingCart)}
              </div>
            </div>

            {/* Nav Group: KONTROL STOK */}
            <div>
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Kontrol Persediaan
              </p>
              <div className="space-y-1">
                {navItem('stock-opname', 'Stok Opname / Penyesuaian', Sliders, true)}
                {navItem('stock-movements', 'Buku Besar Mutasi', History)}
              </div>
            </div>

            {/* Nav Group: REKAPITULASI & LAPORAN */}
            <div>
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Laporan & Rekap
              </p>
              <div className="space-y-1">
                {navItem('reports', 'Pusat Laporan', BarChart3)}
              </div>
            </div>

            {/* Nav Group: PENGATURAN (ADMIN ONLY) */}
            {isAdmin && (
              <div>
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
                  <span>Sistem</span>
                  <Shield className="w-3 h-3 text-indigo-500" />
                </p>
                <div className="space-y-1">
                  {navItem('users', 'Kelola Pengguna', Users, true)}
                  {navItem('settings', 'Pengaturan Toko', Settings, true)}
                </div>
              </div>
            )}
          </nav>
        </div>

        {/* Bottom Profile Bar */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/70">
          <div className="flex items-center gap-3 px-2 py-1.5 rounded-lg">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
              isAdmin ? 'bg-indigo-100 text-indigo-800' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {user?.username.slice(0, 2).toUpperCase() || 'US'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-slate-900 truncate">{user?.name}</p>
              <p className="text-[11px] text-slate-500 truncate">
                {isAdmin ? 'Administrator (Owner)' : 'Petugas Kasir/Gudang'}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
