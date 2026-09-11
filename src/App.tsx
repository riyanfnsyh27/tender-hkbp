import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { AdminActiveBar } from './components/AdminActiveBar';
import { HeroSection } from './components/HeroSection';
import { NavigationTabs } from './components/NavigationTabs';
import { SectionInformasi } from './components/SectionInformasi';
import { SectionPersyaratan } from './components/SectionPersyaratan';
import { SectionJadwal } from './components/SectionJadwal';
import { SectionDokumen } from './components/SectionDokumen';
import { SectionEvaluasi } from './components/SectionEvaluasi';
import { SectionKontak } from './components/SectionKontak';
import { SectionPemenang } from './components/SectionPemenang';
import { SectionUpload } from './components/SectionUpload';
import { SectionBids } from './components/SectionBids';
import { LoginModal } from './components/LoginModal';
import { EditContentModal } from './components/EditContentModal';
import { WhatsAppToast } from './components/WhatsAppToast';
import { ConfirmModal } from './components/ConfirmModal';
import { Footer } from './components/Footer';

import { DEFAULT_STATE, formatRupiah, normalizeDokumenList } from './data';
import { subscribeToTenderData, syncTenderDataToFirebase } from './firebase';
import type { AppState, ContentData, BidItem } from './types';

export default function App() {
  // Load initial state from localStorage or default
  const [appData, setAppData] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem('tender_app_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.content) {
          const content = {
            ...DEFAULT_STATE.content,
            ...parsed.content,
            dokumen: normalizeDokumenList(parsed.content.dokumen),
          };
          return {
            ...DEFAULT_STATE,
            ...parsed,
            content,
            bids: Array.isArray(parsed.bids) ? parsed.bids : DEFAULT_STATE.bids,
          };
        }
      }
    } catch (e) {
      console.warn('Error reading from localStorage:', e);
    }
    return DEFAULT_STATE;
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('informasi');
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [editModalHeading, setEditModalHeading] = useState<string | null>(null);
  const [waToastMessage, setWaToastMessage] = useState<string | null>(null);
  const [isFirebaseLive, setIsFirebaseLive] = useState(false);
  const [confirmModalConfig, setConfirmModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    confirmColor?: 'red' | 'amber' | 'slate';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Subscribe to Firebase Realtime Database / Firestore on mount
  useEffect(() => {
    const unsub = subscribeToTenderData((cloudState) => {
      if (cloudState && cloudState.content) {
        setIsFirebaseLive(true);
        setAppData((prev) => {
          const normalizedContent = {
            ...prev.content,
            ...cloudState.content,
            dokumen: normalizeDokumenList(cloudState.content.dokumen),
          };
          const merged: AppState = {
            winnerBidId: cloudState.winnerBidId || null,
            content: normalizedContent,
            bids: Array.isArray(cloudState.bids) ? cloudState.bids : prev.bids,
          };
          try {
            localStorage.setItem('tender_app_data', JSON.stringify(merged));
          } catch (e) {
            console.warn('Local storage error:', e);
          }
          return merged;
        });
      }
    });

    // Sync normalized state to Firebase and local storage
    const normalizedInitial: AppState = {
      ...appData,
      content: {
        ...appData.content,
        dokumen: normalizeDokumenList(appData.content.dokumen),
      },
    };
    try {
      localStorage.setItem('tender_app_data', JSON.stringify(normalizedInitial));
    } catch {
      // ignore
    }
    syncTenderDataToFirebase(normalizedInitial)
      .then((success) => {
        if (success) setIsFirebaseLive(true);
      })
      .catch(() => {});

    return () => {
      unsub();
    };
  }, []);

  // Sync helper that updates state, localStorage, and Firebase
  const updateAndSyncState = (updater: (prev: AppState) => AppState) => {
    setAppData((prev) => {
      const nextState = updater(prev);
      try {
        localStorage.setItem('tender_app_data', JSON.stringify(nextState));
      } catch (err) {
        console.warn('Error saving to localStorage:', err);
      }
      // Realtime push to Firebase
      syncTenderDataToFirebase(nextState).catch((err) => {
        console.warn('Firebase push warning:', err);
      });
      return nextState;
    });
  };

  const handleNavigate = (tabId: string) => {
    if (tabId === 'home') {
      setActiveTab('informasi');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setActiveTab(tabId);
    setTimeout(() => {
      const element = document.getElementById(`section-${tabId}`);
      if (element) {
        const yOffset = -150;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
      }
    }, 40);
  };

  const handleLoginSuccess = (isSuper: boolean) => {
    setIsAdminLoggedIn(true);
    setIsSuperAdmin(isSuper);
  };

  const handleLogoutAdmin = () => {
    setIsAdminLoggedIn(false);
    setIsSuperAdmin(false);
    setActiveTab('informasi');
  };

  const handleAddBid = (newBid: BidItem) => {
    updateAndSyncState((prev) => ({
      ...prev,
      bids: [newBid, ...prev.bids],
    }));

    setWaToastMessage(
      `Dokumen penawaran dari <strong>${
        newBid.perusahaan || newBid.nama
      }</strong> (${formatRupiah(
        newBid.harga
      )}) berhasil diunggah! Kode Tanda Terima: <strong>${
        newBid.id
      }</strong> dikirimkan ke WhatsApp ${newBid.telepon}.`
    );

    alert(
      `BERHASIL!\n\nBerkas penawaran Anda (Kode: ${newBid.id}) telah resmi terdaftar di Sistem e-Procurement dan disinkronkan ke Firebase. Bukti tanda terima telah dikirim via WhatsApp.`
    );

    handleNavigate('informasi');
  };

  const handleSetWinner = (bidId: string) => {
    if (!isAdminLoggedIn) {
      alert('Akses ditolak: Hanya Admin yang dapat menentukan pemenang tender!');
      return;
    }

    const bid = appData.bids.find((b) => b.id === bidId);
    if (!bid) {
      alert('Data penawaran tidak ditemukan!');
      return;
    }

    const targetName = bid.perusahaan || bid.nama;

    updateAndSyncState((prev) => ({
      ...prev,
      winnerBidId: bid.id,
    }));

    alert(
      `BERHASIL! ${targetName} resmi ditetapkan sebagai PEMENANG TENDER. Informasi pemenang kini tampil di halaman utama.`
    );
    handleNavigate('pemenang');
  };

  const handleUnsetWinner = () => {
    setConfirmModalConfig({
      isOpen: true,
      title: 'Batalkan Penetapan Pemenang',
      message:
        'Apakah Anda yakin ingin membatalkan status penetapan pemenang tender saat ini? Banner dan pengumuman pemenang resmi akan diturunkan kembali.',
      confirmText: 'Ya, Batalkan Penetapan',
      cancelText: 'Kembali',
      confirmColor: 'red',
      onConfirm: () => {
        updateAndSyncState((prev) => ({
          ...prev,
          winnerBidId: null,
        }));
        setConfirmModalConfig((c) => ({ ...c, isOpen: false }));
        setWaToastMessage('Status penetapan pemenang tender telah <strong>berhasil dibatalkan</strong>.');
      },
    });
  };

  const handleDeleteBid = (bidId: string) => {
    if (!isSuperAdmin) {
      alert('Akses ditolak: Hanya Super Admin yang dapat menghapus data penawaran!');
      return;
    }

    const bid = appData.bids.find((b) => b.id === bidId);
    if (!bid) {
      alert('Data penawaran tidak ditemukan!');
      return;
    }

    const targetName = bid.perusahaan || bid.nama;
    const isCurrentWinner = appData.winnerBidId === bidId;

    setConfirmModalConfig({
      isOpen: true,
      title: isCurrentWinner ? 'Hapus Penawaran & Batalkan Pemenang' : 'Hapus Data Penawaran',
      message: isCurrentWinner
        ? `Penawaran dari "${targetName}" saat ini berstatus sebagai PEMENANG TENDER. Apakah Anda yakin ingin MENGHAPUS data ini secara permanen sekaligus membatalkan status penetapan pemenang?`
        : `Apakah Anda yakin ingin MENGHAPUS PERMANEN berkas penawaran dari "${targetName}" (${formatRupiah(
            bid.harga
          )})? Data yang dihapus tidak dapat dipulihkan.`,
      confirmText: 'Ya, Hapus Sekarang',
      cancelText: 'Batal',
      confirmColor: 'red',
      onConfirm: () => {
        updateAndSyncState((prev) => ({
          ...prev,
          winnerBidId: prev.winnerBidId === bidId ? null : prev.winnerBidId,
          bids: prev.bids.filter((b) => b.id !== bidId),
        }));
        setConfirmModalConfig((c) => ({ ...c, isOpen: false }));
        setWaToastMessage(
          `Data penawaran dari <strong>${targetName}</strong> telah berhasil dihapus secara permanen.`
        );
      },
    });
  };

  const handleSaveContent = (updatedContent: ContentData) => {
    updateAndSyncState((prev) => ({
      ...prev,
      content: {
        ...updatedContent,
        dokumen: normalizeDokumenList(updatedContent.dokumen),
      },
    }));
    alert('Perubahan konten berhasil disimpan dan disinkronkan!');
  };

  const winnerBid = appData.bids.find((b) => b.id === appData.winnerBidId);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Header */}
      <Header
        activeTab={activeTab}
        onNavigate={handleNavigate}
        isAdminLoggedIn={isAdminLoggedIn}
        isSuperAdmin={isSuperAdmin}
        onOpenLoginModal={() => setLoginModalOpen(true)}
        onLogoutAdmin={handleLogoutAdmin}
        isFirebaseLive={isFirebaseLive}
      />

      {/* Admin Active Notification Bar */}
      {isAdminLoggedIn && (
        <AdminActiveBar
          isSuperAdmin={isSuperAdmin}
          onNavigateToBids={() => handleNavigate('bids')}
          onLogoutAdmin={handleLogoutAdmin}
        />
      )}

      {/* Hero Section & Countdown Timer */}
      <HeroSection
        content={appData.content}
        winnerBid={winnerBid}
        onNavigateToUpload={() => handleNavigate('upload')}
      />

      {/* Main Navigation Tabs */}
      <NavigationTabs
        activeTab={activeTab}
        onSelectTab={handleNavigate}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      {/* Content Section Views */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div id="section-informasi" className={activeTab === 'informasi' ? 'block' : 'hidden'}>
          <SectionInformasi
            informasi={appData.content.informasi}
            isAdminLoggedIn={isAdminLoggedIn}
            onOpenEditModal={() => setEditModalHeading('informasi')}
          />
        </div>

        <div id="section-persyaratan" className={activeTab === 'persyaratan' ? 'block' : 'hidden'}>
          <SectionPersyaratan
            persyaratan={appData.content.persyaratan}
            isAdminLoggedIn={isAdminLoggedIn}
            onOpenEditModal={() => setEditModalHeading('persyaratan')}
          />
        </div>

        <div id="section-jadwal" className={activeTab === 'jadwal' ? 'block' : 'hidden'}>
          <SectionJadwal
            jadwal={appData.content.jadwal}
            isAdminLoggedIn={isAdminLoggedIn}
            onOpenEditModal={() => setEditModalHeading('jadwal')}
          />
        </div>

        <div id="section-dokumen" className={activeTab === 'dokumen' ? 'block' : 'hidden'}>
          <SectionDokumen
            dokumen={appData.content.dokumen}
            isAdminLoggedIn={isAdminLoggedIn}
            onOpenEditModal={() => setEditModalHeading('dokumen')}
          />
        </div>

        <div id="section-evaluasi" className={activeTab === 'evaluasi' ? 'block' : 'hidden'}>
          <SectionEvaluasi
            evaluasi={appData.content.evaluasi}
            isAdminLoggedIn={isAdminLoggedIn}
            onOpenEditModal={() => setEditModalHeading('evaluasi')}
          />
        </div>

        <div id="section-kontak" className={activeTab === 'kontak' ? 'block' : 'hidden'}>
          <SectionKontak
            kontak={appData.content.kontak}
            isAdminLoggedIn={isAdminLoggedIn}
            onOpenEditModal={() => setEditModalHeading('kontak')}
          />
        </div>

        <div id="section-pemenang" className={activeTab === 'pemenang' ? 'block' : 'hidden'}>
          <SectionPemenang
            winnerBid={winnerBid}
            isAdminLoggedIn={isAdminLoggedIn}
            onUnsetWinner={handleUnsetWinner}
            onNavigateToBids={() => handleNavigate('bids')}
          />
        </div>

        <div id="section-upload" className={activeTab === 'upload' ? 'block' : 'hidden'}>
          <SectionUpload
            deadlineIso={appData.content.jadwal.deadlineIso}
            onAddBid={handleAddBid}
          />
        </div>

        {isAdminLoggedIn && (
          <div id="section-bids" className={activeTab === 'bids' ? 'block' : 'hidden'}>
            <SectionBids
              bids={appData.bids}
              winnerBidId={appData.winnerBidId}
              deadlineIso={appData.content.jadwal.deadlineIso}
              isAdminLoggedIn={isAdminLoggedIn}
              isSuperAdmin={isSuperAdmin}
              onSetWinner={handleSetWinner}
              onUnsetWinner={handleUnsetWinner}
              onDeleteBid={handleDeleteBid}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Login Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModalConfig.isOpen}
        title={confirmModalConfig.title}
        message={confirmModalConfig.message}
        confirmText={confirmModalConfig.confirmText}
        cancelText={confirmModalConfig.cancelText}
        confirmColor={confirmModalConfig.confirmColor}
        onConfirm={confirmModalConfig.onConfirm}
        onCancel={() => setConfirmModalConfig((c) => ({ ...c, isOpen: false }))}
      />

      {/* Edit Content Modal */}
      {editModalHeading && (
        <EditContentModal
          isOpen={!!editModalHeading}
          headingKey={editModalHeading}
          content={appData.content}
          onClose={() => setEditModalHeading(null)}
          onSave={handleSaveContent}
        />
      )}

      {/* WhatsApp Toast */}
      <WhatsAppToast
        message={waToastMessage}
        onClose={() => setWaToastMessage(null)}
      />
    </div>
  );
}
