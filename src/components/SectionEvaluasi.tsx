import React from 'react';
import { Edit, Scale } from 'lucide-react';

interface SectionEvaluasiProps {
  evaluasi: string;
  isAdminLoggedIn: boolean;
  onOpenEditModal: () => void;
}

export const SectionEvaluasi: React.FC<SectionEvaluasiProps> = ({
  evaluasi,
  isAdminLoggedIn,
  onOpenEditModal,
}) => {
  return (
    <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 mb-8">
      <div className="flex items-center justify-between border-b pb-4 mb-6">
        <div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
            Heading 5
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Metode Evaluasi dan Penawaran
          </h2>
        </div>
        {isAdminLoggedIn && (
          <button
            onClick={onOpenEditModal}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold rounded-lg text-xs shadow transition flex items-center gap-2 cursor-pointer"
          >
            <Edit className="w-3.5 h-3.5" />
            Edit Metode Evaluasi
          </button>
        )}
      </div>

      <div className="text-sm text-slate-700 whitespace-pre-line bg-slate-50 p-6 rounded-xl border border-slate-200 leading-relaxed font-medium">
        {evaluasi}
      </div>
    </section>
  );
};
