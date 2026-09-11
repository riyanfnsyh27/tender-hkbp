import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  Lock,
  FileUp,
  FileCheck,
  RotateCw,
  Send,
  Bot
} from 'lucide-react';
import { formatRupiah, createSamplePdfDataUrl } from '../data';
import type { BidItem } from '../types';

interface SectionUploadProps {
  deadlineIso: string;
  onAddBid: (newBid: BidItem) => void;
}

export const SectionUpload: React.FC<SectionUploadProps> = ({
  deadlineIso,
  onAddBid,
}) => {
  const [nama, setNama] = useState('');
  const [perusahaan, setPerusahaan] = useState('');
  const [email, setEmail] = useState('');
  const [telepon, setTelepon] = useState('');
  const [harga, setHarga] = useState<number | ''>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [fileDataUrl, setFileDataUrl] = useState<string | null>(null);

  // Captcha State
  const [captchaQ, setCaptchaQ] = useState({ n1: 5, n2: 3, ans: 8 });
  const [captchaInput, setCaptchaInput] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const deadlineDate = new Date(deadlineIso);
  const isClosed = new Date().getTime() >= deadlineDate.getTime();
  const deadlineStr =
    deadlineDate.toLocaleString('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }) + ' WIB';

  const generateCaptcha = () => {
    const n1 = Math.floor(Math.random() * 10) + 1;
    const n2 = Math.floor(Math.random() * 10) + 1;
    setCaptchaQ({ n1, n2, ans: n1 + n2 });
    setCaptchaInput('');
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleFileChange = (file: File | undefined) => {
    setFileError(null);
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setFileError('Format file tidak valid! Berkas harus berformat PDF (.pdf).');
      setSelectedFile(null);
      setFileDataUrl(null);
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setFileError('Ukuran file terlalu besar! Maksimal ukuran file PDF adalah 20 MB.');
      setSelectedFile(null);
      setFileDataUrl(null);
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setFileDataUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isClosed) {
      alert(
        `Gagal Mengirim Penawaran!\n\nMasa penawaran telah resmi ditutup pada ${deadlineStr}. Sistem tidak lagi menerima berkas pendaftaran baru.`
      );
      return;
    }

    if (Number(captchaInput) !== captchaQ.ans) {
      alert('Jawaban Verifikasi Captcha Salah! Silakan hitung ulang.');
      generateCaptcha();
      return;
    }

    if (!selectedFile) {
      alert('Harap unggah berkas penawaran PDF Anda!');
      return;
    }

    if (!harga || harga <= 0) {
      alert('Harap masukkan nilai harga penawaran yang valid!');
      return;
    }

    const nowIso = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const newBidId = 'BID-' + Math.floor(100 + Math.random() * 900);

    const newBid: BidItem = {
      id: newBidId,
      timestamp: nowIso,
      nama: nama.trim(),
      perusahaan: perusahaan.trim(),
      email: email.trim(),
      telepon: telepon.trim(),
      harga: Number(harga),
      pdfName: selectedFile.name,
      pdfSize: (selectedFile.size / (1024 * 1024)).toFixed(1) + ' MB',
      pdfDataUrl: fileDataUrl || createSamplePdfDataUrl(selectedFile.name),
    };

    onAddBid(newBid);

    // Reset Form
    setNama('');
    setPerusahaan('');
    setEmail('');
    setTelepon('');
    setHarga('');
    setSelectedFile(null);
    setFileDataUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    generateCaptcha();
  };

  return (
    <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border-2 border-emerald-500/30 mb-8 transition-all">
      <div className="border-b pb-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full uppercase">
            Formulir Peserta Tender
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
            Upload Penawaran
          </h2>
        </div>
        <div className="text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Verifikasi Keamanan Captcha Ditampilkan</span>
        </div>
      </div>

      {/* ALERT BANNER IF DEADLINE PASSED */}
      {isClosed && (
        <div className="mb-6 bg-red-50 border-2 border-red-300 rounded-2xl p-5 text-red-900">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-red-600 text-white rounded-xl flex items-center justify-center text-xl shrink-0 mt-0.5 shadow">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-red-900">
                Masa Pemasukan Penawaran Telah Ditutup
              </h3>
              <p className="text-xs text-red-700 mt-1 leading-relaxed">
                Batas waktu pengiriman berkas dokumen penawaran telah berakhir pada{' '}
                <strong className="underline">{deadlineStr}</strong>. Sistem e-Procurement telah mengunci formulir ini secara otomatis dan tidak lagi menerima unggahan berkas baru.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Form Penawaran */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* 1. Nama Lengkap */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Nama Lengkap Penanggung Jawab <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              disabled={isClosed}
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Contoh: Ahmad Subagja, S.Kom"
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
            />
          </div>

          {/* 2. Nama Perusahaan (Opsional) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Nama Perusahaan <span className="text-slate-400 font-normal">(Opsional)</span>
            </label>
            <input
              type="text"
              disabled={isClosed}
              value={perusahaan}
              onChange={(e) => setPerusahaan(e.target.value)}
              placeholder="Contoh: PT Karya Bangun Mandiri"
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
            />
          </div>

          {/* 3. Email (Wajib) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Alamat Email Aktif <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              disabled={isClosed}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@perusahaan.co.id"
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
            />
          </div>

          {/* 4. Nomor Telepon / WA (Wajib) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Nomor Telepon / WhatsApp <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              required
              disabled={isClosed}
              value={telepon}
              onChange={(e) => setTelepon(e.target.value)}
              placeholder="081234567890"
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              Notifikasi konfirmasi tanda terima akan dikirimkan ke nomor WhatsApp ini.
            </span>
          </div>

          {/* 5. Nilai Harga Penawaran */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Nilai Harga Penawaran (Rp) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-500">
                Rp
              </span>
              <input
                type="number"
                required
                min="1"
                step="1"
                disabled={isClosed}
                value={harga}
                onChange={(e) =>
                  setHarga(e.target.value ? Number(e.target.value) : '')
                }
                placeholder="0"
                className="w-full pl-12 pr-4 py-2.5 text-sm font-semibold rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
              />
            </div>
            <div className="text-xs font-bold text-emerald-600 mt-1.5">
              Terbilang Format: {harga ? formatRupiah(Number(harga)) : 'Rp 0'}
            </div>
          </div>

          {/* 6. File Upload PDF */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Dokumen Penawaran Lengkap (PDF Maks 20 MB){' '}
              <span className="text-red-500">*</span>
            </label>
            <div
              onClick={() => {
                if (!isClosed && fileInputRef.current) {
                  fileInputRef.current.click();
                }
              }}
              onDragOver={(e) => {
                e.preventDefault();
              }}
              onDrop={(e) => {
                e.preventDefault();
                if (!isClosed && e.dataTransfer.files[0]) {
                  handleFileChange(e.dataTransfer.files[0]);
                }
              }}
              className={`border-2 border-dashed rounded-xl p-6 text-center transition ${
                isClosed
                  ? 'border-slate-300 bg-slate-100 opacity-60 cursor-not-allowed'
                  : 'border-slate-300 hover:border-emerald-500 bg-slate-50 cursor-pointer'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                accept="application/pdf"
                disabled={isClosed}
                onChange={(e) => handleFileChange(e.target.files?.[0])}
                className="hidden"
              />
              {selectedFile ? (
                <div className="flex flex-col items-center justify-center">
                  <FileCheck className="w-10 h-10 text-emerald-500 mb-2" />
                  <p className="text-sm font-bold text-emerald-700">
                    Berkas Terpilih: {selectedFile.name} (
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Klik untuk memilih berkas pengganti
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <FileUp className="w-10 h-10 text-rose-500 mb-2" />
                  <p className="text-sm font-semibold text-slate-700">
                    {isClosed
                      ? 'Masa Penawaran Ditutup - Unggah File Tidak Tersedia'
                      : 'Klik untuk unggah atau seret berkas PDF ke sini'}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Format khusus .PDF (Ukuran file maksimal 20 MB)
                  </p>
                </div>
              )}
            </div>
            {fileError && (
              <div className="text-xs text-red-600 font-semibold mt-1">
                {fileError}
              </div>
            )}
          </div>

          {/* 7. CAPTCHA VALIDATION */}
          <div className="md:col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-slate-800 text-amber-400 flex items-center justify-center font-bold">
                <Bot className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-700 uppercase block">
                  Verifikasi Keamanan (Captcha)
                </span>
                <span className="text-sm font-extrabold text-slate-900">
                  Hitung: {captchaQ.n1} + {captchaQ.n2} = ?
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <input
                type="number"
                required
                disabled={isClosed}
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                placeholder="Jawaban"
                className="w-28 px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none text-center font-bold disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                disabled={isClosed}
                onClick={generateCaptcha}
                className="p-2 text-slate-500 hover:text-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                title="Acak Ulang Captcha"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 flex items-center justify-end">
          <button
            type="submit"
            disabled={isClosed}
            className={`w-full sm:w-auto px-8 py-3 font-bold rounded-xl shadow transition flex items-center justify-center gap-2 text-sm ${
              isClosed
                ? 'bg-slate-400 text-white cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white hover:shadow-emerald-500/20 cursor-pointer'
            }`}
          >
            {isClosed ? (
              <>
                <Lock className="w-4 h-4" />
                <span>Masa Penawaran Telah Ditutup</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Kirim Berkas Penawaran Sekarang</span>
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
};
