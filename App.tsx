import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FinanceData, Transaction, CategoryBudget, WishlistItem, InvestmentItem } from './types/finance';
import { loadFinanceData, saveFinanceData, resetToDefaultData } from './utils/storage';
import { formatIDR, downloadFile, generateCSVExport } from './utils/formatters';
import { Navbar } from './components/Navbar';
import { SummaryCards } from './components/SummaryCards';
import { TransactionTable } from './components/TransactionTable';
import { CategoryBudgetSummary } from './components/CategoryBudgetSummary';
import { WishlistSection } from './components/WishlistSection';
import { InvestmentSection } from './components/InvestmentSection';
import { AnalyticsSection } from './components/AnalyticsSection';
import { TransactionModal } from './components/TransactionModal';
import { WishlistModal } from './components/WishlistModal';
import { InvestmentModal } from './components/InvestmentModal';
import { CategoryBudgetModal } from './components/CategoryBudgetModal';
import { Check, ShieldAlert, Heart, PiggyBank, FileSpreadsheet, Download } from 'lucide-react';

export default function App() {
  const [data, setData] = useState<FinanceData>(() => loadFinanceData());
  const [activeTab, setActiveTab] = useState<'all' | 'transactions' | 'rekap' | 'wishlist' | 'investments'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  const [isWishModalOpen, setIsWishModalOpen] = useState(false);
  const [editingWish, setEditingWish] = useState<WishlistItem | null>(null);
  const [wishModalMode, setWishModalMode] = useState<'edit' | 'allocate'>('edit');

  const [isInvModalOpen, setIsInvModalOpen] = useState(false);
  const [editingInv, setEditingInv] = useState<InvestmentItem | null>(null);

  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<CategoryBudget | null>(null);

  // Auto-save to localStorage
  useEffect(() => {
    saveFinanceData(data);
  }, [data]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Derived Category List & Spent Map
  const categoryNames = useMemo(() => {
    return data.categoryBudgets.map((c) => c.categoryName);
  }, [data.categoryBudgets]);

  const spentMap = useMemo(() => {
    const map: Record<string, number> = {};
    data.transactions.forEach((tx) => {
      map[tx.category] = (map[tx.category] || 0) + tx.amount;
    });
    return map;
  }, [data.transactions]);

  const totalBudget = useMemo(() => {
    if (data.customTotalBudget !== undefined) {
      return data.customTotalBudget;
    }
    return data.categoryBudgets.reduce((sum, cat) => sum + cat.budgetAmount, 0);
  }, [data.customTotalBudget, data.categoryBudgets]);

  const totalExpense = useMemo(() => {
    return data.transactions.reduce((sum, tx) => sum + tx.amount, 0);
  }, [data.transactions]);

  const remainingBudget = totalBudget - totalExpense;

  const handleUpdateTotalBudget = (newTotal: number) => {
    setData((prev) => ({
      ...prev,
      customTotalBudget: newTotal,
    }));
    showToast('Total budget berhasil diperbarui!');
  };

  // Month change
  const handleMonthChange = (newMonth: string) => {
    setData((prev) => ({
      ...prev,
      selectedMonth: newMonth,
    }));
  };

  const handleAddCustomMonth = (monthName: string) => {
    if (!data.customMonths.includes(monthName)) {
      setData((prev) => ({
        ...prev,
        customMonths: [monthName, ...prev.customMonths],
        selectedMonth: monthName,
      }));
      showToast(`Periode "${monthName}" berhasil ditambahkan!`);
    } else {
      handleMonthChange(monthName);
    }
  };

  // Transaction Handlers
  const handleSaveTransaction = (tx: Omit<Transaction, 'id'> | Transaction) => {
    if ('id' in tx) {
      setData((prev) => ({
        ...prev,
        transactions: prev.transactions.map((t) => (t.id === tx.id ? tx : t)),
      }));
      showToast('Catatan transaksi berhasil diperbarui!');
    } else {
      const newTx: Transaction = {
        ...tx,
        id: `tx-${Date.now()}`,
      };
      setData((prev) => ({
        ...prev,
        transactions: [newTx, ...prev.transactions],
      }));
      showToast('Transaksi baru berhasil dicatat!');
    }
  };

  const handleDeleteTransaction = (id: string) => {
    setData((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((t) => t.id !== id),
    }));
    showToast('Transaksi telah berhasil dihapus.');
  };

  // Category Budget Handlers
  const handleSaveCategoryBudget = (cat: Omit<CategoryBudget, 'id'> | CategoryBudget) => {
    if ('id' in cat) {
      setData((prev) => ({
        ...prev,
        categoryBudgets: prev.categoryBudgets.map((c) => (c.id === cat.id ? cat : c)),
      }));
      showToast('Target budget kategori diperbarui!');
    } else {
      const newCat: CategoryBudget = {
        ...cat,
        id: `cat-${Date.now()}`,
      };
      setData((prev) => ({
        ...prev,
        categoryBudgets: [...prev.categoryBudgets, newCat],
      }));
      showToast('Kategori budget baru berhasil ditambahkan!');
    }
  };

  const handleDeleteCategoryBudget = (id: string) => {
    setData((prev) => ({
      ...prev,
      categoryBudgets: prev.categoryBudgets.filter((c) => c.id !== id),
    }));
    showToast('Kategori budget telah berhasil dihapus.');
  };

  // Wishlist Handlers
  const handleSaveWishlist = (item: Omit<WishlistItem, 'id'> | WishlistItem) => {
    if ('id' in item) {
      setData((prev) => ({
        ...prev,
        wishlist: prev.wishlist.map((w) => (w.id === item.id ? item : w)),
      }));
      showToast('Daftar impian berhasil diperbarui!');
    } else {
      const newWish: WishlistItem = {
        ...item,
        id: `wish-${Date.now()}`,
      };
      setData((prev) => ({
        ...prev,
        wishlist: [...prev.wishlist, newWish],
      }));
      showToast('Impian baru berhasil ditambahkan!');
    }
  };

  const handleDeleteWishlist = (id: string) => {
    setData((prev) => ({
      ...prev,
      wishlist: prev.wishlist.filter((w) => w.id !== id),
    }));
    showToast('Impian telah berhasil dihapus dari wish list.');
  };

  // Investment Handlers
  const handleSaveInvestment = (item: Omit<InvestmentItem, 'id'> | InvestmentItem) => {
    if ('id' in item) {
      setData((prev) => ({
        ...prev,
        investments: prev.investments.map((i) => (i.id === item.id ? item : i)),
      }));
      showToast('Portofolio investasi diperbarui!');
    } else {
      const newInv: InvestmentItem = {
        ...item,
        id: `inv-${Date.now()}`,
      };
      setData((prev) => ({
        ...prev,
        investments: [...prev.investments, newInv],
      }));
      showToast('Instrumen investasi baru berhasil ditambahkan!');
    }
  };

  const handleDeleteInvestment = (id: string) => {
    setData((prev) => ({
      ...prev,
      investments: prev.investments.filter((i) => i.id !== id),
    }));
    showToast('Instrumen investasi berhasil dihapus.');
  };

  // Export / Import / Reset Handlers
  const handleExportCSV = () => {
    const csvContent = generateCSVExport(
      data.selectedMonth,
      data.transactions,
      data.categoryBudgets,
      spentMap,
      data.wishlist,
      data.investments
    );
    const fileName = `Laporan_Keuangan_Home_Sweet_Home_${data.selectedMonth.replace(/\s+/g, '_')}.csv`;
    downloadFile(csvContent, fileName, 'text/csv;charset=utf-8;');
    showToast('File Excel / CSV berhasil diunduh!');
  };

  const handleExportJSON = () => {
    const jsonString = JSON.stringify(data, null, 2);
    const fileName = `Backup_Keuangan_Home_Sweet_Home_${data.selectedMonth.replace(/\s+/g, '_')}.json`;
    downloadFile(jsonString, fileName, 'application/json');
    showToast('Backup JSON berhasil diunduh!');
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && Array.isArray(parsed.transactions) && Array.isArray(parsed.categoryBudgets)) {
          setData(parsed);
          showToast('Data berhasil dipulihkan dari backup JSON!');
        } else {
          alert('Format file JSON tidak valid!');
        }
      } catch (err) {
        alert('Gagal membaca file JSON. Pastikan format valid.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetData = () => {
    if (confirm('Apakah Anda yakin ingin mengembalikan seluruh data ke contoh awal?')) {
      const defaultData = resetToDefaultData();
      setData(defaultData);
      showToast('Data berhasil dikembalikan ke contoh awal.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-800 flex flex-col font-sans antialiased selection:bg-rose-100 selection:text-rose-800">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Header */}
      <Navbar
        onOpenTransactionModal={() => {
          setEditingTx(null);
          setIsTxModalOpen(true);
        }}
        onExportCSV={handleExportCSV}
        onExportJSON={handleExportJSON}
        onImportJSON={handleImportJSON}
        onResetData={handleResetData}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Top Summary Dashboard */}
        <SummaryCards
          totalBudget={totalBudget}
          totalExpense={totalExpense}
          remainingBudget={remainingBudget}
          selectedMonth={data.selectedMonth}
          customMonths={data.customMonths}
          onChangeMonth={handleMonthChange}
          onAddCustomMonth={handleAddCustomMonth}
          onUpdateTotalBudget={handleUpdateTotalBudget}
        />

        {/* Dynamic Tab Views */}
        {(activeTab === 'all' || activeTab === 'transactions') && (
          <TransactionTable
            transactions={data.transactions}
            categoryOptions={categoryNames}
            onAddTransaction={() => {
              setEditingTx(null);
              setIsTxModalOpen(true);
            }}
            onEditTransaction={(tx) => {
              setEditingTx(tx);
              setIsTxModalOpen(true);
            }}
            onDeleteTransaction={handleDeleteTransaction}
          />
        )}

        {(activeTab === 'all' || activeTab === 'rekap') && (
          <CategoryBudgetSummary
            categoryBudgets={data.categoryBudgets}
            spentMap={spentMap}
            onEditCategoryBudget={(cat) => {
              setEditingCat(cat);
              setIsCatModalOpen(true);
            }}
            onDeleteCategoryBudget={handleDeleteCategoryBudget}
            onAddCategoryBudget={() => {
              setEditingCat(null);
              setIsCatModalOpen(true);
            }}
          />
        )}

        {activeTab === 'all' && (
          <AnalyticsSection transactions={data.transactions} />
        )}

        {(activeTab === 'all' || activeTab === 'wishlist') && (
          <WishlistSection
            wishlist={data.wishlist}
            onAddWishlistItem={() => {
              setEditingWish(null);
              setWishModalMode('edit');
              setIsWishModalOpen(true);
            }}
            onEditWishlistItem={(item) => {
              setEditingWish(item);
              setWishModalMode('edit');
              setIsWishModalOpen(true);
            }}
            onDeleteWishlistItem={handleDeleteWishlist}
            onAllocateSavings={(item) => {
              setEditingWish(item);
              setWishModalMode('allocate');
              setIsWishModalOpen(true);
            }}
          />
        )}

        {(activeTab === 'all' || activeTab === 'investments') && (
          <InvestmentSection
            investments={data.investments}
            onAddInvestmentItem={() => {
              setEditingInv(null);
              setIsInvModalOpen(true);
            }}
            onEditInvestmentItem={(item) => {
              setEditingInv(item);
              setIsInvModalOpen(true);
            }}
            onDeleteInvestmentItem={handleDeleteInvestment}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-rose-100 py-6 mt-10 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-medium">
            <span>🏠 Home Sweet Home - Kelola Keuangan</span>
            <span>·</span>
            <span className="text-emerald-600 font-semibold">Tersimpan Otomatis di Local Storage</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="hover:text-rose-600 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Download Excel/CSV</span>
            </button>
            <span>·</span>
            <button
              onClick={handleExportJSON}
              className="hover:text-rose-600 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Backup Data</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <TransactionModal
        isOpen={isTxModalOpen}
        onClose={() => setIsTxModalOpen(false)}
        onSave={handleSaveTransaction}
        initialData={editingTx}
        categoryOptions={categoryNames}
      />

      <WishlistModal
        isOpen={isWishModalOpen}
        onClose={() => setIsWishModalOpen(false)}
        onSave={handleSaveWishlist}
        initialData={editingWish}
        mode={wishModalMode}
      />

      <InvestmentModal
        isOpen={isInvModalOpen}
        onClose={() => setIsInvModalOpen(false)}
        onSave={handleSaveInvestment}
        initialData={editingInv}
      />

      <CategoryBudgetModal
        isOpen={isCatModalOpen}
        onClose={() => setIsCatModalOpen(false)}
        onSave={handleSaveCategoryBudget}
        initialData={editingCat}
      />

    </div>
  );
}
