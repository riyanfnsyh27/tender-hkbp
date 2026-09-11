import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800 text-xs text-center mt-auto">
      <div className="max-w-7xl mx-auto px-4 space-y-2">
        <p className="font-medium text-slate-300">
          Sistem Informasi Tender &amp; e-Procurement &copy; 2026. Hak Cipta Dilindungi Undang-Undang.
        </p>
        <p className="text-slate-500">
          Gereja HKBP Jatiwaringin &bull; Layanan Pengadaan Barang &amp; Jasa Terintegrasi Firebase Realtime
        </p>
      </div>
    </footer>
  );
};
