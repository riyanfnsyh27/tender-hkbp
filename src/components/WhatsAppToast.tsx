import React from 'react';
import { MessageSquare, X } from 'lucide-react';

interface WhatsAppToastProps {
  message: string | null;
  onClose: () => void;
}

export const WhatsAppToast: React.FC<WhatsAppToastProps> = ({
  message,
  onClose,
}) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border-2 border-emerald-500 animate-bounce-short">
      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center text-xl shrink-0 shadow">
          <MessageSquare className="w-5 h-5 text-white" />
        </div>
        <div className="space-y-1 flex-grow">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-emerald-400">
              Pemberitahuan WhatsApp Terkirim!
            </h4>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-0.5 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p
            className="text-xs text-slate-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: message }}
          />
          <button
            onClick={onClose}
            className="text-[10px] font-bold text-emerald-400 underline pt-1 block cursor-pointer"
          >
            Tutup Notifikasi
          </button>
        </div>
      </div>
    </div>
  );
};
