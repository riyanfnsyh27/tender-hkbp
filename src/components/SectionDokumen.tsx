import React from 'react';
import { Edit, FileDown, ExternalLink } from 'lucide-react';
import type { DokumenItem } from '../types';

interface SectionDokumenProps {
  dokumen: DokumenItem[];
  isAdminLoggedIn: boolean;
  onOpenEditModal: () => void;
}

export const SectionDokumen: React.FC<SectionDokumenProps> = ({
  dokumen,
  isAdminLoggedIn,
  onOpenEditModal,
}) => {
  return (
    <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 mb-8">
      <div className="flex items-center justify-between border-b pb-4 mb-6">
        <div>
          <span className="text-xs font-bold text-cyan-600 uppercase tracking-wider">
            Heading 4
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Dokumen Pendukung
          </h2>
        </div>
        {isAdminLoggedIn && (
          <button
            onClick={onOpenEditModal}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold rounded-lg text-xs shadow transition flex items-center gap-2 cursor-pointer"
          >
            <Edit className="w-3.5 h-3.5" />
            Edit / Upload Dokumen
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-xs">
              <th className="p-3 border-b w-12 text-center">No</th>
              <th className="p-3 border-b">Nama Dokumen</th>
              <th className="p-3 border-b">File (Download / Unduh)</th>
              <th className="p-3 border-b">Keterangan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-700">
            {dokumen.length > 0 ? (
              dokumen.map((doc, idx) => {
                const hasValidUrl = doc.fileUrl && doc.fileUrl !== '#';
                const previewLink =
                  doc.previewUrl ||
                  (doc.fileUrl && doc.fileUrl.includes('id=')
                    ? `https://drive.google.com/file/d/${doc.fileUrl.split('id=')[1].split('&')[0]}/view?usp=sharing`
                    : doc.fileUrl);

                return (
                  <tr key={doc.id || idx} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-semibold text-slate-500 text-center">
                      {idx + 1}
                    </td>
                    <td className="p-3 font-bold text-slate-900">
                      {doc.nama}
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap items-center gap-2">
                        {hasValidUrl ? (
                          <>
                            <a
                              href={doc.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              download={doc.fileName || 'dokumen.pdf'}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 font-semibold text-xs transition shadow-2xs"
                              title={`Download ${doc.fileName}`}
                            >
                              <FileDown className="w-3.5 h-3.5 text-sky-600" />
                              <span>{doc.fileName || 'Download PDF'}</span>
                            </a>

                            {previewLink && (
                              <a
                                href={previewLink}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800 text-[11px] font-medium transition"
                                title="Lihat pratinjau di Google Drive"
                              >
                                <ExternalLink className="w-3 h-3 text-slate-500" />
                                <span>Drive</span>
                              </a>
                            )}
                          </>
                        ) : (
                          <button
                            onClick={() =>
                              alert(`Unduh berkas: ${doc.fileName || doc.nama}`)
                            }
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 font-semibold text-xs transition cursor-pointer"
                          >
                            <FileDown className="w-3.5 h-3.5 text-sky-600" />
                            <span>{doc.fileName || 'Download PDF'}</span>
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-slate-600 text-xs">
                      {doc.keterangan || '-'}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="p-6 text-center text-slate-400 italic">
                  Belum ada dokumen pendukung.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};
