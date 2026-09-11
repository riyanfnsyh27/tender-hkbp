import React from 'react';
import {
  Lock,
  LockOpen,
  ShieldAlert,
  ArrowDown10,
  Mail,
  Phone,
  FileDown,
  Check,
  Trophy,
  Trash2,
  Ban
} from 'lucide-react';
import { formatRupiah, createSamplePdfDataUrl } from '../data';
import type { BidItem } from '../types';

interface SectionBidsProps {
  bids: BidItem[];
  winnerBidId: string | null;
  deadlineIso: string;
  isAdminLoggedIn: boolean;
  isSuperAdmin: boolean;
  onSetWinner: (bidId: string) => void;
  onUnsetWinner: () => void;
  onDeleteBid: (bidId: string) => void;
}

export const SectionBids: React.FC<SectionBidsProps> = ({
  bids,
  winnerBidId,
  deadlineIso,
  isSuperAdmin,
  onSetWinner,
  onUnsetWinner,
  onDeleteBid,
}) => {
  const deadlineDate = new Date(deadlineIso);
  const isDeadlinePassed = new Date().getTime() >= deadlineDate.getTime();
  const canViewBids = isDeadlinePassed || isSuperAdmin;
  const deadlineStr =
    deadlineDate.toLocaleString('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }) + ' WIB';

  // Sort bids by lowest price first
  const sortedBids = [...bids].sort((a, b) => a.harga - b.harga);

  return (
    <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-4 mb-6 gap-3">
        <div>
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
            Halaman Evaluasi Admin
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Daftar Penawaran Masuk (Urut Harga Terendah)
          </h2>
        </div>
        <div className="text-xs px-3 py-1.5 rounded-lg font-bold bg-amber-100 border border-amber-300 text-amber-900 flex items-center gap-1.5">
          <ArrowDown10 className="w-3.5 h-3.5" />
          <span>Diurutkan: Harga Terendah &rarr; Tertinggi</span>
        </div>
      </div>

      {/* Locked message if deadline not passed and not superadmin */}
      {!canViewBids ? (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-8 text-center my-4">
          <div className="w-16 h-16 bg-amber-500 text-white rounded-full flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-extrabold text-amber-900 mb-2">
            Penawaran Masih Terkunci Otomatis
          </h3>
          <p className="text-amber-800 text-sm max-w-2xl mx-auto">
            Sesuai regulasi pengadaan barang/jasa, Admin <strong>hanya dapat membuka dan melihat daftar penawaran</strong> setelah masa pemasukan berkas berakhir dan memasuki tahap evaluasi.
          </p>
          <div className="mt-4 inline-block bg-white px-4 py-2 rounded-xl border border-amber-300 text-xs font-bold text-amber-900">
            Batas Pemasukan Berkas:{' '}
            <span className="text-emerald-700 font-extrabold">{deadlineStr}</span>
          </div>
        </div>
      ) : (
        <div>
          {isDeadlinePassed ? (
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl mb-4 text-xs text-emerald-800 flex items-center gap-2">
              <LockOpen className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Tenggat waktu penawaran telah berakhir! Semua penawaran diurutkan berdasarkan <strong>harga terendah ke tertinggi</strong> untuk mempermudah evaluasi panitia. Admin dapat mengunduh berkas PDF penawaran dan menandai pemenang.
              </span>
            </div>
          ) : (
            isSuperAdmin && (
              <div className="bg-purple-50 border border-purple-300 p-4 rounded-xl mb-4 text-xs text-purple-900 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-purple-600 shrink-0" />
                <span>
                  Anda melihat seluruh data penawaran sebagai <strong>SUPER ADMIN</strong> meskipun masa pemasukan penawaran <strong>belum resmi ditutup</strong>. Gunakan akses ini secara bertanggung jawab.
                </span>
              </div>
            )
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-800 text-white font-bold text-xs uppercase">
                  <th className="p-3 text-center">Peringkat Harga</th>
                  <th className="p-3">Waktu Masuk</th>
                  <th className="p-3">Peserta / Perusahaan</th>
                  <th className="p-3">Kontak (Email / WA)</th>
                  <th className="p-3">Harga Penawaran</th>
                  <th className="p-3">Dokumen PDF (Download)</th>
                  <th className="p-3 text-center">Status / Aksi Pemenang</th>
                  {isSuperAdmin && (
                    <th className="p-3 text-center">Aksi Super Admin</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {sortedBids.length > 0 ? (
                  sortedBids.map((bid, index) => {
                    const isWinner = winnerBidId === bid.id;
                    const pdfDownloadUrl =
                      bid.pdfDataUrl || createSamplePdfDataUrl(bid.pdfName);

                    return (
                      <tr
                        key={bid.id}
                        className={`hover:bg-slate-50 transition ${
                          isWinner ? 'bg-amber-50/80 border-l-4 border-amber-500' : ''
                        }`}
                      >
                        <td className="p-3 text-center whitespace-nowrap">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-xs font-black ${
                              index === 0
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            #{index + 1} {index === 0 ? '(Harga Terendah)' : ''}
                          </span>
                        </td>
                        <td className="p-3 text-xs text-slate-500 whitespace-nowrap">
                          {bid.timestamp}
                        </td>
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{bid.nama}</div>
                          <div className="text-xs text-slate-500 font-medium">
                            {bid.perusahaan || 'Peserta Perorangan'}
                          </div>
                        </td>
                        <td className="p-3 text-xs whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <span>{bid.email}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-emerald-600 font-semibold mt-0.5">
                            <Phone className="w-3 h-3 text-emerald-500" />
                            <span>{bid.telepon}</span>
                          </div>
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          <div className="font-black text-emerald-600 text-base">
                            {formatRupiah(bid.harga)}
                          </div>
                        </td>
                        <td className="p-3 text-xs whitespace-nowrap">
                          <a
                            href={pdfDownloadUrl}
                            download={bid.pdfName}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-bold text-xs transition shadow-sm"
                          >
                            <FileDown className="w-3.5 h-3.5 text-rose-600" />
                            <span>Download PDF</span>
                          </a>
                          <span className="block text-[10px] text-slate-400 mt-1">
                            {bid.pdfName} ({bid.pdfSize})
                          </span>
                        </td>
                        <td className="p-3 text-center whitespace-nowrap">
                          {isWinner ? (
                            <div className="inline-flex flex-col items-center gap-1">
                              <span className="inline-flex items-center gap-1.5 text-xs font-black bg-amber-500 text-slate-950 px-3 py-1 rounded-full shadow">
                                <Trophy className="w-3.5 h-3.5 text-slate-950" />
                                <span>PEMENANG RESMI</span>
                              </span>
                              <button
                                type="button"
                                onClick={onUnsetWinner}
                                className="text-[11px] text-red-600 hover:text-red-700 underline font-semibold flex items-center gap-1 cursor-pointer transition"
                                title="Batalkan status pemenang ini"
                              >
                                <Ban className="w-3 h-3" />
                                <span>Batalkan Pemenang</span>
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => onSetWinner(bid.id)}
                              className="px-3.5 py-1.5 bg-slate-900 hover:bg-emerald-600 text-white font-semibold text-xs rounded-lg shadow transition flex items-center justify-center gap-1 mx-auto cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5 text-amber-400" />
                              <span>Tandai Pemenang</span>
                            </button>
                          )}
                        </td>
                        {isSuperAdmin && (
                          <td className="p-3 text-center whitespace-nowrap">
                            <button
                              onClick={() => onDeleteBid(bid.id)}
                              className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white font-semibold text-xs rounded-lg shadow transition flex items-center justify-center gap-1 mx-auto cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Hapus</span>
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={isSuperAdmin ? 8 : 7}
                      className="p-8 text-center text-slate-400 italic"
                    >
                      Belum ada berkas penawaran yang terdaftar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
};
