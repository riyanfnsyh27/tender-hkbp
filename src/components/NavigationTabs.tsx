import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Info,
  CheckSquare,
  Calendar,
  FolderOpen,
  Scale,
  PhoneCall,
  Trophy,
  CloudUpload,
  ListCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface NavigationTabsProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  isAdminLoggedIn: boolean;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  onSelectTab,
  isAdminLoggedIn,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Drag-to-scroll state
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftStartRef = useRef(0);
  const movedRef = useRef(false);

  const tabs = [
    { id: 'informasi', label: '1. Informasi Tender', icon: Info, iconColor: 'text-sky-600' },
    { id: 'persyaratan', label: '2. Persyaratan Peserta', icon: CheckSquare, iconColor: 'text-indigo-600' },
    { id: 'jadwal', label: '3. Jadwal Tender', icon: Calendar, iconColor: 'text-amber-600' },
    { id: 'dokumen', label: '4. Dokumen Pendukung', icon: FolderOpen, iconColor: 'text-cyan-600' },
    { id: 'evaluasi', label: '5. Metode Evaluasi', icon: Scale, iconColor: 'text-emerald-600' },
    { id: 'kontak', label: '6. Kontak Panitia', icon: PhoneCall, iconColor: 'text-purple-600' },
    { id: 'pemenang', label: '7. Penetapan Pemenang', icon: Trophy, iconColor: 'text-amber-600', isWinner: true },
    { id: 'upload', label: 'Upload Penawaran', icon: CloudUpload, iconColor: 'text-emerald-600', isUpload: true },
  ];

  const checkScrollability = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    checkScrollability();
    el.addEventListener('scroll', checkScrollability, { passive: true });
    window.addEventListener('resize', checkScrollability);

    return () => {
      el.removeEventListener('scroll', checkScrollability);
      window.removeEventListener('resize', checkScrollability);
    };
  }, [checkScrollability, isAdminLoggedIn]);

  // Center the active tab in the horizontal scroll container
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const activeButton = container.querySelector<HTMLButtonElement>(`[data-tab-id="${activeTab}"]`);
    if (activeButton) {
      activeButton.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [activeTab]);

  const handleScrollBy = (offset: number) => {
    const el = scrollContainerRef.current;
    if (el) {
      el.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // Mouse Drag-to-Scroll handlers for desktop convenience
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    isDraggingRef.current = true;
    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftStartRef.current = el.scrollLeft;
    movedRef.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const el = scrollContainerRef.current;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    if (Math.abs(walk) > 4) {
      movedRef.current = true;
    }
    el.scrollLeft = scrollLeftStartRef.current - walk;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleTabClick = (tabId: string) => {
    // If the user was dragging horizontally, don't trigger button switch
    if (movedRef.current) {
      movedRef.current = false;
      return;
    }
    onSelectTab(tabId);
  };

  return (
    <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all select-none">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 relative flex items-center">
        {/* Left Scroll Button */}
        <button
          onClick={() => handleScrollBy(-240)}
          aria-label="Scroll left"
          className={`hidden sm:flex absolute left-1 sm:left-4 z-10 w-8 h-8 rounded-full bg-white/90 border border-slate-300 shadow-md text-slate-700 hover:text-sky-600 hover:border-sky-400 items-center justify-center transition-all cursor-pointer ${
            canScrollLeft ? 'opacity-100 scale-100' : 'opacity-0 pointer-events-none scale-90'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Scrollable Tabs Wrapper with smooth momentum */}
        <div
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="w-full overflow-x-auto py-2.5 px-1 sm:px-8 flex items-center space-x-2 scroll-smooth cursor-grab active:cursor-grabbing scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent"
          style={{
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            let buttonClass =
              'shrink-0 px-3.5 py-2 rounded-lg transition-all flex items-center gap-2 font-semibold text-xs sm:text-sm whitespace-nowrap cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98] ';

            if (isActive) {
              buttonClass += 'bg-sky-600 text-white shadow-md ring-2 ring-sky-300/50';
            } else if (tab.isWinner) {
              buttonClass += 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 font-bold';
            } else if (tab.isUpload) {
              buttonClass += 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 font-bold';
            } else {
              buttonClass += 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/80';
            }

            return (
              <button
                key={tab.id}
                data-tab-id={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={buttonClass}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : tab.iconColor}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}

          {isAdminLoggedIn && (
            <button
              data-tab-id="bids"
              onClick={() => handleTabClick('bids')}
              className={`shrink-0 px-3.5 py-2 rounded-lg transition-all flex items-center gap-2 font-bold text-xs sm:text-sm whitespace-nowrap cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98] ${
                activeTab === 'bids'
                  ? 'bg-purple-600 text-white shadow-md ring-2 ring-purple-300/50'
                  : 'bg-purple-50 text-purple-900 border border-purple-300 hover:bg-purple-100'
              }`}
            >
              <ListCheck className={`w-4 h-4 shrink-0 ${activeTab === 'bids' ? 'text-white' : 'text-purple-600'}`} />
              <span>Evaluasi Penawaran (Admin)</span>
            </button>
          )}
        </div>

        {/* Right Scroll Button */}
        <button
          onClick={() => handleScrollBy(240)}
          aria-label="Scroll right"
          className={`hidden sm:flex absolute right-1 sm:right-4 z-10 w-8 h-8 rounded-full bg-white/90 border border-slate-300 shadow-md text-slate-700 hover:text-sky-600 hover:border-sky-400 items-center justify-center transition-all cursor-pointer ${
            canScrollRight ? 'opacity-100 scale-100' : 'opacity-0 pointer-events-none scale-90'
          }`}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
