import React, { useState } from 'react';
import { FileText, X, BookOpen, Layers, GitFork, Database, CheckCircle2, Shield, Code2, Copy, Check } from 'lucide-react';

interface AcademicDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AcademicDocsModal: React.FC<AcademicDocsModalProps> = ({ isOpen, onClose }) => {
  const [activeChapter, setActiveChapter] = useState<'ringkasan' | 'kebutuhan' | 'usecase' | 'activity' | 'erd' | 'arsitektur'>('ringkasan');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl border border-slate-200 my-8 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                Dokumentasi Akademik Tugas Akhir Sistem Informasi
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Judul: “Perancangan, Pengembangan, dan Pengelolaan Stok Barang pada Toko Sembako Berbasis Web”
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chapter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto py-3 border-b border-slate-100 shrink-0 text-xs">
          {[
            { id: 'ringkasan', label: '1. Ringkasan & Masalah', icon: BookOpen },
            { id: 'kebutuhan', label: '2. Kebutuhan Sistem', icon: Layers },
            { id: 'usecase', label: '3. Use Case & Aktor', icon: Shield },
            { id: 'activity', label: '4. Activity & Flowchart', icon: GitFork },
            { id: 'erd', label: '5. ERD & Kamus Data', icon: Database },
            { id: 'arsitektur', label: '6. Arsitektur & Integritas', icon: Code2 },
          ].map((ch) => {
            const Icon = ch.icon;
            const isActive = activeChapter === ch.id;
            return (
              <button
                key={ch.id}
                onClick={() => setActiveChapter(ch.id as any)}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{ch.label}</span>
              </button>
            );
          })}
        </div>

