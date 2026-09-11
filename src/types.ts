export interface JadwalItem {
  no: number;
  nama: string;
  mulai: string;
  selesai: string;
  keterangan: string;
}

export interface DokumenItem {
  id: number;
  nama: string;
  fileName: string;
  fileUrl: string;
  previewUrl?: string;
  keterangan: string;
}

export interface InformasiData {
  nama: string;
  instansi: string;
  hps: number;
  deskripsi: string;
  lainnya: string;
}

export interface JadwalData {
  deadlineIso: string;
  items: JadwalItem[];
}

export interface ContentData {
  informasi: InformasiData;
  persyaratan: string;
  jadwal: JadwalData;
  dokumen: DokumenItem[];
  evaluasi: string;
  kontak: string;
}

export interface BidItem {
  id: string;
  timestamp: string;
  nama: string;
  perusahaan: string;
  email: string;
  telepon: string;
  harga: number;
  pdfName: string;
  pdfSize: string;
  pdfDataUrl: string;
}

export interface AppState {
  winnerBidId: string | null;
  content: ContentData;
  bids: BidItem[];
}
