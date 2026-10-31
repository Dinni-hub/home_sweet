import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  Download, 
  Upload, 
  RefreshCw, 
  FileSpreadsheet, 
  Home, 
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  onOpenTransactionModal: () => void;
  onExportCSV: () => void;
  onExportJSON: () => void;
  onImportJSON: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onResetData: () => void;
  activeTab: 'all' | 'transactions' | 'rekap' | 'wishlist' | 'investments';
  setActiveTab: (tab: 'all' | 'transactions' | 'rekap' | 'wishlist' | 'investments') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenTransactionModal,
  onExportCSV,
  onExportJSON,
  onImportJSON,
  onResetData,
  activeTab,
  setActiveTab,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDownloadOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white shadow-xs">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-slate-800 whitespace-nowrap">
                🏠 HOME SWEET HOME
              </h1>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-rose-50/70 p-1 rounded-xl border border-rose-100">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-white text-rose-700 shadow-xs'
                  : 'text-slate-600 hover:text-rose-600 hover:bg-white/50'
              }`}
            >
              Semua Ringkasan
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'transactions'
                  ? 'bg-white text-rose-700 shadow-xs'
                  : 'text-slate-600 hover:text-rose-600 hover:bg-white/50'
              }`}
            >
              🧾 Pengeluaran
            </button>
            <button
              onClick={() => setActiveTab('rekap')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'rekap'
                  ? 'bg-white text-rose-700 shadow-xs'
                  : 'text-slate-600 hover:text-rose-600 hover:bg-white/50'
              }`}
            >
              🎯 Rekap Budget
            </button>
            <button
              onClick={() => setActiveTab('wishlist')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'wishlist'
                  ? 'bg-white text-rose-700 shadow-xs'
                  : 'text-slate-600 hover:text-rose-600 hover:bg-white/50'
              }`}
            >
              💗 Wish List
            </button>
            <button
              onClick={() => setActiveTab('investments')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'investments'
                  ? 'bg-white text-rose-700 shadow-xs'
                  : 'text-slate-600 hover:text-rose-600 hover:bg-white/50'
              }`}
            >
              ⭐ Investasi
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Main Add Transaction Button */}
            <button
              onClick={onOpenTransactionModal}
              className="px-2.5 py-2 sm:px-3.5 sm:py-2 text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 rounded-xl shadow-xs transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Tambah Transaksi</span>
              <span className="sm:hidden">Tambah</span>
            </button>

            {/* Download Button Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDownloadOpen(!isDownloadOpen)}
                title="Unduh Laporan / Backup"
                className="p-2 sm:px-3 sm:py-2 text-xs font-semibold text-slate-700 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 rounded-xl transition-all border border-slate-200 flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-4 h-4 text-rose-500 shrink-0" />
                <span className="hidden md:inline">Unduh</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isDownloadOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
                  <button
                    onClick={() => {
                      onExportCSV();
                      setIsDownloadOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2.5 hover:bg-rose-50 hover:text-rose-700 flex items-center gap-2 cursor-pointer font-medium"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    <span>Unduh Excel / CSV</span>
                  </button>
                  <button
                    onClick={() => {
                      onExportJSON();
                      setIsDownloadOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2.5 hover:bg-rose-50 hover:text-rose-700 flex items-center gap-2 cursor-pointer font-medium"
                  >
                    <Download className="w-4 h-4 text-blue-600" />
                    <span>Backup Data JSON</span>
                  </button>
                </div>
              )}
            </div>

            {/* Restore File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={onImportJSON}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              title="Upload / Restore Backup"
              className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-slate-200 cursor-pointer hidden sm:block"
            >
              <Upload className="w-4 h-4" />
            </button>

            {/* Reset */}
            <button
              onClick={onResetData}
              title="Reset ke Contoh Data Awal"
              className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all border border-slate-200 cursor-pointer hidden md:block"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Nav Tabs */}
        <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto py-2.5 scrollbar-none border-t border-rose-50 text-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 font-bold rounded-lg whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'all' ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-3 py-1.5 font-bold rounded-lg whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'transactions' ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🧾 Pengeluaran
          </button>
          <button
            onClick={() => setActiveTab('rekap')}
            className={`px-3 py-1.5 font-bold rounded-lg whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'rekap' ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🎯 Rekap Budget
          </button>
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`px-3 py-1.5 font-bold rounded-lg whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'wishlist' ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            💗 Wish List
          </button>
          <button
            onClick={() => setActiveTab('investments')}
            className={`px-3 py-1.5 font-bold rounded-lg whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'investments' ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            ⭐ Investasi
          </button>
        </div>

      </div>
    </header>
  );
};
