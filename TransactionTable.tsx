import React, { useState, useMemo } from 'react';
import { Transaction, PaymentMethod } from '../types/finance';
import { formatDateIndonesian, formatIDR } from '../utils/formatters';
import { Search, Plus, Trash2, Edit2, ReceiptText } from 'lucide-react';

interface TransactionTableProps {
  transactions: Transaction[];
  categoryOptions: string[];
  onAddTransaction: () => void;
  onEditTransaction: (tx: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  categoryOptions,
  onAddTransaction,
  onEditTransaction,
  onDeleteTransaction,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');
  const [selectedPaymentFilter, setSelectedPaymentFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'>('date-desc');

  // Filter & Sort Logic
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesSearch = 
        tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = 
        selectedCategoryFilter === 'ALL' || tx.category === selectedCategoryFilter;

      const matchesPayment = 
        selectedPaymentFilter === 'ALL' || tx.paymentMethod === selectedPaymentFilter;

      return matchesSearch && matchesCategory && matchesPayment;
    }).sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'date-asc') return new Date(a.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'amount-desc') return b.amount - a.amount;
      if (sortBy === 'amount-asc') return a.amount - b.amount;
      return 0;
    });
  }, [transactions, searchTerm, selectedCategoryFilter, selectedPaymentFilter, sortBy]);

  const totalFilteredAmount = useMemo(() => {
    return filteredTransactions.reduce((sum, tx) => sum + tx.amount, 0);
  }, [filteredTransactions]);

  const getPaymentMethodBadge = (method: PaymentMethod) => {
    switch (method) {
      case 'QRIS':
        return 'bg-pink-50 text-pink-700 border-pink-200';
      case 'Cash':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Credit Card':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'E-Wallet':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Transfer':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-5 space-y-4">
      {/* Header Row with Contextual Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <ReceiptText className="w-5 h-5 text-rose-500 shrink-0" />
            <span>DAFTAR PENGELUARAN</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Riwayat transaksi pengeluaran keuangan harianmu ({filteredTransactions.length} transaksi)
          </p>
        </div>

        <button
          onClick={onAddTransaction}
          className="self-start sm:self-auto px-3.5 py-2 text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span>Tambah Pengeluaran</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 bg-slate-50/70 p-3 rounded-xl border border-slate-200/60">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari keterangan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-rose-400"
          />
        </div>

        <div>
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="w-full bg-white px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-rose-400 cursor-pointer"
          >
            <option value="ALL">🏷️ Semua Kategori</option>
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={selectedPaymentFilter}
            onChange={(e) => setSelectedPaymentFilter(e.target.value)}
            className="w-full bg-white px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-rose-400 cursor-pointer"
          >
            <option value="ALL">💳 Semua Pembayaran</option>
            <option value="QRIS">QRIS</option>
            <option value="Cash">Cash</option>
            <option value="Credit Card">Credit Card</option>
            <option value="E-Wallet">E-Wallet</option>
            <option value="Transfer">Transfer</option>
          </select>
        </div>

        <div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full bg-white px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-rose-400 cursor-pointer"
          >
            <option value="date-desc">📅 Terbaru Dulu</option>
            <option value="date-asc">📅 Terlama Dulu</option>
            <option value="amount-desc">💰 Nominal Terbesar</option>
            <option value="amount-asc">💰 Nominal Terkecil</option>
          </select>
        </div>
      </div>

      {/* MOBILE CARD VIEW (On HP screens < 640px) */}
      <div className="sm:hidden space-y-2.5">
        {filteredTransactions.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
            Belum ada transaksi pengeluaran.
          </div>
        ) : (
          filteredTransactions.map((tx) => (
            <div key={tx.id} className="p-3.5 bg-slate-50/80 border border-slate-200 rounded-xl space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-500">{formatDateIndonesian(tx.date)}</span>
                <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${getPaymentMethodBadge(tx.paymentMethod)}`}>
                  {tx.paymentMethod}
                </span>
              </div>

              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-sm text-slate-800">{tx.description}</h4>
                  <span className="text-[11px] font-medium text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200 mt-1 inline-block">
                    {tx.category}
                  </span>
                </div>
                <div className="font-extrabold text-base text-rose-600 tabular-nums whitespace-nowrap">
                  {formatIDR(tx.amount)}
                </div>
              </div>

              {/* Direct Working Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200/80">
                <button
                  onClick={() => onEditTransaction(tx)}
                  className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg flex items-center gap-1 cursor-pointer active:scale-95"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => onDeleteTransaction(tx.id)}
                  className="px-2.5 py-1 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg flex items-center gap-1 cursor-pointer active:scale-95"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-600" />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          ))
        )}

        {/* Mobile Total Pengeluaran Summary - Left Aligned Text */}
        {filteredTransactions.length > 0 && (
          <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-center justify-between text-xs font-bold text-slate-800">
            <span className="text-left font-extrabold text-slate-700">TOTAL PENGELUARAN</span>
            <span className="text-rose-600 font-extrabold text-sm tabular-nums">
              {formatIDR(totalFilteredAmount)}
            </span>
          </div>
        )}
      </div>

      {/* TABLE VIEW (Tablet & Desktop screens >= 640px) */}
      <div className="hidden sm:block overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-xs border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-rose-50/60 text-slate-700 font-bold border-b border-rose-100">
              <th className="py-3 px-4 whitespace-nowrap">📅 Tanggal</th>
              <th className="py-3 px-4 whitespace-nowrap">📝 Keterangan</th>
              <th className="py-3 px-4 whitespace-nowrap">🏷️ Kategori</th>
              <th className="py-3 px-4 whitespace-nowrap">💳 Bayar</th>
              <th className="py-3 px-4 text-right whitespace-nowrap">💰 Nominal</th>
              <th className="py-3 px-4 text-center whitespace-nowrap">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  Belum ada transaksi pengeluaran. Klik "Tambah Pengeluaran" untuk mulai mencatat!
                </td>
              </tr>
            ) : (
              filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-rose-50/30 transition-colors group">
                  <td className="py-3 px-4 font-medium text-slate-600 whitespace-nowrap">
                    {formatDateIndonesian(tx.date)}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800">
                    {tx.description}
                  </td>
                  <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                    <span className="inline-block bg-slate-100 px-2 py-0.5 rounded-md text-xs font-medium text-slate-700 border border-slate-200">
                      {tx.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-semibold border ${getPaymentMethodBadge(tx.paymentMethod)}`}>
                      {tx.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900 tabular-nums whitespace-nowrap">
                    {formatIDR(tx.amount)}
                  </td>
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEditTransaction(tx)}
                        title="Edit"
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteTransaction(tx.id)}
                        title="Hapus"
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot>
            <tr className="bg-slate-50 font-bold text-slate-800 border-t border-slate-200">
              <td colSpan={2} className="py-3.5 px-4 text-left font-extrabold text-slate-800 uppercase tracking-wide">
                TOTAL PENGELUARAN
              </td>
              <td colSpan={2}></td>
              <td className="py-3.5 px-4 text-right text-rose-600 font-extrabold text-sm tabular-nums whitespace-nowrap">
                {formatIDR(totalFilteredAmount)}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
