import React, { useState } from 'react';
import {
  FileText,
  Home,
  Info,
  CheckSquare,
  Calendar,
  FolderOpen,
  Scale,
  PhoneCall,
  Trophy,
  Send,
  Lock,
  Menu,
  X,
  Radio
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  onNavigate: (tabId: string) => void;
  isAdminLoggedIn: boolean;
  isSuperAdmin: boolean;
  onOpenLoginModal: () => void;
  onLogoutAdmin: () => void;
  isFirebaseLive: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onNavigate,
  isAdminLoggedIn,
  isSuperAdmin,
  onOpenLoginModal,
  onLogoutAdmin,
  isFirebaseLive,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tabId: string) => {
    onNavigate(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-lg border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Portal Name */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => handleNavClick('home')}
          >
            <div className="w-[40px] h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-400 flex items-center justify-center text-white font-bold text-xl shadow-md transition-transform group-hover:scale-105">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight block leading-none">E-PROC HKBP</span>
                {isFirebaseLive && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-700/50">
                    <Radio className="w-2.5 h-2.5 animate-pulse text-emerald-400" />
                    Live RTDB
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-400 tracking-wider uppercase font-medium">Sistem e-Procurement</span>
            </div>
          </div>

          {/* Navigation Links for Desktop */}
          <nav className="hidden xl:flex items-center space-x-1 font-medium text-xs 2xl:text-sm">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3 py-2 rounded-lg transition flex items-center ${
                activeTab === 'home' || activeTab === 'informasi'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Home className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
              Beranda
            </button>
            <button
              onClick={() => handleNavClick('informasi')}
              className={`px-3 py-2 rounded-lg transition ${
                activeTab === 'informasi'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Informasi
            </button>
            <button
              onClick={() => handleNavClick('persyaratan')}
              className={`px-3 py-2 rounded-lg transition ${
                activeTab === 'persyaratan'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Persyaratan
            </button>
            <button
              onClick={() => handleNavClick('jadwal')}
              className={`px-3 py-2 rounded-lg transition ${
                activeTab === 'jadwal'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Jadwal
            </button>
            <button
              onClick={() => handleNavClick('dokumen')}
              className={`px-3 py-2 rounded-lg transition ${
                activeTab === 'dokumen'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Dokumen
            </button>
            <button
              onClick={() => handleNavClick('evaluasi')}
              className={`px-3 py-2 rounded-lg transition ${
                activeTab === 'evaluasi'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Metode Evaluasi
            </button>
            <button
              onClick={() => handleNavClick('kontak')}
              className={`px-3 py-2 rounded-lg transition ${
                activeTab === 'kontak'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Kontak
            </button>
            <button
              onClick={() => handleNavClick('pemenang')}
              className={`px-3 py-2 rounded-lg text-amber-400 hover:text-amber-300 hover:bg-slate-800 transition font-semibold flex items-center ${
                activeTab === 'pemenang' ? 'bg-slate-800 font-bold' : ''
              }`}
            >
              <Trophy className="w-3.5 h-3.5 mr-1 text-amber-400" />
              Pemenang
            </button>
            <button
              onClick={() => handleNavClick('upload')}
              className="ml-2 px-3.5 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-500 shadow transition flex items-center text-xs"
            >
              <Send className="w-3.5 h-3.5 mr-1.5" />
              Upload Penawaran
            </button>
          </nav>

          {/* Admin Action & Mobile Menu Button */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              <span
                className={`w-2 h-2 rounded-full ${
                  isAdminLoggedIn
                    ? isSuperAdmin
                      ? 'bg-purple-400 animate-pulse'
                      : 'bg-emerald-400 animate-pulse'
                    : 'bg-slate-400'
                }`}
              />
              <span>
                {isAdminLoggedIn
                  ? isSuperAdmin
                    ? 'Super Administrator'
                    : 'Administrator'
                  : 'Pengunjung (User)'}
              </span>
            </div>

            <button
              onClick={isAdminLoggedIn ? onLogoutAdmin : onOpenLoginModal}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition flex items-center"
            >
              <Lock className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
              <span>
                {isAdminLoggedIn
                  ? isSuperAdmin
                    ? 'Super Admin Logout'
                    : 'Admin Logout'
                  : 'Admin Login'}
              </span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-slate-400 hover:text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-800 bg-slate-900 px-4 pt-2 pb-4 space-y-1 text-sm">
          <button
            onClick={() => handleNavClick('home')}
            className="block w-full text-left px-3 py-2 rounded-md text-slate-300 hover:bg-slate-800"
          >
            Beranda
          </button>
          <button
            onClick={() => handleNavClick('informasi')}
            className="block w-full text-left px-3 py-2 rounded-md text-slate-300 hover:bg-slate-800"
          >
            Informasi Tender
          </button>
          <button
            onClick={() => handleNavClick('persyaratan')}
            className="block w-full text-left px-3 py-2 rounded-md text-slate-300 hover:bg-slate-800"
          >
            Persyaratan Peserta
          </button>
          <button
            onClick={() => handleNavClick('jadwal')}
            className="block w-full text-left px-3 py-2 rounded-md text-slate-300 hover:bg-slate-800"
          >
            Jadwal Tender
          </button>
          <button
            onClick={() => handleNavClick('dokumen')}
            className="block w-full text-left px-3 py-2 rounded-md text-slate-300 hover:bg-slate-800"
          >
            Dokumen Pendukung
          </button>
          <button
            onClick={() => handleNavClick('evaluasi')}
            className="block w-full text-left px-3 py-2 rounded-md text-slate-300 hover:bg-slate-800"
          >
            Metode Evaluasi
          </button>
          <button
            onClick={() => handleNavClick('kontak')}
            className="block w-full text-left px-3 py-2 rounded-md text-slate-300 hover:bg-slate-800"
          >
            Kontak Panitia
          </button>
          <button
            onClick={() => handleNavClick('pemenang')}
            className="block w-full text-left px-3 py-2 rounded-md text-amber-400 font-bold hover:bg-slate-800"
          >
            Penetapan Pemenang
          </button>
          <button
            onClick={() => handleNavClick('upload')}
            className="block w-full text-left px-3 py-2 rounded-md bg-emerald-600 text-white font-semibold"
          >
            Upload Penawaran
          </button>
          {isAdminLoggedIn && (
            <button
              onClick={() => handleNavClick('bids')}
              className="block w-full text-left px-3 py-2 rounded-md bg-amber-500 text-slate-950 font-bold"
            >
              Evaluasi Penawaran Masuk (Admin)
            </button>
          )}
        </div>
      )}
    </header>
  );
};
