import React from 'react';
import { DashboardData } from '../types/index.js';
import { formatRupiah, formatStock, formatDateTimeIndo } from '../utils/format.js';
import {
  Package,
  Boxes,
  AlertTriangle,
  XCircle,
  TrendingUp,
  ArrowDownLeft,
  DollarSign,
  ShoppingCart,
  Calendar,
  ArrowRight,
  Sparkles,
  CheckCircle2
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
      <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-3 border-slate-300 border-t-slate-800 rounded-full animate-spin" />
        <p className="mt-4 text-sm font-medium text-slate-500">Memuat data analisis persediaan...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-center text-slate-500">
        Gagal memuat ringkasan data dashboard.
      </div>
    );
  }

  // Calculate highest chart value for scaling
  const maxChartVal = Math.max(
    ...data.last7Days.map((d) => Math.max(d.sales, d.stockIn)),
    100000
  );

  return (
    <div className="space-y-6">
      {/* Top Welcome & Quick Summary Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            <span>Sistem Informasi Toko Sembako Berkah Mandiri</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">
            Ringkasan Persediaan & Operasional Toko
          </h2>
          <p className="text-slate-300 text-xs md:text-sm mt-1 max-w-2xl">
            Sistem monitoring stok sembako terintegrasi secara real-time dari database. Seluruh transaksi kasir dan barang masuk langsung tercatat dalam buku besar audit.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center shrink-0">
          <button
            onClick={onNavigateToSales}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs md:text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Buka Kasir POS</span>
          </button>
          <button
            onClick={onNavigateToStockIn}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs md:text-sm font-semibold rounded-lg border border-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>Catat Barang Masuk</span>
          </button>
        </div>
      </div>

      {/* Row 1: Key Inventory & Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Active Items */}
        <div
          onClick={() => onNavigateToProducts('all')}
          className="bg-white p-5 rounded-xl border border-slate-200 hover:border-slate-300 shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Jenis Barang Aktif</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 font-mono">{data.totalProducts}</span>
            <span className="text-xs text-slate-500">item terdaftar</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Total Unit Fisik:</span>
            <span className="font-semibold text-slate-700 font-mono">{formatStock(data.totalUnits)} unit</span>
          </div>
        </div>

        {/* Total Inventory Asset Value (Nilai Modal Persediaan) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Nilai Modal Persediaan</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-bold text-slate-900 font-mono">
              {formatRupiah(data.inventoryAssetValue)}
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Potensi Omzet:</span>
            <span className="font-semibold text-slate-700 font-mono">{formatRupiah(data.potentialSalesValue)}</span>
          </div>
        </div>

        {/* Low Stock Warning */}
        <div
          onClick={() => onNavigateToProducts('low')}
          className="bg-white p-5 rounded-xl border border-amber-200 bg-amber-50/20 hover:bg-amber-50/40 shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-amber-700 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Stok Menipis (Kritis)</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-amber-800 font-mono">{data.lowStockCount}</span>
            <span className="text-xs text-amber-700 font-medium">≤ batas minimum</span>
          </div>
          <div className="mt-3 pt-3 border-t border-amber-200/50 flex items-center justify-between text-xs text-amber-700">
            <span>Status:</span>
            <span className="font-semibold underline">Segera reorder</span>
          </div>
        </div>

        {/* Out of Stock Warning */}
        <div
          onClick={() => onNavigateToProducts('out')}
          className="bg-white p-5 rounded-xl border border-red-200 bg-red-50/20 hover:bg-red-50/40 shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-red-700 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Stok Habis (Kosong)</span>
            <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-red-800 font-mono">{data.outOfStockCount}</span>
            <span className="text-xs text-red-700 font-medium">0 unit</span>
          </div>
          <div className="mt-3 pt-3 border-t border-red-200/50 flex items-center justify-between text-xs text-red-700">
            <span>Status:</span>
            <span className="font-semibold underline">Etalase kosong</span>
          </div>
        </div>
      </div>

      {/* Row 2: Today's Operations KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Today's Sales */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Penjualan Hari Ini</p>
            <p className="text-lg sm:text-xl font-bold text-slate-900 font-mono">
              {formatRupiah(data.todaySalesTotalAmount)}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {data.todaySalesCount} transaksi berhasil
            </p>
          </div>
        </div>

        {/* Today's Gross Profit */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Estimasi Laba Kotor Hari Ini</p>
            <p className="text-lg sm:text-xl font-bold text-indigo-900 font-mono">
              {formatRupiah(data.todayGrossProfit)}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Omzet dikurangi HPP modal barang
            </p>
          </div>
        </div>

        {/* Today's Stock-In */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <ArrowDownLeft className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Pembelian Masuk Hari Ini</p>
            <p className="text-lg sm:text-xl font-bold text-slate-900 font-mono">
              {formatRupiah(data.todayStockInTotalAmount)}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {data.todayStockInCount} nota penerimaan pemasok
            </p>
          </div>
        </div>
      </div>

      {/* Row 3: Visual Chart: 7 Days Trend of Sales vs Purchases */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span>Tren Arus Nilai Transaksi 7 Hari Terakhir</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Perbandingan nominal penjualan kasir vs belanja penerimaan barang dari pemasok
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-emerald-500 inline-block" />
              <span className="text-slate-600 font-medium">Penjualan Kasir</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-blue-400 inline-block" />
              <span className="text-slate-600 font-medium">Barang Masuk (Modal)</span>
            </div>
          </div>
        </div>

        {/* Bar visualization */}
        <div className="grid grid-cols-7 gap-2 sm:gap-4 h-48 pt-6 pb-2 border-b border-slate-100 items-end">
          {data.last7Days.map((day) => {
            const salesHeightPct = maxChartVal > 0 ? (day.sales / maxChartVal) * 100 : 0;
            const stockInHeightPct = maxChartVal > 0 ? (day.stockIn / maxChartVal) * 100 : 0;

            return (
              <div key={day.date} className="flex flex-col items-center h-full justify-end group relative">
                {/* Tooltip on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-12 z-20 bg-slate-900 text-white text-[10px] p-1.5 rounded shadow pointer-events-none whitespace-nowrap">
                  <div>Jual: {formatRupiah(day.sales)}</div>
                  <div>Beli: {formatRupiah(day.stockIn)}</div>
                </div>

                <div className="w-full flex items-end justify-center gap-1 h-36">
                  {/* Sales bar */}
                  <div
                    style={{ height: `${Math.max(4, salesHeightPct)}%` }}
                    className="w-1/2 bg-emerald-500 hover:bg-emerald-600 rounded-t transition-all"
                  />
                  {/* Stock in bar */}
                  <div
                    style={{ height: `${Math.max(4, stockInHeightPct)}%` }}
                    className="w-1/2 bg-blue-400 hover:bg-blue-500 rounded-t transition-all"
                  />
                </div>
                <span className="text-[11px] text-slate-500 mt-2 font-medium truncate max-w-full">
                  {day.displayDate}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Row 4: Urgent Reorders Table & Top Moving Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Urgent Reorders */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Peringatan Stok Minimum & Kebutuhan Pengadaan</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Barang yang mencapai atau berada di bawah batas stok minimum
              </p>
            </div>
            <button
              onClick={() => onNavigateToProducts('low')}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 cursor-pointer"
            >
              Lihat Semua
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            {data.urgentReorders.length === 0 ? (
              <div className="p-8 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-700">Semua stok berada dalam batas aman.</p>
                <p className="text-xs text-slate-400 mt-0.5">Tidak ada barang yang memerlukan restock mendesak.</p>
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-2.5 px-4">Kode SKU</th>
                    <th className="py-2.5 px-4">Nama Barang Sembako</th>
                    <th className="py-2.5 px-3 text-right">Stok Saat Ini</th>
                    <th className="py-2.5 px-3 text-right">Batas Min.</th>
                    <th className="py-2.5 px-3 text-right">Saran Order</th>
                    <th className="py-2.5 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.urgentReorders.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-medium text-slate-700">{item.sku}</td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{item.name}</div>
                        <div className="text-[11px] text-slate-400">Satuan: {item.unit}</div>
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold">
                        <span className={item.current_stock <= 0 ? 'text-red-600' : 'text-amber-700'}>
                          {item.current_stock} {item.unit}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-500">
                        {item.min_stock} {item.unit}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-emerald-700 font-semibold">
                        +{item.shortage} {item.unit}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={onNavigateToStockIn}
                          className="px-2.5 py-1 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors cursor-pointer"
                        >
                          Restock
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right 1 Col: Top Selling Sembako */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Barang Terlaris (Fast Moving)</span>
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Berdasarkan kuantitas akumulasi penjualan kasir
          </p>

          <div className="space-y-3">
            {data.topSellingProducts.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">Belum ada riwayat penjualan.</p>
            ) : (
              data.topSellingProducts.map((p, idx) => (
                <div key={p.sku} className="p-3 bg-slate-50 rounded-lg flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-900 truncate">{p.name}</p>
                      <p className="text-[10px] font-mono text-slate-500">{p.sku}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold text-emerald-700 font-mono">{p.quantity} terjual</p>
                    <p className="text-[10px] text-slate-500">{formatRupiah(p.revenue)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Row 5: Recent Activities Audit Feed */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Aktivitas Transaksi Terkini</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Audit log real-time transaksi masuk dan keluar dari kasir & gudang
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {data.recentActivities.length === 0 ? (
            <p className="p-6 text-xs text-slate-400 text-center">Belum ada aktivitas transaksi.</p>
          ) : (
            data.recentActivities.map((act) => (
              <div key={act.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    act.type === 'SALE' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {act.type === 'SALE' ? <ShoppingCart className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-800">{act.number}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        act.status === 'completed' ? 'bg-slate-100 text-slate-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {act.status === 'completed' ? 'SELESAI' : 'DIBATALKAN'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {act.type === 'SALE' ? 'Kasir: ' : 'Pemasok: '}{act.party} · {act.itemCount} unit barang
                    </p>
                  </div>
                </div>

                <div className="sm:text-right flex sm:flex-col justify-between sm:justify-start items-center sm:items-end">
                  <span className="font-mono font-bold text-sm text-slate-900">
                    {formatRupiah(act.amount)}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {formatDateTimeIndo(act.date)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
