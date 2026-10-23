import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { Category, StoreSettings } from '../types/index.js';
import { formatRupiah, formatStock, formatDateIndo, exportToCsv } from '../utils/format.js';
import { StoreLogo } from './StoreLogo.js';
import {
  BarChart3,
  Calendar,
  Download,
  Printer,
  Package,
  ArrowDownLeft,
  ShoppingCart,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  Filter,
  CheckCircle2
} from 'lucide-react';

interface ReportsViewProps {
  categories: Category[];
  settings: StoreSettings | null;
}

type ReportType = 'current-stock' | 'stock-in' | 'sales' | 'low-stock';

export const ReportsView: React.FC<ReportsViewProps> = ({ categories, settings }) => {
  const [selectedReport, setSelectedReport] = useState<ReportType>('current-stock');
  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 86400000 * 30).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [categoryId, setCategoryId] = useState('all');

  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<any>(null);

  const fetchReport = async () => {
    setLoading(true);
    try {
      if (selectedReport === 'current-stock') {
        const res = await api.getCurrentStockReport(categoryId === 'all' ? undefined : categoryId);
        setReportData(res.data);
      } else if (selectedReport === 'stock-in') {
        const res = await api.getStockInReport({ start_date: startDate, end_date: endDate });
        setReportData(res.data);
      } else if (selectedReport === 'sales') {
        const res = await api.getSalesReport({ start_date: startDate, end_date: endDate });
        setReportData(res.data);
      } else if (selectedReport === 'low-stock') {
        const res = await api.getLowStockReport();
        setReportData(res.data);
      }
    } catch (err: any) {
      console.error('Error fetching report:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [selectedReport, startDate, endDate, categoryId]);

  // Export CSV handler
  const handleExportCsv = () => {
    if (!reportData || !reportData.items) return;

    if (selectedReport === 'current-stock') {
      const headers = ['Kode SKU', 'Nama Barang', 'Kategori', 'Satuan', 'Stok Saat Ini', 'Batas Minimum', 'Harga Modal (Rp)', 'Harga Jual (Rp)', 'Nilai Modal Persediaan (Rp)', 'Potensi Omzet (Rp)', 'Potensi Margin (Rp)', 'Status'];
      const rows = reportData.items.map((i: any) => [
        i.sku,
        i.name,
        i.category,
        i.unit,
        i.current_stock,
        i.min_stock,
        i.purchase_price,
        i.selling_price,
        i.valuation,
        i.potentialRevenue,
        i.potentialMargin,
        i.status,
      ]);
      exportToCsv(`laporan-stok-persediaan-${endDate}`, headers, rows);
    } else if (selectedReport === 'stock-in') {
      const headers = ['No. Transaksi', 'Tanggal', 'Pemasok', 'Petugas', 'Kode SKU', 'Nama Barang', 'Satuan', 'Jumlah Masuk', 'Harga Beli (Rp)', 'Subtotal (Rp)'];
      const rows = reportData.items.map((i: any) => [
        i.transaction_number,
        i.transaction_date,
        i.supplier_name,
        i.user_name,
        i.sku,
        i.name,
        i.unit,
        i.quantity,
        i.purchase_price,
        i.subtotal,
      ]);
      exportToCsv(`laporan-barang-masuk-${startDate}-sd-${endDate}`, headers, rows);
    } else if (selectedReport === 'sales') {
      const headers = ['No. Transaksi', 'Tanggal', 'Kasir', 'Metode Bayar', 'Kode SKU', 'Nama Barang', 'Satuan', 'Jumlah Terjual', 'Harga Jual (Rp)', 'Subtotal Omzet (Rp)', 'HPP Modal (Rp)', 'Laba Kotor (Rp)'];
      const rows = reportData.items.map((i: any) => [
        i.transaction_number,
        i.transaction_date,
        i.cashier_name,
        i.payment_method,
        i.sku,
        i.name,
        i.unit,
        i.quantity,
        i.selling_price,
        i.subtotal,
        i.hpp,
        i.profit,
      ]);
      exportToCsv(`laporan-penjualan-dan-laba-${startDate}-sd-${endDate}`, headers, rows);
    } else if (selectedReport === 'low-stock') {
      const headers = ['Kode SKU', 'Nama Barang', 'Kategori', 'Satuan', 'Stok Saat Ini', 'Batas Minimum', 'Kekurangan', 'Rekomendasi Order', 'Estimasi Biaya Pengadaan (Rp)', 'Status'];
      const rows = reportData.items.map((i: any) => [
        i.sku,
        i.name,
        i.category,
        i.unit,
        i.current_stock,
        i.min_stock,
        i.deficit,
        i.recommended_order,
        i.estimated_cost,
        i.status,
      ]);
      exportToCsv(`laporan-stok-kritis-restock-${endDate}`, headers, rows);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="bg-white p-5 rounded-lg border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Pusat Laporan & Rekapitulasi Persediaan
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Laporan posisi persediaan stok sembako, pergerakan barang, omzet penjualan, dan analisis pengadaan.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={handleExportCsv}
            disabled={!reportData || loading}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 disabled:opacity-40 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Ekspor CSV</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Dokumen</span>
          </button>
        </div>
      </div>

      {/* Report Selection Tabs (Clean Marketplace Styling, NO Icons Beside Numbers) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => setSelectedReport('current-stock')}
          className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
            selectedReport === 'current-stock'
              ? 'bg-slate-900 text-white border-slate-900 shadow-2xs ring-1 ring-slate-900'
              : 'bg-white text-slate-700 border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/70 shadow-2xs'
          }`}
        >
          <div>
            <span className="font-bold text-xs tracking-tight">1. Laporan Stok Saat Ini</span>
          </div>
          <p className={`text-[11px] mt-1 line-clamp-1 ${selectedReport === 'current-stock' ? 'text-slate-300' : 'text-slate-500'}`}>
            Persediaan fisik & valuasi modal
          </p>
        </button>

        <button
          type="button"
          onClick={() => setSelectedReport('stock-in')}
          className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
            selectedReport === 'stock-in'
              ? 'bg-slate-900 text-white border-slate-900 shadow-2xs ring-1 ring-slate-900'
              : 'bg-white text-slate-700 border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/70 shadow-2xs'
          }`}
        >
          <div>
            <span className="font-bold text-xs tracking-tight">2. Laporan Barang Masuk</span>
          </div>
          <p className={`text-[11px] mt-1 line-clamp-1 ${selectedReport === 'stock-in' ? 'text-slate-300' : 'text-slate-500'}`}>
            Faktur pembelian dari pemasok
          </p>
        </button>

        <button
          type="button"
          onClick={() => setSelectedReport('sales')}
          className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
            selectedReport === 'sales'
              ? 'bg-slate-900 text-white border-slate-900 shadow-2xs ring-1 ring-slate-900'
              : 'bg-white text-slate-700 border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/70 shadow-2xs'
          }`}
        >
          <div>
            <span className="font-bold text-xs tracking-tight">3. Penjualan & Laba Kotor</span>
          </div>
          <p className={`text-[11px] mt-1 line-clamp-1 ${selectedReport === 'sales' ? 'text-slate-300' : 'text-slate-500'}`}>
            Omzet, HPP, & kalkulasi laba
          </p>
        </button>

        <button
          type="button"
          onClick={() => setSelectedReport('low-stock')}
          className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
            selectedReport === 'low-stock'
              ? 'bg-slate-900 text-white border-slate-900 shadow-2xs ring-1 ring-slate-900'
              : 'bg-white text-slate-700 border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/70 shadow-2xs'
          }`}
        >
          <div>
            <span className="font-bold text-xs tracking-tight">4. Stok Kritis & Restock</span>
          </div>
          <p className={`text-[11px] mt-1 line-clamp-1 ${selectedReport === 'low-stock' ? 'text-slate-300' : 'text-slate-500'}`}>
            Rekomendasi pengadaan barang
          </p>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Date range picker for date-bound reports */}
          {(selectedReport === 'stock-in' || selectedReport === 'sales') && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="font-semibold text-slate-600">Periode:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="py-1 px-2 text-xs rounded border border-slate-300"
              />
              <span className="text-slate-400">s/d</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="py-1 px-2 text-xs rounded border border-slate-300"
              />
            </div>
          )}

          {/* Category filter for current-stock */}
          {selectedReport === 'current-stock' && (
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="font-semibold text-slate-600">Kategori:</span>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="py-1 px-2 text-xs rounded border border-slate-300 bg-white"
              >
                <option value="all">Semua Kategori</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <button
          onClick={fetchReport}
          className="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer self-end sm:self-center"
        >
          Muat Ulang Laporan
        </button>
      </div>

      {/* Summary Metrics Bar based on Report Type */}
      {reportData && reportData.summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {selectedReport === 'current-stock' && (
            <>
              <div className="bg-white p-4 rounded-lg border border-slate-200/90 shadow-2xs">
                <span className="text-[11px] uppercase font-semibold text-slate-500 tracking-wider">Total Jenis SKU</span>
                <p className="text-xl font-bold tabular-nums text-slate-900 mt-1">{reportData.summary.totalItems} item</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-slate-200/90 shadow-2xs">
                <span className="text-[11px] uppercase font-semibold text-slate-500 tracking-wider">Total Fisik Unit</span>
                <p className="text-xl font-bold tabular-nums text-slate-800 mt-1">{formatStock(reportData.summary.totalStockUnits)} unit</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-slate-200/90 shadow-2xs">
                <span className="text-[11px] uppercase font-semibold text-slate-500 tracking-wider">Total Valuasi Modal</span>
                <p className="text-xl font-bold tabular-nums text-slate-900 mt-1">{formatRupiah(reportData.summary.totalValuation)}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-slate-200/90 shadow-2xs">
                <span className="text-[11px] uppercase font-semibold text-slate-500 tracking-wider">Potensi Omzet Penjualan</span>
                <p className="text-xl font-bold tabular-nums text-slate-900 mt-1">{formatRupiah(reportData.summary.totalPotentialRevenue)}</p>
              </div>
            </>
          )}

          {selectedReport === 'stock-in' && (
            <>
              <div className="bg-white p-4 rounded-lg border border-slate-200/90 shadow-2xs">
                <span className="text-[11px] uppercase font-semibold text-slate-500 tracking-wider">Total Faktur Penerimaan</span>
                <p className="text-xl font-bold tabular-nums text-slate-900 mt-1">{reportData.summary.totalTransactions} faktur</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-slate-200/90 shadow-2xs">
                <span className="text-[11px] uppercase font-semibold text-slate-500 tracking-wider">Total Unit Diterima</span>
                <p className="text-xl font-bold tabular-nums text-slate-800 mt-1">+{reportData.summary.totalQuantity} unit</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-slate-200/90 shadow-2xs col-span-2">
                <span className="text-[11px] uppercase font-semibold text-slate-500 tracking-wider">Total Belanja Modal Masuk</span>
                <p className="text-xl font-bold tabular-nums text-slate-900 mt-1">{formatRupiah(reportData.summary.totalAmount)}</p>
              </div>
            </>
          )}

          {selectedReport === 'sales' && (
            <>
              <div className="bg-white p-4 rounded-lg border border-slate-200/90 shadow-2xs">
                <span className="text-[11px] uppercase font-semibold text-slate-500 tracking-wider">Total Omzet Penjualan</span>
                <p className="text-xl font-bold tabular-nums text-slate-900 mt-1">{formatRupiah(reportData.summary.totalRevenue)}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-slate-200/90 shadow-2xs">
                <span className="text-[11px] uppercase font-semibold text-slate-500 tracking-wider">Beban Pokok (HPP)</span>
                <p className="text-xl font-bold tabular-nums text-slate-600 mt-1">{formatRupiah(reportData.summary.totalHpp)}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-slate-200/90 shadow-2xs">
                <span className="text-[11px] uppercase font-semibold text-slate-500 tracking-wider">Laba Kotor Bersih</span>
                <p className="text-xl font-bold tabular-nums text-emerald-700 mt-1">{formatRupiah(reportData.summary.grossProfit)}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-slate-200/90 shadow-2xs">
                <span className="text-[11px] uppercase font-semibold text-slate-500 tracking-wider">Persentase Margin</span>
                <p className="text-xl font-bold tabular-nums text-slate-900 mt-1">{reportData.summary.marginPercentage}%</p>
              </div>
            </>
          )}

          {selectedReport === 'low-stock' && (
            <>
              <div className="bg-white p-4 rounded-lg border border-slate-200/90 shadow-2xs">
                <span className="text-[11px] uppercase font-semibold text-slate-500 tracking-wider">Total Barang Kritis</span>
                <p className="text-xl font-bold tabular-nums text-slate-900 mt-1">{reportData.summary.totalAlerts} item</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-slate-200/90 shadow-2xs">
                <span className="text-[11px] uppercase font-semibold text-slate-500 tracking-wider">Stok Habis (Kosong)</span>
                <p className="text-xl font-bold tabular-nums text-rose-700 mt-1">{reportData.summary.outOfStockCount} item</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-slate-200/90 shadow-2xs">
                <span className="text-[11px] uppercase font-semibold text-slate-500 tracking-wider">Stok Menipis</span>
                <p className="text-xl font-bold tabular-nums text-amber-700 mt-1">{reportData.summary.lowStockCount} item</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-slate-200/90 shadow-2xs">
                <span className="text-[11px] uppercase font-semibold text-slate-500 tracking-wider">Estimasi Modal Restock</span>
                <p className="text-xl font-bold tabular-nums text-slate-900 mt-1">{formatRupiah(reportData.summary.totalEstimatedRestockCost)}</p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Printable Report Canvas */}
      <div id="printable-report" className="bg-white rounded-lg border border-slate-200/90 shadow-2xs overflow-hidden">
        {/* Formal academic print letterhead */}
        <div className="p-6 border-b border-slate-200 text-center space-y-1.5 flex flex-col items-center">
          <div className="mb-1">
            <StoreLogo logoUrl={settings?.logo_url} storeName={settings?.store_name} size="md" />
          </div>
          <h1 className="text-base font-bold text-slate-900 uppercase tracking-tight">
            {settings?.store_name || 'TOKO SEMBAKO BERKAH MANDIRI'}
          </h1>
          <p className="text-xs text-slate-500">
            {settings?.address || 'Jl. Pemuda Raya No. 108, Rawamangun, Jakarta'} · Telp: {settings?.phone || '0812-9876-5432'}
          </p>
          <div className="pt-2">
            <span className="inline-block px-3 py-1 bg-slate-100 rounded-md text-xs font-bold uppercase tracking-wider text-slate-800">
              {selectedReport === 'current-stock' && 'Laporan Posisi Persediaan Stok Sembako'}
              {selectedReport === 'stock-in' && `Laporan Rekapitulasi Barang Masuk (Periode: ${formatDateIndo(startDate)} s/d ${formatDateIndo(endDate)})`}
              {selectedReport === 'sales' && `Laporan Analisis Penjualan & Laba Kotor (Periode: ${formatDateIndo(startDate)} s/d ${formatDateIndo(endDate)})`}
              {selectedReport === 'low-stock' && 'Laporan Deteksi Stok Kritis & Perencanaan Pengadaan'}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Dicetak pada: {new Date().toLocaleString('id-ID')}</p>
        </div>

        {/* Content Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-slate-500 text-xs">Memuat data laporan dari database...</div>
          ) : !reportData || !reportData.items || reportData.items.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs">Tidak ada data untuk periode ini.</div>
          ) : (
            <>
              {/* TABLE: Current Stock */}
              {selectedReport === 'current-stock' && (
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">SKU</th>
                      <th className="py-2.5 px-3">Nama Barang</th>
                      <th className="py-2.5 px-3">Kategori</th>
                      <th className="py-2.5 px-2 text-right">Stok</th>
                      <th className="py-2.5 px-2 text-right">Min</th>
                      <th className="py-2.5 px-3 text-right">Harga Modal</th>
                      <th className="py-2.5 px-3 text-right">Harga Jual</th>
                      <th className="py-2.5 px-3 text-right">Valuasi Modal</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {reportData.items.map((it: any) => (
                      <tr key={it.sku} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-mono font-medium text-slate-700">{it.sku}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-900">{it.name}</td>
                        <td className="py-2.5 px-3 text-slate-500">{it.category}</td>
                        <td className="py-2.5 px-2 text-right font-mono font-bold text-slate-800">
                          {formatStock(it.current_stock, it.unit)}
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono text-slate-500">{it.min_stock}</td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-600">{formatRupiah(it.purchase_price)}</td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-900">{formatRupiah(it.selling_price)}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-blue-700">{formatRupiah(it.valuation)}</td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            it.status === 'AMAN' ? 'bg-emerald-50 text-emerald-700' : it.status === 'MENIPIS' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                          }`}>
                            {it.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* TABLE: Stock In */}
              {selectedReport === 'stock-in' && (
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">No. Faktur</th>
                      <th className="py-2.5 px-3">Tanggal</th>
                      <th className="py-2.5 px-3">Pemasok</th>
                      <th className="py-2.5 px-3">Nama Barang</th>
                      <th className="py-2.5 px-2 text-right">Kuantitas</th>
                      <th className="py-2.5 px-3 text-right">Harga Beli</th>
                      <th className="py-2.5 px-3 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {reportData.items.map((it: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-mono text-slate-800">{it.transaction_number}</td>
                        <td className="py-2.5 px-3 text-slate-500">{formatDateIndo(it.transaction_date)}</td>
                        <td className="py-2.5 px-3 font-medium text-slate-800">{it.supplier_name}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-900">{it.name}</td>
                        <td className="py-2.5 px-2 text-right font-mono font-bold text-blue-700">+{it.quantity} {it.unit}</td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-600">{formatRupiah(it.purchase_price)}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">{formatRupiah(it.subtotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* TABLE: Sales & Gross Margin */}
              {selectedReport === 'sales' && (
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">No. Nota</th>
                      <th className="py-2.5 px-3">Tanggal</th>
                      <th className="py-2.5 px-3">Barang Sembako</th>
                      <th className="py-2.5 px-2 text-right">Terjual</th>
                      <th className="py-2.5 px-3 text-right">Harga Jual</th>
                      <th className="py-2.5 px-3 text-right">Omzet</th>
                      <th className="py-2.5 px-3 text-right">HPP Modal</th>
                      <th className="py-2.5 px-3 text-right">Laba Kotor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {reportData.items.map((it: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-mono text-slate-800">{it.transaction_number}</td>
                        <td className="py-2.5 px-3 text-slate-500">{formatDateIndo(it.transaction_date)}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-900">{it.name}</td>
                        <td className="py-2.5 px-2 text-right font-mono text-slate-800">{it.quantity} {it.unit}</td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-600">{formatRupiah(it.selling_price)}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">{formatRupiah(it.subtotal)}</td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-500">{formatRupiah(it.hpp)}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-700">{formatRupiah(it.profit)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* TABLE: Low Stock */}
              {selectedReport === 'low-stock' && (
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">SKU</th>
                      <th className="py-2.5 px-3">Nama Barang</th>
                      <th className="py-2.5 px-3">Kategori</th>
                      <th className="py-2.5 px-2 text-right">Stok Fisik</th>
                      <th className="py-2.5 px-2 text-right">Batas Min</th>
                      <th className="py-2.5 px-2 text-right">Defisit</th>
                      <th className="py-2.5 px-3 text-right">Saran Order</th>
                      <th className="py-2.5 px-3 text-right">Estimasi Modal</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {reportData.items.map((it: any) => (
                      <tr key={it.sku} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-mono font-medium text-slate-700">{it.sku}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-900">{it.name}</td>
                        <td className="py-2.5 px-3 text-slate-500">{it.category}</td>
                        <td className="py-2.5 px-2 text-right font-mono font-bold text-red-600">
                          {formatStock(it.current_stock, it.unit)}
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono text-slate-500">{it.min_stock}</td>
                        <td className="py-2.5 px-2 text-right font-mono text-amber-700 font-semibold">-{it.deficit}</td>
                        <td className="py-2.5 px-3 text-right font-mono text-blue-700 font-bold">+{it.recommended_order} {it.unit}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">{formatRupiah(it.estimated_cost)}</td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            it.status === 'HABIS' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {it.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
