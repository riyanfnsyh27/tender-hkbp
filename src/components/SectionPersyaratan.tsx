import React from 'react';
import { Edit, CheckSquare } from 'lucide-react';

interface SectionPersyaratanProps {
  persyaratan: string;
  isAdminLoggedIn: boolean;
  onOpenEditModal: () => void;
}

export const SectionPersyaratan: React.FC<SectionPersyaratanProps> = ({
  persyaratan,
  isAdminLoggedIn,
  onOpenEditModal,
}) => {
  return (
    <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 mb-8">
      <div className="flex items-center justify-between border-b pb-4 mb-6">
        <div>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
            Heading 2
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Persyaratan Peserta
          </h2>
        </div>
        {isAdminLoggedIn && (
          <button
            onClick={onOpenEditModal}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold rounded-lg text-xs shadow transition flex items-center gap-2 cursor-pointer"
          >
            <Edit className="w-3.5 h-3.5" />
            Edit Persyaratan
          </button>
        )}
      </div>

      <div className="space-y-4">
        <p className="text-slate-600 text-sm">
          Peserta tender wajib memenuhi kualifikasi legalitas dan teknis berikut:
        </p>
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-slate-700 text-sm leading-relaxed whitespace-pre-line font-medium">
          {persyaratan}
        </div>
      </div>
    </section>
  );
};
