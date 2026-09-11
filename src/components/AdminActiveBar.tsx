import React from 'react';
import { Shield, ListCheck, LogOut } from 'lucide-react';

interface AdminActiveBarProps {
  isSuperAdmin: boolean;
  onNavigateToBids: () => void;
  onLogoutAdmin: () => void;
}

export const AdminActiveBar: React.FC<AdminActiveBarProps> = ({
  isSuperAdmin,
  onNavigateToBids,
  onLogoutAdmin,
}) => {
  return (
    <div
      className={`px-4 py-2 font-semibold text-xs sm:text-sm flex flex-wrap items-center justify-between border-b shadow-inner transition-colors ${
        isSuperAdmin
          ? 'bg-purple-600 text-white border-purple-700'
          : 'bg-amber-500 text-slate-900 border-amber-600'
      }`}
    >
      <div className="flex items-center space-x-2">
        <Shield className="w-4 h-4 shrink-0" />
        <span>
          {isSuperAdmin ? (
            <>
              Anda masuk sebagai <strong>SUPER ADMINISTRATOR</strong>. Anda dapat mengedit semua heading, melihat &amp; menghapus seluruh data penawaran kapan saja, serta mengelola penetapan pemenang tender.
            </>
          ) : (
            <>
              Anda masuk sebagai <strong>ADMINISTRATOR</strong>. Anda dapat mengedit semua heading &amp; mengelola penetapan pemenang tender.
            </>
          )}
        </span>
      </div>
      <div className="mt-2 sm:mt-0 flex items-center space-x-3">
        <button
          onClick={onNavigateToBids}
          className="bg-slate-900 hover:bg-slate-800 text-white text-xs px-3 py-1.5 rounded-lg shadow transition flex items-center gap-1.5"
        >
          <ListCheck className="w-3.5 h-3.5 text-amber-400" />
          Lihat Evaluasi Penawaran Masuk
        </button>
        <button
          onClick={onLogoutAdmin}
          className="underline font-bold hover:opacity-80 text-xs flex items-center gap-1 cursor-pointer"
        >
          <LogOut className="w-3 h-3" />
          Logout
        </button>
      </div>
    </div>
  );
};
