import React, { useState, useEffect } from 'react';
import {
  Trophy,
  ShieldCheck,
  Clock,
  ArrowRight,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { formatRupiah, maskPhoneNumber } from '../data';
import type { BidItem, ContentData } from '../types';

interface HeroSectionProps {
  content: ContentData;
  winnerBid: BidItem | undefined;
  onNavigateToUpload: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  content,
  winnerBid,
  onNavigateToUpload,
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
    isClosed: boolean;
    formattedDeadline: string;
  }>({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
    isClosed: false,
    formattedDeadline: '',
  });

  useEffect(() => {
    const updateCountdown = () => {
      const deadlineDate = new Date(content.jadwal.deadlineIso);
      const formattedDeadline =
        deadlineDate.toLocaleString('id-ID', {
          dateStyle: 'medium',
          timeStyle: 'short',
        }) + ' WIB';

      const now = new Date();
      const diff = deadlineDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({
          days: '00',
          hours: '00',
          minutes: '00',
          seconds: '00',
          isClosed: true,
          formattedDeadline,
        });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({
        days: String(days).padStart(2, '0'),
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0'),
        isClosed: false,
        formattedDeadline,
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [content.jadwal.deadlineIso]);

  return (
    <section className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white pt-8 pb-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* WINNER ANNOUNCEMENT BANNER (IF ANNOUNCED) */}
        {winnerBid && (
          <div className="mb-8 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 p-6 rounded-2xl shadow-2xl border-2 border-yellow-200">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-slate-950 text-amber-400 rounded-full flex items-center justify-center text-2xl shadow-lg shrink-0">
                  <Trophy className="w-8 h-8 text-amber-400" />
                </div>
                <div>
                  <span className="inline-block bg-slate-950 text-yellow-300 text-xs font-bold px-2.5 py-0.5 rounded-full mb-1 tracking-wider uppercase">
                    PENGUMUMAN PEMENANG RESMI
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-950">
                    PEMENANG TENDER TELAH DITETAPKAN!
                  </h2>
                  <p className="text-slate-900 text-sm font-medium mt-0.5">
                    Pemenang:{' '}
                    <span className="font-extrabold underline text-slate-950">
                      {winnerBid.perusahaan || 'Peserta Individual'}
                    </span>{' '}
                    ({winnerBid.nama})
                  </p>
                </div>
              </div>
              <div className="bg-slate-950/90 text-white px-5 py-3 rounded-xl border border-yellow-400/40 text-center md:text-right shrink-0">
                <div className="text-xs text-slate-400">Kontak Nomor Telepon / WA</div>
                <div className="text-xl font-black text-amber-400 tracking-wider">
                  {maskPhoneNumber(winnerBid.telepon)}
                </div>
                <div className="text-[10px] text-emerald-400 font-medium flex items-center justify-center md:justify-end gap-1 mt-0.5">
                  <CheckCircle2 className="w-3 h-3" />
                  Lolos Evaluasi Teknis &amp; Biaya Terendah
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Standard Header Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center space-x-2 bg-sky-500/20 text-sky-300 px-3 py-1 rounded-full text-xs font-semibold border border-sky-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>SISTEM E-PROCUREMENT</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
              {content.informasi.nama}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base">
              {content.informasi.instansi}
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <div className="bg-slate-800/80 px-4 py-2.5 rounded-xl border border-slate-700">
                <span className="text-xs text-slate-400 block">Nilai HPS Paket</span>
                <span className="text-lg font-bold text-emerald-400">
                  {formatRupiah(content.informasi.hps)}
                </span>
              </div>
              <div className="bg-slate-800/80 px-4 py-2.5 rounded-xl border border-slate-700">
                <span className="text-xs text-slate-400 block">Status Tahapan</span>
                <span className="text-sm font-semibold inline-flex items-center gap-1.5 mt-0.5">
                  {timeLeft.isClosed ? (
                    <span className="text-red-400 flex items-center gap-1.5 font-bold">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      Pemasukan Ditutup (Tahap Evaluasi)
                    </span>
                  ) : (
                    <span className="text-amber-400 flex items-center gap-1.5 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                      Masa Pemasukan Penawaran
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Realtime Countdown Timer Card */}
          <div className="lg:col-span-5">
            <div className="bg-slate-800/90 border border-slate-700 p-6 rounded-2xl shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-700/80">
                <div className="flex items-center space-x-2 text-slate-200 font-semibold text-sm">
                  <Clock className="w-4 h-4 text-amber-400 text-lg" />
                  <span>Hitung Mundur Penutupan</span>
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-md font-bold ${
                    timeLeft.isClosed
                      ? 'bg-red-900/80 text-red-200'
                      : 'bg-slate-700 text-slate-300 font-semibold'
                  }`}
                >
                  {timeLeft.isClosed ? 'Tenggat Berakhir' : 'Batas Penawaran'}
                </span>
              </div>

              {/* Timer Box Grid */}
              <div className="grid grid-cols-4 gap-2 text-center my-2">
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-700">
                  <div className="text-2xl sm:text-3xl font-black text-amber-400">
                    {timeLeft.days}
                  </div>
                  <div className="text-[10px] sm:text-xs text-slate-400 font-medium uppercase mt-1">
                    Hari
                  </div>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-700">
                  <div className="text-2xl sm:text-3xl font-black text-amber-400">
                    {timeLeft.hours}
                  </div>
                  <div className="text-[10px] sm:text-xs text-slate-400 font-medium uppercase mt-1">
                    Jam
                  </div>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-700">
                  <div className="text-2xl sm:text-3xl font-black text-amber-400">
                    {timeLeft.minutes}
                  </div>
                  <div className="text-[10px] sm:text-xs text-slate-400 font-medium uppercase mt-1">
                    Menit
                  </div>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-700">
                  <div className="text-2xl sm:text-3xl font-black text-amber-400">
                    {timeLeft.seconds}
                  </div>
                  <div className="text-[10px] sm:text-xs text-slate-400 font-medium uppercase mt-1">
                    Detik
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-700/80 text-xs text-slate-400 flex items-center justify-between">
                <span>
                  Tenggat:{' '}
                  <strong className="text-slate-200">
                    {timeLeft.formattedDeadline || '--/--/---- --:-- WIB'}
                  </strong>
                </span>
                {timeLeft.isClosed ? (
                  <span className="text-slate-400 font-medium flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Penawaran Ditutup
                  </span>
                ) : (
                  <button
                    onClick={onNavigateToUpload}
                    className="text-emerald-400 hover:text-emerald-300 font-medium underline flex items-center gap-1 cursor-pointer"
                  >
                    Kirim Berkas <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
