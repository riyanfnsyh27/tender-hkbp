import React from 'react';
import { Edit, Building2, Briefcase, DollarSign, FileText } from 'lucide-react';
import { formatRupiah } from '../data';
import type { InformasiData } from '../types';

interface SectionInformasiProps {
  informasi: InformasiData;
  isAdminLoggedIn: boolean;
  onOpenEditModal: () => void;
}

export const SectionInformasi: React.FC<SectionInformasiProps> = ({
  informasi,
  isAdminLoggedIn,
  onOpenEditModal,
}) => {
  return (
    <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 mb-8">
      <div className="flex items-center justify-between border-b pb-4 mb-6">
        <div>
          <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
            Heading 1
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Informasi Tender
          </h2>
        </div>
        {isAdminLoggedIn && (
          <button
            onClick={onOpenEditModal}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold rounded-lg text-xs shadow transition flex items-center gap-2 cursor-pointer"
          >
            <Edit className="w-3.5 h-3.5" />
            Edit Informasi
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-sm">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500 font-bold uppercase block mb-1 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-slate-400" />
            Nama Paket Pekerjaan
          </span>
          <span className="font-bold text-slate-900 text-base">
            {informasi.nama}
          </span>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500 font-bold uppercase block mb-1 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            Instansi
          </span>
          <span className="font-bold text-slate-800 text-base">
            {informasi.instansi}
          </span>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 md:col-span-2">
          <span className="text-xs text-slate-500 font-bold uppercase block mb-1 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
            Nilai HPS (Harga Perkiraan Sendiri)
          </span>
          <span className="font-black text-emerald-600 text-xl">
            {formatRupiah(informasi.hps)}
          </span>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
          <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            Deskripsi Pekerjaan:
          </h3>
          <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
            {informasi.deskripsi}
          </div>
        </div>

        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
          <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">
            Informasi Lainnya:
          </h3>
          <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
            {informasi.lainnya || '-'}
          </div>
        </div>
      </div>
    </section>
  );
};
