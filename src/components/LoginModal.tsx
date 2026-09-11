import React, { useState } from 'react';
import { X, ShieldAlert, Lock, User } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (isSuper: boolean) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const u = username.trim();
    const p = password.trim();

    if (u === 'superadmin' && p === 'sudinbmtimur123') {
      setErrorMsg(false);
      onLoginSuccess(true);
      onClose();
      setUsername('');
      setPassword('');
      alert('Login Super Admin Berhasil!');
    } else if (u === 'admin' && p === 'jakartatimur123') {
      setErrorMsg(false);
      onLoginSuccess(false);
      onClose();
      setUsername('');
      setPassword('');
      alert('Login Admin Berhasil!');
    } else {
      setErrorMsg(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-slate-900 text-amber-400 rounded-xl flex items-center justify-center text-xl mx-auto mb-3 shadow">
            <ShieldAlert className="w-6 h-6 text-amber-400" />
          </div>
          <h3 className="text-lg font-extrabold text-slate-900">
            Otentikasi Panitia Admin
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Masukkan kredensial khusus administrator tender
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center gap-1">
              <User className="w-3 h-3 text-slate-400" />
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center gap-1">
              <Lock className="w-3 h-3 text-slate-400" />
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 outline-none"
            />
          </div>

          {errorMsg && (
            <div className="text-xs text-red-600 font-semibold bg-red-50 p-2.5 rounded-lg border border-red-200">
              Username atau password admin salah!
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm shadow transition cursor-pointer"
          >
            Masuk Sebagai Admin
          </button>
        </form>
      </div>
    </div>
  );
};