        {/* Chapter Body */}
        <div className="overflow-y-auto flex-1 py-4 text-xs text-slate-700 space-y-4 pr-1 leading-relaxed">
          {/* BAB 1: RINGKASAN */}
          {activeChapter === 'ringkasan' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="font-bold text-sm text-slate-900 mb-1">1.1 Latar Belakang & Identifikasi Masalah</h4>
                <p>
                  Pengelolaan persediaan pada toko sembako tradisional skala kecil-menengah di Indonesia kerap menghadapi tantangan kritis:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-600">
                  <li><b>Ketidakakuratan Saldo Stok:</b> Pencatatan manual berbasis buku atau nota kertas rentan tercecer, menyebabkan perbedaan antara persediaan fisik dan catatan.</li>
                  <li><b>Stok Negatif & Kehabisan Barang:</b> Tanpa sistem peringatan dini, kasir dapat menjual barang yang secara fisik sudah habis atau terlambat memesan ulang (reorder).</li>
                  <li><b>Pencatatan Tanpa Jejak Audit:</b> Perubahan stok tidak tercatat dalam buku besar kronologis (ledger), sehingga jika terjadi kebocoran barang atau selisih opname, penelusuran histori sulit dilakukan.</li>
                  <li><b>Pencampuran Omzet dan Keuntungan:</b> Pemilik toko kesulitan memisahkan antara pendapatan kotor (omzet) dengan margin laba kotor aktual karena harga pokok penjualan (HPP modal) tidak tersimpan secara snapshot saat transaksi terjadi.</li>
                </ul>
              </div>

              <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-200">
                <h4 className="font-bold text-sm text-blue-900 mb-1">1.2 Tujuan & Manfaat Sistem</h4>
                <ul className="list-decimal pl-5 space-y-1 text-blue-800">
                  <li>Membangun arsitektur persediaan terintegrasi dengan validasi ketat anti-stok-negatif.</li>
                  <li>Menerapkan sistem Buku Besar Pergerakan Stok (Stock Movement Ledger) yang mencatat saldo sebelum dan sesudah mutasi secara kronologis.</li>
                  <li>Menyediakan modul Kasir POS yang menyimpan snapshot harga modal (HPP) untuk kalkulasi laba kotor yang akurat.</li>
                  <li>Menghasilkan laporan komprehensif dan dashboard analitik real-time yang bersumber dari database nyata untuk keputusan manajerial pemilik toko.</li>
                </ul>
              </div>
            </div>
          )}

          {/* BAB 2: KEBUTUHAN SISTEM */}
          {activeChapter === 'kebutuhan' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-sm text-slate-900 mb-2">2.1 Kebutuhan Fungsional (Functional Requirements)</h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 font-bold text-[10px] uppercase text-slate-500">
                      <tr>
                        <th className="p-2.5 w-16">Kode FR</th>
                        <th className="p-2.5">Deskripsi Kebutuhan Fungsional</th>
                        <th className="p-2.5 w-24">Hak Akses</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr><td className="p-2.5 font-mono font-bold">FR-01</td><td className="p-2.5">Autentikasi pengguna berbasis peran (Role-Based Access Control) dengan enkripsi password PBKDF2/scrypt.</td><td className="p-2.5">Admin & Petugas</td></tr>
                      <tr><td className="p-2.5 font-mono font-bold">FR-02</td><td className="p-2.5">Dashboard monitoring metrik stok, valuasi modal persediaan, notifikasi barang kritis, dan grafik 7 hari.</td><td className="p-2.5">Admin & Petugas</td></tr>
                      <tr><td className="p-2.5 font-mono font-bold">FR-03</td><td className="p-2.5">Manajemen CRUD data barang dengan kode SKU unik, satuan pecahan desimal (kg/liter), dan batas minimum.</td><td className="p-2.5">Admin (Petugas View)</td></tr>
                      <tr><td className="p-2.5 font-mono font-bold">FR-04</td><td className="p-2.5">Perlindungan integritas referensial: pencegahan penghapusan fisik barang berriwayat (soft delete/nonaktif).</td><td className="p-2.5">Sistem Backend</td></tr>
                      <tr><td className="p-2.5 font-mono font-bold">FR-05</td><td className="p-2.5">Pencatatan transaksi barang masuk dari pemasok dengan nomor faktur unik otomatis dan penambahan stok.</td><td className="p-2.5">Admin & Petugas</td></tr>
                      <tr><td className="p-2.5 font-mono font-bold">FR-06</td><td className="p-2.5">Point of Sale (Kasir) dengan validasi ketersediaan stok fisik real-time sebelum transaksi dapat disimpan.</td><td className="p-2.5">Admin & Petugas</td></tr>
                      <tr><td className="p-2.5 font-mono font-bold">FR-07</td><td className="p-2.5">Pencatatan snapshot harga beli modal (HPP) pada setiap detail penjualan demi keakuratan laba kotor.</td><td className="p-2.5">Sistem Backend</td></tr>
                      <tr><td className="p-2.5 font-mono font-bold">FR-08</td><td className="p-2.5">Pencetakan struk pembayaran kasir format standar printer thermal 80mm.</td><td className="p-2.5">Admin & Petugas</td></tr>
                      <tr><td className="p-2.5 font-mono font-bold">FR-09</td><td className="p-2.5">Stok Opname dan Penyesuaian persediaan fisik dengan kewajiban mengisi alasan mutasi.</td><td className="p-2.5">Admin Only</td></tr>
                      <tr><td className="p-2.5 font-mono font-bold">FR-10</td><td className="p-2.5">Buku Besar Mutasi Stok (Ledger) mencatat saldo awal, qty masuk/keluar, saldo akhir, dan nomor referensi.</td><td className="p-2.5">Admin & Petugas</td></tr>
                      <tr><td className="p-2.5 font-mono font-bold">FR-11</td><td className="p-2.5">Pusat Laporan multi-kategori dengan filter tanggal, format cetak resmi, dan ekspor data CSV/Excel.</td><td className="p-2.5">Admin & Petugas</td></tr>
                      <tr><td className="p-2.5 font-mono font-bold">FR-12</td><td className="p-2.5">Mekanisme pembatalan/retur transaksi dengan jurnal pembalik mutasi stok tanpa menghapus riwayat.</td><td className="p-2.5">Admin Only</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-sm text-slate-900 mb-2">2.2 Kebutuhan Non-Fungsional (Non-Functional Requirements)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-800">NFR-01: Integritas Transaksional (ACID)</span>
                    <p className="text-[11px] text-slate-600 mt-1">Menggunakan mekanisme snapshot locking dan atomic rollback saat eksekusi mutasi multi-tabel.</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-800">NFR-02: Keamanan Otorisasi Sisi Server</span>
                    <p className="text-[11px] text-slate-600 mt-1">Otorisasi diperiksa langsung pada middleware Express/REST API, bukan sekadar menyembunyikan tombol UI.</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-800">NFR-03: Presisi Numerik Uang & Stok</span>
                    <p className="text-[11px] text-slate-600 mt-1">Menggunakan tipe integer mutlak untuk mata uang Rupiah dan pembulatan terstandardisasi untuk stok desimal.</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-800">NFR-04: Ketanggapan Antarmuka (Responsiveness)</span>
                    <p className="text-[11px] text-slate-600 mt-1">Antarmuka adaptif untuk perangkat desktop gudang, tablet etalase, dan smartphone operasional.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* BAB 3: USE CASE & AKTOR */}
          {activeChapter === 'usecase' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="font-bold text-sm text-slate-900 mb-2">3.1 Matriks Otorisasi Aktor Sistem</h4>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-white border-b border-slate-200 font-bold text-[10px] text-slate-500 uppercase">
                      <tr>
                        <th className="p-2">Fitur / Kasus Penggunaan</th>
                        <th className="p-2 text-center w-28">Admin (Owner)</th>
                        <th className="p-2 text-center w-28">Petugas Kasir</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-[11px]">
                      <tr><td className="p-2">Login & Logout Sistem</td><td className="p-2 text-center font-bold text-emerald-600">✓ Ya</td><td className="p-2 text-center font-bold text-emerald-600">✓ Ya</td></tr>
                      <tr><td className="p-2">Lihat Dashboard Persediaan & Penjualan</td><td className="p-2 text-center font-bold text-emerald-600">✓ Ya</td><td className="p-2 text-center font-bold text-emerald-600">✓ Ya</td></tr>
                      <tr><td className="p-2">Tambah & Ubah Master Barang & SKU</td><td className="p-2 text-center font-bold text-emerald-600">✓ Ya</td><td className="p-2 text-center font-bold text-red-500">✗ Tidak (Lihat Saja)</td></tr>
                      <tr><td className="p-2">Kelola Kategori & Pemasok</td><td className="p-2 text-center font-bold text-emerald-600">✓ Ya</td><td className="p-2 text-center font-bold text-red-500">✗ Tidak</td></tr>
                      <tr><td className="p-2">Catat Penerimaan Barang Masuk (Faktur)</td><td className="p-2 text-center font-bold text-emerald-600">✓ Ya</td><td className="p-2 text-center font-bold text-emerald-600">✓ Ya</td></tr>
                      <tr><td className="p-2">Proses Transaksi Kasir POS & Cetak Struk</td><td className="p-2 text-center font-bold text-emerald-600">✓ Ya</td><td className="p-2 text-center font-bold text-emerald-600">✓ Ya</td></tr>
                      <tr><td className="p-2">Stok Opname / Penyesuaian Saldo Fisik</td><td className="p-2 text-center font-bold text-emerald-600">✓ Ya</td><td className="p-2 text-center font-bold text-red-500">✗ Tidak</td></tr>
                      <tr><td className="p-2">Batalkan Transaksi / Retur Barang</td><td className="p-2 text-center font-bold text-emerald-600">✓ Ya</td><td className="p-2 text-center font-bold text-red-500">✗ Tidak</td></tr>
                      <tr><td className="p-2">Lihat & Ekspor Laporan Analitik</td><td className="p-2 text-center font-bold text-emerald-600">✓ Ya</td><td className="p-2 text-center font-bold text-emerald-600">✓ Ya</td></tr>
                      <tr><td className="p-2">Kelola Akun Pengguna & Reset Password</td><td className="p-2 text-center font-bold text-emerald-600">✓ Ya</td><td className="p-2 text-center font-bold text-red-500">✗ Tidak</td></tr>
                      <tr><td className="p-2">Pengaturan Identitas Toko & Profil</td><td className="p-2 text-center font-bold text-emerald-600">✓ Ya</td><td className="p-2 text-center font-bold text-red-500">✗ Tidak</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* BAB 4: ACTIVITY & FLOWCHART */}
          {activeChapter === 'activity' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="font-bold text-sm text-slate-900 mb-2">4.1 Flowchart Transaksi Barang Masuk (Penerimaan)</h4>
                <div className="bg-slate-900 text-slate-100 p-3 rounded-lg font-mono text-[11px] leading-relaxed">
                  [Mulai] → [Pilih Pemasok & Tanggal]<br />
                  &nbsp;&nbsp;↓<br />
                  [Input Item Barang, Kuantitas Masuk, & Harga Modal]<br />
                  &nbsp;&nbsp;↓<br />
                  [Sistem Validasi Kuantitas &gt; 0]<br />
                  &nbsp;&nbsp;↓<br />
                  [Buka Database Transaction & Mutex Lock]<br />
                  &nbsp;&nbsp;↓<br />
                  [Simpan Header & Detail Faktur Masuk (TRX-IN-YYYYMMDD-XXX)]<br />
                  &nbsp;&nbsp;↓<br />
                  [Update current_stock = current_stock + qty]<br />
                  &nbsp;&nbsp;↓<br />
                  [Catat Entri Buku Besar (movement_type = 'IN')]<br />
                  &nbsp;&nbsp;↓<br />
                  [Commit Transaction & Simpan ke Disk] → [Selesai]
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="font-bold text-sm text-slate-900 mb-2">4.2 Flowchart Kasir Penjualan POS (Anti Stok Negatif)</h4>
                <div className="bg-slate-900 text-slate-100 p-3 rounded-lg font-mono text-[11px] leading-relaxed">
                  [Kasir Pilih Barang ke Keranjang]<br />
                  &nbsp;&nbsp;↓<br />
                  [Validasi Stok: Apakah current_stock &gt;= kuantitas diminta?]<br />
                  &nbsp;&nbsp;├─ [TIDAK] ──→ [TOLAK TRANSAKSI: Tampilkan Peringatan Stok Kurang]<br />
                  &nbsp;&nbsp;↓ [YA]<br />
                  [Input Nominal Bayar: Validasi Uang Diterima &gt;= Total Belanja]<br />
                  &nbsp;&nbsp;↓<br />
                  [Buka Database Transaction: Snapshot HPP & Kurangi current_stock]<br />
                  &nbsp;&nbsp;↓<br />
                  [Catat Entri Buku Besar (movement_type = 'SALE')]<br />
                  &nbsp;&nbsp;↓<br />
                  [Commit Transaction] → [Cetak Struk Thermal 80mm] → [Selesai]
                </div>
              </div>
            </div>
          )}

          {/* BAB 5: ERD & KAMUS DATA */}
          {activeChapter === 'erd' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="font-bold text-sm text-slate-900 mb-2">5.1 Entity Relationship Diagram (ERD Relasional)</h4>
                <div className="bg-slate-900 text-emerald-400 p-3 rounded-lg font-mono text-[11px] overflow-x-auto leading-relaxed">
                  [categories] 1 ──── N [products] 1 ──── N [stock_movements]<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│<br />
                  [suppliers] 1 ── N [stock_in_transactions] 1 ── N [stock_in_details] N ── 1 [products]<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│<br />
                  [users] 1 ─────── N [sales_transactions] 1 ──── N [sales_details] N ────── 1 [products]<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│<br />
                  [users] 1 ─────── N [stock_adjustments] N ────────────────────────── 1 [products]
                </div>
              </div>

              <div>
                <h4 className="font-bold text-sm text-slate-900 mb-2">5.2 Kamus Data Utama (Data Dictionary)</h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 font-bold text-[10px] text-slate-500 uppercase">
                      <tr>
                        <th className="p-2">Tabel</th>
                        <th className="p-2">Atribut Kunci</th>
                        <th className="p-2">Tipe Data</th>
                        <th className="p-2">Keterangan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-[11px]">
                      <tr><td className="p-2 font-bold font-mono">products</td><td className="p-2 font-mono">sku</td><td className="p-2 font-mono text-blue-600">VARCHAR(50) UNIQUE</td><td className="p-2">Kode unik identitas barang sembako</td></tr>
                      <tr><td className="p-2 font-bold font-mono">products</td><td className="p-2 font-mono">current_stock</td><td className="p-2 font-mono text-blue-600">DECIMAL(10,2)</td><td className="p-2">Saldo persediaan (mendukung satuan timbang kg/liter)</td></tr>
                      <tr><td className="p-2 font-bold font-mono">products</td><td className="p-2 font-mono">min_stock</td><td className="p-2 font-mono text-blue-600">INT</td><td className="p-2">Ambang batas peringatan restock</td></tr>
                      <tr><td className="p-2 font-bold font-mono">products</td><td className="p-2 font-mono">purchase_price</td><td className="p-2 font-mono text-blue-600">DECIMAL(12,2)</td><td className="p-2">Harga modal beli terakhir dari distributor</td></tr>
                      <tr><td className="p-2 font-bold font-mono">sales_details</td><td className="p-2 font-mono">purchase_price_snapshot</td><td className="p-2 font-mono text-blue-600">DECIMAL(12,2)</td><td className="p-2">Snapshot modal saat transaksi terjadi (basis HPP)</td></tr>
                      <tr><td className="p-2 font-bold font-mono">stock_movements</td><td className="p-2 font-mono">movement_type</td><td className="p-2 font-mono text-blue-600">ENUM(IN, SALE, ADJ)</td><td className="p-2">Tipe pergerakan mutasi buku besar</td></tr>
                      <tr><td className="p-2 font-bold font-mono">stock_movements</td><td className="p-2 font-mono">balance_after</td><td className="p-2 font-mono text-blue-600">DECIMAL(10,2)</td><td className="p-2">Saldo stok setelah mutasi terjadi</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* BAB 6: ARSITEKTUR & INTEGRITAS */}
          {activeChapter === 'arsitektur' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="font-bold text-sm text-slate-900 mb-2">6.1 Desain Arsitektur & Prinsip Integritas</h4>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                  <li><b>Arsitektur Full-Stack REST API:</b> Menggunakan backend Express.js terisolasi yang mengeksekusi operasi transaksi atomik dengan penguncian mutex asinkron untuk mencegah race condition.</li>
                  <li><b>Single Source of Truth:</b> Saldo persediaan pada tabel <code>products</code> selalu konsisten dengan kalkulasi saldo kumulatif pada <code>stock_movements</code>.</li>
                  <li><b>Audit Trail Transaksional:</b> Tidak ada modifikasi stok yang dapat terjadi secara diam-diam. Setiap barang masuk, transaksi penjualan, penyesuaian opname, dan retur wajib mencantumkan user yang bertanggung jawab, waktu, dan nomor referensi.</li>
                  <li><b>Pemisahan Omzet & Laba Bersih:</b> Sistem menghitung Laba Kotor = <code>Total Penjualan - Akumulasi HPP Snapshot</code>, memberikan data akurat bagi pemilik toko dalam mengevaluasi kinerja finansial.</li>
                </ul>
              </div>

              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <h4 className="font-bold text-sm text-emerald-900 mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Kesiapan Sidang Tugas Akhir</span>
                </h4>
                <p className="text-emerald-800 text-[11px]">
                  Aplikasi telah dilengkapi dengan runner pengujian 16 skenario yang dapat dijalankan secara langsung di hadapan dosen penguji sebagai bukti empiris bahwa seluruh kebutuhan fungsional dan aturan bisnis telah terimplementasi secara valid.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Disusun untuk Sidang Sarjana Program Studi Sistem Informasi.</span>
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
