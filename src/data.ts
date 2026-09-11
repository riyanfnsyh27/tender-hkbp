import type { AppState } from "./types";

export function createSamplePdfDataUrl(filename: string): string {
  const dummyText = `DOKUMEN RESMI PENAWARAN TENDER\nFile: ${filename}\nStatus: Terverifikasi Digital SPSE\n\nIsi Dokumen Penawaran Terlampir Lengkap.`;
  try {
    return 'data:application/pdf;base64,' + btoa(unescape(encodeURIComponent(dummyText)));
  } catch {
    return '#';
  }
}

export const GAMBAR_KERJA_ID = "1fFlbB-fa-eWLMaGy5v2z47wFx_Ighyvo";
export const PERKIRAAN_KUANTITAS_ID = "1yWB45V8sX6-ko4-O1aFeTH5W6Wi7O2LI";

export const GAMBAR_KERJA_DOWNLOAD_URL = `https://drive.google.com/uc?export=download&id=${GAMBAR_KERJA_ID}`;
export const PERKIRAAN_KUANTITAS_DOWNLOAD_URL = `https://drive.google.com/uc?export=download&id=${PERKIRAAN_KUANTITAS_ID}`;

export function normalizeDokumenList(dokumenList: any[]): any[] {
  if (!Array.isArray(dokumenList)) return DEFAULT_STATE.content.dokumen;
  return dokumenList.map((doc, idx) => {
    const nameLower = (doc.nama || "").toLowerCase();
    const fileLower = (doc.fileName || "").toLowerCase();

    // Gambar Kerja
    if (nameLower.includes("gambar kerja") || fileLower.includes("gambar_kerja") || doc.id === 1 || idx === 0) {
      return {
        ...doc,
        id: 1,
        nama: "Gambar Kerja",
        fileName: "Gambar_Kerja.pdf",
        fileUrl: GAMBAR_KERJA_DOWNLOAD_URL,
        previewUrl: `https://drive.google.com/file/d/${GAMBAR_KERJA_ID}/view?usp=sharing`,
        keterangan: doc.keterangan || "Wajib dipelajari sebelum menyusun penawaran teknis",
      };
    }

    // Perkiraan Kuantitas
    if (nameLower.includes("perkiraan kuantitas") || fileLower.includes("perkiraan_kuantitas") || doc.id === 2 || idx === 1) {
      return {
        ...doc,
        id: 2,
        nama: "Perkiraan Kuantitas",
        fileName: "Perkiraan_Kuantitas.pdf",
        fileUrl: PERKIRAAN_KUANTITAS_DOWNLOAD_URL,
        previewUrl: `https://drive.google.com/file/d/${PERKIRAAN_KUANTITAS_ID}/view?usp=sharing`,
        keterangan: doc.keterangan || "Perkiraan kuantitas, Penyedia harus tetap menghitung sendiri kuantitas sesuai gambar",
      };
    }

    return doc;
  });
}

