import React from 'react';
import { Edit, Calendar } from 'lucide-react';
import type { JadwalData } from '../types';

interface SectionJadwalProps {
  jadwal: JadwalData;
  isAdminLoggedIn: boolean;
  onOpenEditModal: () => void;
}

export const SectionJadwal: React.FC<SectionJadwalProps> = ({
  jadwal,
  isAdminLoggedIn,
  onOpenEditModal,
}) => {
  return (
    <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 mb-8">
      <div className="flex items-center justify-between border-b pb-4 mb-6">
        <div>
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
            Heading 3
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Jadwal Tender
          </h2>
        </div>
        {isAdminLoggedIn && (
          <button
            onClick={onOpenEditModal}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold rounded-lg text-xs shadow transition flex items-center gap-2 cursor-pointer"
          >
            <Edit className="w-3.5 h-3.5" />
            Edit Jadwal &amp; Tahapan
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-xs">
              <th className="p-3 border-b w-12 text-center">No</th>
              <th className="p-3 border-b">Tahapan Kegiatan</th>
              <th className="p-3 border-b">Mulai</th>
              <th className="p-3 border-b">Sampai Dengan</th>
              <th className="p-3 border-b">Keterangan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-700">
            {jadwal.items.map((item) => (
              <tr key={item.no} className="hover:bg-slate-50 transition-colors">
                <td className="p-3 font-semibold text-slate-500 text-center">
                  {item.no}
                </td>
                <td className="p-3 font-semibold text-slate-900">
                  {item.nama}
                </td>
                <td className="p-3 text-slate-600 whitespace-nowrap">
                  {item.mulai}
                </td>
                <td className="p-3 text-slate-800 font-semibold whitespace-nowrap">
                  {item.selesai}
                </td>
                <td className="p-3 text-slate-500 text-xs">
                  {item.keterangan || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
