import React from 'react';
import { DashboardData } from '../types/index.js';
import { formatRupiah, formatStock, formatDateTimeIndo } from '../utils/format.js';
import { SplineChart } from './SplineChart.js';
import {
  Package,
  AlertTriangle,
  ArrowDownLeft,
  DollarSign,
  ShoppingCart,
  Calendar,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Boxes
} from 'lucide-react';

interface DashboardViewProps {
  data: DashboardData | null;
  loading: boolean;
  onNavigateToStockIn: () => void;
  onNavigateToProducts: (filterStatus?: string) => void;
  onNavigateToSales: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  data,
  loading,
  onNavigateToStockIn,
  onNavigateToProducts,
  onNavigateToSales,
}) => {
  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-slate-300 border-t-emerald-600 rounded-full animate-spin" />
        <p className="mt-3 text-xs text-slate-500 font-medium">Memuat data persediaan toko...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-12 text-center text-xs text-slate-500">
        Data persediaan tidak tersedia atau gagal dimuat.
      </div>
    );
  }

  // Calculate highest chart value for scaling
  const maxChartVal = Math.max(
    ...data.last7Days.map((d) => Math.max(d.sales, d.stockIn)),
    500000
  );

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Ringkasan Persediaan & Kasir
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pantau sisa stok barang sembako, pencatatan belanja modal, dan laba penjualan kasir secara langsung.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
          <button
            onClick={onNavigateToStockIn}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 shadow-2xs transition-colors cursor-pointer flex items-center gap-2"
          >
            <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" />
            <span>+ Catat Barang Masuk</span>
          </button>
          <button
            onClick={onNavigateToSales}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer flex items-center gap-2"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Buka Kasir Penjualan</span>
          </button>
        </div>
      </div>

      {/* Row 1: KPI Stat Grid (Clean, Friendly, Easy to Understand, NO Icons Beside Numbers) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Laporan Stok Saat Ini (Komoditas Aktif & Total Fisik) */}
        <div
          onClick={() => onNavigateToProducts('all')}
          className="bg-white p-4.5 rounded-xl border border-slate-200/90 hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="mb-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Laporan Stok Saat Ini
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tabular-nums text-slate-900">
              {data.totalProducts}
            </span>
            <span className="text-xs text-slate-500 font-medium">Jenis Barang</span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between items-center">
            <span>Total Fisik di Toko:</span>
            <span className="font-semibold text-slate-800 tabular-nums">
              {formatStock(data.totalUnits)} unit
            </span>
          </div>
        </div>

        {/* KPI 2: Laporan Barang Masuk / Nilai Modal HPP */}
        <div className="bg-white p-4.5 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="mb-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Laporan Barang Masuk & Modal
            </span>
          </div>
          <div className="flex items-baseline">
            <span className="text-xl font-bold tabular-nums text-slate-900 truncate">
              {formatRupiah(data.inventoryAssetValue)}
            </span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between items-center">
            <span>Estimasi Nilai Jual:</span>
            <span className="font-semibold text-slate-700 tabular-nums truncate max-w-[140px]">
              {formatRupiah(data.potentialSalesValue)}
            </span>
          </div>
        </div>

        {/* KPI 3: Penjualan & Laba Kotor */}
        <div className="bg-white p-4.5 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="mb-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Penjualan & Laba Kotor
            </span>
          </div>
          <div className="flex items-baseline">
            <span className="text-xl font-bold tabular-nums text-slate-900 truncate">
              {formatRupiah(data.todaySalesTotalAmount)}
            </span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between items-center">
            <span>{data.todaySalesCount} transaksi kasir</span>
            <span className="font-semibold text-emerald-700 tabular-nums">
              +{formatRupiah(data.todayGrossProfit)} laba
            </span>
          </div>
        </div>

        {/* KPI 4: Stok Kritis & Restock */}
        <div
          onClick={() => onNavigateToProducts('low')}
          className="bg-white p-4.5 rounded-xl border border-slate-200/90 hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="mb-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Stok Kritis & Restock
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-2xl font-bold tabular-nums ${
              data.outOfStockCount > 0 ? 'text-rose-700' : data.lowStockCount > 0 ? 'text-amber-700' : 'text-slate-900'
            }`}>
              {data.lowStockCount + data.outOfStockCount}
            </span>
            <span className="text-xs text-slate-500 font-medium">Perlu Dipesan</span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between items-center">
            <span className="text-rose-700 font-semibold">{data.outOfStockCount} habis total</span>
            <span className="text-amber-800 font-semibold">{data.lowStockCount} menipis</span>
          </div>
        </div>
      </div>

      {/* Row 2: Operational Charts & Fast Moving */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: Smooth Bezier Spline Curve Graph */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
          <SplineChart data={data.last7Days} />
        </div>

        {/* Right 1 Col: Top Moving Products */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Komoditas Terlaris
              </h3>
              <span className="text-[11px] text-emerald-700 font-semibold">Fast Moving</span>
            </div>
            <p className="text-[11px] text-slate-500 mb-4">
              Berdasarkan akumulasi kuantitas penjualan kasir
            </p>

            <div className="space-y-2.5">
              {data.topSellingProducts.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center font-medium">Belum ada transaksi.</p>
              ) : (
                data.topSellingProducts.slice(0, 5).map((p, idx) => (
                  <div key={p.sku} className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/60 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-5 h-5 rounded-full bg-slate-200/70 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-900 truncate">{p.name}</p>
                        <p className="text-[11px] text-slate-500 font-medium">{p.sku}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold text-slate-900 tabular-nums">
                        {p.quantity} terjual
                      </p>
                      <p className="text-[11px] text-slate-500 tabular-nums">
                        {formatRupiah(p.revenue)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={() => onNavigateToProducts('all')}
            className="w-full mt-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-colors text-center cursor-pointer shadow-2xs"
          >
            Buka Katalog Master SKU
          </button>
        </div>
      </div>

      {/* Row 3: Urgent Reorders Table & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: Urgent Reorders Table */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Kebutuhan Pengadaan Barang (Stok Rendah)</span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Barang yang telah mencapai atau di bawah ambang batas minimum persediaan
              </p>
            </div>
            <button
              onClick={() => onNavigateToProducts('low')}
              className="text-xs text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1 cursor-pointer"
            >
              Lihat Detail
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="overflow-x-auto">
            {data.urgentReorders.length === 0 ? (
              <div className="p-8 text-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-800">Semua stok berada dalam batas aman</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Tidak ada barang yang memerlukan restock darurat.</p>
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 text-[10px] font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-4 font-semibold text-slate-600">Kode SKU</th>
                    <th className="py-2.5 px-4 font-semibold text-slate-600">Nama Komoditas</th>
                    <th className="py-2.5 px-3 text-right font-semibold text-slate-600">Stok Fisik</th>
                    <th className="py-2.5 px-3 text-right font-semibold text-slate-600">Batas Min.</th>
                    <th className="py-2.5 px-3 text-right font-semibold text-slate-600">Saran Order</th>
                    <th className="py-2.5 px-4 text-center font-semibold text-slate-600">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.urgentReorders.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-2.5 px-4 text-slate-600 text-[11px] font-medium">{item.sku}</td>
                      <td className="py-2.5 px-4">
                        <div className="font-semibold text-slate-900">{item.name}</div>
                        <div className="text-[10px] text-slate-400">Satuan: {item.unit}</div>
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold tabular-nums">
                        <span className={item.current_stock <= 0 ? 'text-rose-700' : 'text-amber-800'}>
                          {item.current_stock} {item.unit}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-500 tabular-nums">
                        {item.min_stock} {item.unit}
                      </td>
                      <td className="py-2.5 px-3 text-right text-emerald-700 font-semibold tabular-nums">
                        +{item.shortage} {item.unit}
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        <button
                          onClick={onNavigateToStockIn}
                          className="px-2.5 py-1 text-[11px] font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-md transition-colors cursor-pointer shadow-2xs"
                        >
                          Catat Masuk
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right 1 Col: Audit Log */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="px-5 py-3.5 border-b border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Log Transaksi Terakhir
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Audit trail kasir dan penerimaan barang
              </p>
            </div>

            <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
              {data.recentActivities.length === 0 ? (
                <p className="p-6 text-xs text-slate-400 text-center font-medium">Belum ada mutasi.</p>
              ) : (
                data.recentActivities.map((act) => (
                  <div key={act.id} className="p-3 hover:bg-slate-50/60 transition-colors">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-900">{act.number}</span>
                      <span className="font-bold text-slate-900 tabular-nums">
                        {formatRupiah(act.amount)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>{act.type === 'SALE' ? 'Penjualan' : 'Penerimaan'} · {act.party}</span>
                      <span className="text-[10px] text-slate-400">
                        {act.date.split(' ')[0]}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="p-3 border-t border-slate-100 bg-slate-50/50">
            <span className="text-[11px] text-slate-500 flex items-center justify-between">
              <span>Status Transaksi</span>
              <span className="text-emerald-700 font-semibold">Sinkron</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
