import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  Clock,
  Upload,
  FileCheck,
  FileText,
  Calendar,
  FolderOpen
} from 'lucide-react';
import type { ContentData, JadwalItem, DokumenItem } from '../types';

interface EditContentModalProps {
  isOpen: boolean;
  headingKey: string;
  content: ContentData;
  onClose: () => void;
  onSave: (updatedContent: ContentData) => void;
}

export const EditContentModal: React.FC<EditContentModalProps> = ({
  isOpen,
  headingKey,
  content,
  onClose,
  onSave,
}) => {
  // Local edit states
  const [nama, setNama] = useState('');
  const [instansi, setInstansi] = useState('');
  const [hps, setHps] = useState(0);
  const [deskripsi, setDeskripsi] = useState('');
  const [lainnya, setLainnya] = useState('');

  const [persyaratan, setPersyaratan] = useState('');
  const [evaluasi, setEvaluasi] = useState('');
  const [kontak, setKontak] = useState('');

  const [deadlineIso, setDeadlineIso] = useState('');
  const [jadwalItems, setJadwalItems] = useState<JadwalItem[]>([]);

  const [dokumenItems, setDokumenItems] = useState<DokumenItem[]>([]);

  useEffect(() => {
    if (content) {
      setNama(content.informasi.nama || '');
      setInstansi(content.informasi.instansi || '');
      setHps(content.informasi.hps || 0);
      setDeskripsi(content.informasi.deskripsi || '');
      setLainnya(content.informasi.lainnya || '');

      setPersyaratan(content.persyaratan || '');
      setEvaluasi(content.evaluasi || '');
      setKontak(content.kontak || '');

      setDeadlineIso(content.jadwal.deadlineIso || '');
      setJadwalItems(content.jadwal.items ? [...content.jadwal.items] : []);

      setDokumenItems(content.dokumen ? [...content.dokumen] : []);
    }
  }, [content, headingKey]);

  if (!isOpen) return null;

  const handleAddJadwalRow = () => {
    const nextNo = jadwalItems.length + 1;
    setJadwalItems([
      ...jadwalItems,
      {
        no: nextNo,
        nama: 'Tahapan Baru',
        mulai: '01 Okt 2026',
        selesai: '05 Okt 2026',
        keterangan: 'Keterangan tahapan baru',
      },
    ]);
  };

  const handleRemoveJadwalRow = (index: number) => {
    const updated = jadwalItems.filter((_, i) => i !== index);
    const renumbered = updated.map((item, i) => ({ ...item, no: i + 1 }));
    setJadwalItems(renumbered);
  };

  const handleAddDokumenRow = () => {
    const nextId = dokumenItems.length + 1;
    setDokumenItems([
      ...dokumenItems,
      {
        id: nextId,
        nama: 'Dokumen Lampiran Baru',
        fileName: 'Dokumen_Baru.pdf',
        fileUrl: '#',
        keterangan: 'Keterangan dokumen lampiran',
      },
    ]);
  };

  const handleRemoveDokumenRow = (index: number) => {
    setDokumenItems(dokumenItems.filter((_, i) => i !== index));
  };

  const handleDocFileChange = (index: number, file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      const updated = [...dokumenItems];
      updated[index] = {
        ...updated[index],
        fileName: file.name,
        fileUrl: url,
      };
      setDokumenItems(updated);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    const updatedContent: ContentData = {
      ...content,
    };

    if (headingKey === 'informasi') {
      updatedContent.informasi = {
        nama,
        instansi,
        hps: Number(hps),
        deskripsi,
        lainnya,
      };
    } else if (headingKey === 'jadwal') {
      updatedContent.jadwal = {
        deadlineIso: deadlineIso || content.jadwal.deadlineIso,
        items: jadwalItems,
      };
    } else if (headingKey === 'dokumen') {
      updatedContent.dokumen = dokumenItems;
    } else if (headingKey === 'persyaratan') {
      updatedContent.persyaratan = persyaratan;
    } else if (headingKey === 'evaluasi') {
      updatedContent.evaluasi = evaluasi;
    } else if (headingKey === 'kontak') {
      updatedContent.kontak = kontak;
    }

    onSave(updatedContent);
    onClose();
  };

  let modalTitle = 'Edit Konten Heading';
  if (headingKey === 'informasi') modalTitle = 'Edit Heading 1: Informasi Tender';
  else if (headingKey === 'persyaratan') modalTitle = 'Edit Heading 2: Persyaratan Peserta';
  else if (headingKey === 'jadwal') modalTitle = 'Edit Heading 3: Jadwal Tender & Tahapan';
  else if (headingKey === 'dokumen') modalTitle = 'Edit Heading 4: Dokumen Pendukung & Lampiran';
  else if (headingKey === 'evaluasi') modalTitle = 'Edit Heading 5: Metode Evaluasi';
  else if (headingKey === 'kontak') modalTitle = 'Edit Heading 6: Kontak Panitia';

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 relative max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b pb-3 mb-4">
          <h3 className="text-lg font-bold text-slate-900">{modalTitle}</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto space-y-4 flex-grow pr-1">
          {headingKey === 'informasi' && (
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold uppercase mb-1">
                  Nama Paket Pekerjaan
                </label>
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block font-bold uppercase mb-1">Instansi</label>
                <input
                  type="text"
                  value={instansi}
                  onChange={(e) => setInstansi(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block font-bold uppercase mb-1">
                  Nilai HPS (Rp)
                </label>
                <input
                  type="number"
                  value={hps}
                  onChange={(e) => setHps(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block font-bold uppercase mb-1">
                  Deskripsi Pekerjaan
                </label>
                <textarea
                  rows={3}
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block font-bold uppercase mb-1">
                  Informasi Lainnya
                </label>
                <textarea
                  rows={4}
                  value={lainnya}
                  onChange={(e) => setLainnya(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-sm"
                />
              </div>
            </div>
          )}

          {headingKey === 'jadwal' && (
            <div className="space-y-4">
              <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-300 text-xs text-amber-900">
                <label className="block font-bold mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-600" />
                  Set Tanggal Batas Pemasukan Berkas (Tenggat Hitung Mundur &amp; Form Penawaran):
                </label>
                <input
                  type="datetime-local"
                  value={deadlineIso}
                  onChange={(e) => setDeadlineIso(e.target.value)}
                  className="w-full p-2.5 border border-amber-300 rounded-lg bg-white font-bold text-emerald-700 text-sm"
                />
                <span className="text-[11px] text-amber-800 mt-1 block">
                  Tips: Ubah ke tanggal/waktu yang sudah lewat untuk menguji sistem saat masa penawaran telah resmi DITUTUP.
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-slate-700">
                  Daftar Tahapan Kegiatan:
                </span>
                <button
                  onClick={handleAddJadwalRow}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Tambah Tahapan
                </button>
              </div>

              <div className="space-y-3">
                {jadwalItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between font-bold text-slate-700">
                      <span>Tahapan #{idx + 1}</span>
                      <button
                        onClick={() => handleRemoveJadwalRow(idx)}
                        className="text-red-500 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Hapus
                      </button>
                    </div>
                    <input
                      type="text"
                      value={item.nama}
                      onChange={(e) => {
                        const updated = [...jadwalItems];
                        updated[idx].nama = e.target.value;
                        setJadwalItems(updated);
                      }}
                      placeholder="Nama Tahapan"
                      className="w-full p-2 border border-slate-300 rounded bg-white text-xs"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={item.mulai}
                        onChange={(e) => {
                          const updated = [...jadwalItems];
                          updated[idx].mulai = e.target.value;
                          setJadwalItems(updated);
                        }}
                        placeholder="Mulai"
                        className="p-2 border border-slate-300 rounded bg-white text-xs"
                      />
                      <input
                        type="text"
                        value={item.selesai}
                        onChange={(e) => {
                          const updated = [...jadwalItems];
                          updated[idx].selesai = e.target.value;
                          setJadwalItems(updated);
                        }}
                        placeholder="Sampai Dengan"
                        className="p-2 border border-slate-300 rounded bg-white text-xs"
                      />
                    </div>
                    <input
                      type="text"
                      value={item.keterangan || ''}
                      onChange={(e) => {
                        const updated = [...jadwalItems];
                        updated[idx].keterangan = e.target.value;
                        setJadwalItems(updated);
                      }}
                      placeholder="Keterangan tambahan..."
                      className="w-full p-2 border border-slate-300 rounded bg-white text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {headingKey === 'dokumen' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-slate-700">
                  Daftar Dokumen Lampiran:
                </span>
                <button
                  onClick={handleAddDokumenRow}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Tambah Dokumen
                </button>
              </div>

              <div className="space-y-3">
                {dokumenItems.map((doc, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between font-bold text-slate-700">
                      <span>Dokumen #{idx + 1}</span>
                      <button
                        onClick={() => handleRemoveDokumenRow(idx)}
                        className="text-red-500 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Hapus
                      </button>
                    </div>
                    <div>
                      <label className="block font-semibold mb-0.5">
                        Nama Dokumen:
                      </label>
                      <input
                        type="text"
                        value={doc.nama}
                        onChange={(e) => {
                          const updated = [...dokumenItems];
                          updated[idx].nama = e.target.value;
                          setDokumenItems(updated);
                        }}
                        className="w-full p-2 border border-slate-300 rounded bg-white text-xs"
                        placeholder="Contoh: KAK Spesifikasi Teknis"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-0.5">
                        Upload File Berkas Dokumen:
                      </label>
                      <label className="cursor-pointer flex items-center justify-between p-2.5 border border-dashed border-slate-300 hover:border-sky-500 rounded-lg bg-white transition">
                        <span className="text-slate-600 truncate font-medium flex items-center gap-1.5">
                          {doc.fileName ? (
                            <>
                              <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                              <strong>{doc.fileName}</strong>
                            </>
                          ) : (
                            'Klik untuk pilih berkas dari komputer...'
                          )}
                        </span>
                        <span className="bg-sky-50 text-sky-700 border border-sky-200 px-2.5 py-1 rounded text-[11px] font-bold shrink-0 ml-2 flex items-center gap-1">
                          <Upload className="w-3 h-3" /> Unggah File
                        </span>
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) =>
                            handleDocFileChange(idx, e.target.files?.[0])
                          }
                        />
                      </label>
                    </div>
                    <div>
                      <label className="block font-semibold mb-0.5">
                        Keterangan Dokumen:
                      </label>
                      <input
                        type="text"
                        value={doc.keterangan || ''}
                        onChange={(e) => {
                          const updated = [...dokumenItems];
                          updated[idx].keterangan = e.target.value;
                          setDokumenItems(updated);
                        }}
                        className="w-full p-2 border border-slate-300 rounded bg-white text-xs"
                        placeholder="Keterangan singkat..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {headingKey === 'persyaratan' && (
            <div>
              <label className="block text-xs font-bold uppercase mb-1">
                Isi Persyaratan Peserta Tender
              </label>
              <textarea
                rows={8}
                value={persyaratan}
                onChange={(e) => setPersyaratan(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-lg text-sm leading-relaxed"
              />
            </div>
          )}

          {headingKey === 'evaluasi' && (
            <div>
              <label className="block text-xs font-bold uppercase mb-1">
                Isi Metode Evaluasi dan Penawaran
              </label>
              <textarea
                rows={8}
                value={evaluasi}
                onChange={(e) => setEvaluasi(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-lg text-sm leading-relaxed"
              />
            </div>
          )}

          {headingKey === 'kontak' && (
            <div>
              <label className="block text-xs font-bold uppercase mb-1">
                Isi Kontak Panitia Tender
              </label>
              <textarea
                rows={8}
                value={kontak}
                onChange={(e) => setKontak(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-lg text-sm leading-relaxed"
              />
            </div>
          )}
        </div>

        <div className="pt-4 border-t mt-4 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg text-xs cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs shadow cursor-pointer"
          >
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
};
