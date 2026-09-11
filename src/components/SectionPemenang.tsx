import React from 'react';
import { Trophy, Award, CheckCircle, Ban, Hourglass, ListCheck } from 'lucide-react';
import { maskPhoneNumber } from '../data';
import type { BidItem } from '../types';

interface SectionPemenangProps {
  winnerBid: BidItem | undefined;
  isAdminLoggedIn: boolean;
  onUnsetWinner: () => void;
  onNavigateToBids: () => void;
}

export const SectionPemenang: React.FC<SectionPemenangProps> = ({
  winnerBid,
  isAdminLoggedIn,
  onUnsetWinner,
  onNavigateToBids,
}) => {
  return (
    <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-amber-200 mb-8">
      <div className="flex items-center justify-between border-b pb-4 mb-6">
        <div>
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
            Heading 7
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Penetapan Pemenang Tender
          </h2>
        </div>
        <div className="text-xs px-3 py-1.5 bg-amber-100 text-amber-900 font-bold rounded-lg border border-amber-300 flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-amber-700" />
          <span>Pengumuman Resmi</span>
        </div>
      </div>

      {winnerBid ? (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-6 shadow-md">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-amber-200 pb-4 mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-amber-500 text-slate-950 font-bold rounded-xl flex items-center justify-center text-2xl shadow">
                <Trophy className="w-7 h-7 text-slate-950" />
              </div>
              <div>
                <span className="text-xs bg-amber-200 text-amber-900 font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Pemenang Ditetapkan
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                  {winnerBid.perusahaan || 'Peserta Individual'}
                </h3>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
            <div className="bg-white p-3 rounded-xl border border-amber-200">
              <span className="text-xs text-slate-500 block">Penanggung Jawab</span>
              <span className="font-bold text-slate-800">{winnerBid.nama}</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-amber-200">
              <span className="text-xs text-slate-500 block">Nomor Telepon / WhatsApp</span>
              <span className="font-bold text-emerald-600 tracking-wider">
                {maskPhoneNumber(winnerBid.telepon)}
              </span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-amber-200 text-xs text-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              Pemenang telah lolos evaluasi administrasi, teknis, serta kualifikasi harga terendah.
            </span>
            {isAdminLoggedIn && (
              <button
                onClick={onUnsetWinner}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg text-xs shadow transition flex items-center gap-1 cursor-pointer shrink-0"
              >
                <Ban className="w-3.5 h-3.5" />
                Batalkan Penetapan
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-slate-200 text-slate-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <Hourglass className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-extrabold text-slate-800 mb-1">
            Belum Ada Pemenang Ditetapkan
          </h3>
          <p className="text-slate-600 text-sm max-w-xl mx-auto mb-4">
            Proses evaluasi dokumen penawaran masih berlangsung oleh Panitia Pengadaan. Penetapan pemenang akan diumumkan secara resmi di halaman ini setelah seluruh tahapan evaluasi selesai.
          </p>
          {isAdminLoggedIn && (
            <button
              onClick={onNavigateToBids}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl shadow transition text-xs flex items-center gap-2 mx-auto cursor-pointer"
            >
              <ListCheck className="w-4 h-4" />
              Ke Halaman Evaluasi Admin untuk Menandai Pemenang
            </button>
          )}
        </div>
      )}
    </section>
  );
};