export const DEFAULT_STATE: AppState = {
  winnerBidId: null,
  content: {
    informasi: {
      nama: "Renovasi Rumah Hunian Pendeta Gereja HKBP Jatiwaringin",
      instansi: "Gereja HKBP Jatiwaringin",
      hps: 663527020,
      deskripsi: "Pekerjaan pembangunan rumah tinggal Pendeta Gereja HKBP Jatiwaringin, berlokasi di Jatiwaringin, Jakarta Timur. Proyek ini bertujuan menyediakan hunian layak dan representatif bagi pendeta sebagai bagian dari fasilitas pelayanan jemaat.",
      lainnya: "• Sumber Dana: Kas Gereja HKBP Jatiwaringin.\n• Lokasi Pekerjaan: Kota Administrasi Jakarta Timur.\n• Kategori Pengadaan: Pekerjaan Konstruksi.\n• Masa Pelaksanaan: 300 (tiga ratus) hari kalender."
    },
    persyaratan: "1. Memiliki Kartu Tanda Penduduk (KTP)\n2. Memiliki Nomor Induk Berusaha (NIB) dengan KBLI yang sesuai (Bagi Perusahaan)\n3. Memiliki Alamat Kantor (Bagi Perusahaan)\n4. Memiliki Pengalaman Sejenis dalam 1 (satu) tahun terakhir di Bidang Renovasi Bangunan Gedung",
    jadwal: {
      deadlineIso: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      items: [
        { no: 1, nama: "Pengumuman Pasqualifikasi & Unduhan Dokumen", mulai: "10 Sep 2026", selesai: "17 Sep 2026", keterangan: "Terbuka untuk semua penyedia kualifikasi sesuai" },
        { no: 2, nama: "Pemberian Penjelasan (Aanwijzing)", mulai: "10 Sep 2026", selesai: "10 Sep 2026", keterangan: "Dilakukan secara daring melalui Zoom pada tanggal 10 September 2026 pukul 14.00 WIB" },
        { no: 3, nama: "Masa Pemasukan Dokumen Penawaran", mulai: "10 Sep 2026", selesai: "17 Sep 2026 16:00 WIB", keterangan: "Batas penutupan unggah dokumen penawaran" },
        { no: 4, nama: "Pembukaan Penawaran, Evaluasi dan Negosiasi", mulai: "17 Sep 2026", selesai: "Selesai", keterangan: "Pemeriksaan penawaran, evaluasi dan negosiasi" },
        { no: 5, nama: "Penetapan & Pengumuman Pemenang", mulai: "TBA", selesai: "20 Sep 2026", keterangan: "TBA" }
      ]
    },
    dokumen: [
      {
        id: 1,
        nama: "Gambar Kerja",
        fileName: "Gambar_Kerja.pdf",
        fileUrl: GAMBAR_KERJA_DOWNLOAD_URL,
        previewUrl: `https://drive.google.com/file/d/${GAMBAR_KERJA_ID}/view?usp=sharing`,
        keterangan: "Wajib dipelajari sebelum menyusun penawaran teknis"
      },
      {
        id: 2,
        nama: "Perkiraan Kuantitas",
        fileName: "Perkiraan_Kuantitas.pdf",
        fileUrl: PERKIRAAN_KUANTITAS_DOWNLOAD_URL,
        previewUrl: `https://drive.google.com/file/d/${PERKIRAAN_KUANTITAS_ID}/view?usp=sharing`,
        keterangan: "Perkiraan kuantitas, Penyedia harus tetap menghitung sendiri kuantitas sesuai gambar"
      }
    ],
    evaluasi: "• Metode Evaluasi: Evaluasi Harga Terendah.\n• Penyampaian Penawaran: Sistem 1 (satu) File.\n• Jenis Kontrak: Lump Sum (Tenaga Kerja), Material Supply By Owner.",
    kontak: "Panitia Renovasi Rumah Hunian Pendeta Gereja HKBP Jatiwaringin\nAlamat: Komp. A D Jatiwaringin Jalan Kartika Ekapaksi No.3 7, RT.7/RW.6, Cipinang Melayu, Kec. Makasar, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13620\nEmail Resmi: -\nTelepon / Helpdesk WhatsApp: +62 812-XXXX-XXXX\nJam Layanan Operasional: Senin - Jumat (08:00 - 16:00 WIB)"
  },
  bids: [
    {
      id: "BID-101",
      timestamp: "2026-09-09 10:15",
      nama: "Budi Santoso",
      perusahaan: "PT Solusi Cipta Digital",
      email: "budi@solusidigital.co.id",
      telepon: "081299881234",
      harga: 645000000,
      pdfName: "Penawaran_PT_Solusi_Cipta_Digital.pdf",
      pdfSize: "12.4 MB",
      pdfDataUrl: createSamplePdfDataUrl("Penawaran_PT_Solusi_Cipta_Digital.pdf")
    },
    {
      id: "BID-102",
      timestamp: "2026-09-10 09:30",
      nama: "Dewi Kurnia",
      perusahaan: "CV Nusantara Bangun",
      email: "dewi@nusantarabangun.com",
      telepon: "081377665544",
      harga: 610000000,
      pdfName: "Dokumen_Penawaran_CV_Nusantara.pdf",
      pdfSize: "18.1 MB",
      pdfDataUrl: createSamplePdfDataUrl("Dokumen_Penawaran_CV_Nusantara.pdf")
    },
    {
      id: "BID-103",
      timestamp: "2026-09-10 11:20",
      nama: "Hendra Wijaya",
      perusahaan: "PT Karya Konstruksi Mandiri",
      email: "hendra@karyamandiri.co.id",
      telepon: "081511223344",
      harga: 658000000,
      pdfName: "Berkas_Karya_Konstruksi.pdf",
      pdfSize: "15.0 MB",
      pdfDataUrl: createSamplePdfDataUrl("Berkas_Karya_Konstruksi.pdf")
    }
  ]
};

export function formatRupiah(number: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(number);
}

export function maskPhoneNumber(phone: string): string {
  if (!phone) return '-';
  const str = String(phone).trim();
  if (str.length <= 4) return str;
  const last4 = str.slice(-4);
  const maskedPart = '*'.repeat(str.length - 4);
  return maskedPart + last4;
}
