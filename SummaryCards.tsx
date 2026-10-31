import React, { useState } from 'react';
import { formatIDR } from '../utils/formatters';
import { Target, TrendingDown, Wallet, Calendar, Plus, Sparkles, Edit2, Check } from 'lucide-react';

interface SummaryCardsProps {
  totalBudget: number;
  totalExpense: number;
  remainingBudget: number;
  selectedMonth: string;
  customMonths: string[];
  onChangeMonth: (month: string) => void;
  onAddCustomMonth: (monthName: string) => void;
  onUpdateTotalBudget: (newTotal: number) => void;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  totalBudget,
  totalExpense,
  remainingBudget,
  selectedMonth,
  customMonths,
  onChangeMonth,
  onAddCustomMonth,
  onUpdateTotalBudget,
}) => {
  const [isAddingMonth, setIsAddingMonth] = useState(false);
  const [newMonthInput, setNewMonthInput] = useState('');

  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState(totalBudget.toString());

  const handleAddMonthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMonthInput.trim()) {
      onAddCustomMonth(newMonthInput.trim());
      setNewMonthInput('');
      setIsAddingMonth(false);
    }
  };

  const handleBudgetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(budgetInput.replace(/[^0-9]/g, ''));
    if (!isNaN(num) && num >= 0) {
      onUpdateTotalBudget(num);
      setIsEditingBudget(false);
    }
  };

  const spentPercentage = totalBudget > 0 ? Math.min(100, Math.round((totalExpense / totalBudget) * 100)) : 0;

  return (
    <div className="space-y-4">
      {/* Top Banner with Title on Left & Month Selector on Right */}
      <div className="bg-gradient-to-r from-rose-100 via-pink-100 to-amber-100 border border-rose-200/80 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        
        {/* Left: Titles */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white/80 rounded-xl text-rose-500 shadow-xs hidden sm:block shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-800">
              Small steps, big dreams ♡
            </h2>
            <p className="text-sm sm:text-base font-bold text-rose-600 mt-0.5">
              Kelola uangmu, wujudkan mimpimu ✨
            </p>
          </div>
        </div>

        {/* Right: Periode / Bulan Selector */}
        <div className="bg-white/90 backdrop-blur-xs p-3 rounded-xl border border-rose-200/90 shadow-2xs w-full md:w-auto min-w-[240px]">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[11px] font-bold tracking-wider text-slate-600 uppercase flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span>PERIODE / BULAN</span>
            </span>
            <button
              onClick={() => setIsAddingMonth(!isAddingMonth)}
              className="text-[11px] text-blue-600 hover:text-blue-800 font-bold flex items-center gap-0.5 cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>Tambah</span>
            </button>
          </div>

          {isAddingMonth ? (
            <form onSubmit={handleAddMonthSubmit} className="space-y-1.5 mt-1">
              <input
                type="text"
                placeholder="Contoh: Desember 2026"
                value={newMonthInput}
                onChange={(e) => setNewMonthInput(e.target.value)}
                className="w-full text-xs p-1.5 border border-blue-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-400 bg-white"
                autoFocus
              />
              <div className="flex justify-end gap-1">
                <button
                  type="button"
                  onClick={() => setIsAddingMonth(false)}
                  className="px-2 py-0.5 text-[11px] text-slate-500 hover:bg-slate-100 rounded-md cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-2 py-0.5 text-[11px] bg-blue-600 text-white rounded-md font-medium cursor-pointer"
                >
                  Simpan
                </button>
              </div>
            </form>
          ) : (
            <select
              value={selectedMonth}
              onChange={(e) => onChangeMonth(e.target.value)}
              className="w-full bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm p-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-rose-400 cursor-pointer"
            >
              {customMonths.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          )}
        </div>

      </div>

      {/* 3 Metric Cards Grid (Total Budget, Total Pengeluaran, Sisa Budget) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        
        {/* Total Budget Card (Directly Editable!) */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-rose-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider text-slate-500 uppercase flex items-center gap-1.5">
              <Target className="w-4 h-4 text-rose-500" />
              TOTAL BUDGET
            </span>

            {/* Edit Total Budget Action */}
            <button
              onClick={() => {
                setBudgetInput(totalBudget.toString());
                setIsEditingBudget(!isEditingBudget);
              }}
              className="text-xs font-semibold text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-2 py-0.5 rounded-md flex items-center gap-1 cursor-pointer transition-colors"
              title="Edit Total Budget"
            >
              <Edit2 className="w-3 h-3" />
              <span>{isEditingBudget ? 'Batal' : 'Ubah'}</span>
            </button>
          </div>

          <div className="mt-3">
            {isEditingBudget ? (
              <form onSubmit={handleBudgetSubmit} className="space-y-2">
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                    Rp
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={budgetInput}
                    onChange={(e) => setBudgetInput(e.target.value)}
                    className="w-full text-sm font-bold pl-8 pr-2 py-1.5 border border-rose-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:outline-hidden"
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-1 text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Simpan Total Budget</span>
                </button>
              </form>
            ) : (
              <>
                <div className="text-xl sm:text-2xl font-extrabold text-slate-900 tabular-nums">
                  {formatIDR(totalBudget)}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Total anggaran yang disiapkan
                </p>
              </>
            )}
          </div>

          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
            <div 
              className="bg-rose-500 h-full transition-all duration-500" 
              style={{ width: `${spentPercentage}%` }}
            />
          </div>
        </div>

        {/* Total Pengeluaran Card (Calculated sum of category expenses) */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-amber-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider text-slate-500 uppercase flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4 text-amber-500" />
              TOTAL PENGELUARAN
            </span>
            <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md tabular-nums">
              {spentPercentage}% Terpakai
            </span>
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-extrabold text-amber-600 tabular-nums">
              {formatIDR(totalExpense)}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Total dari seluruh pengeluaran
            </p>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                spentPercentage > 100 ? 'bg-red-500' : 'bg-amber-500'
              }`} 
              style={{ width: `${Math.min(100, spentPercentage)}%` }}
            />
          </div>
        </div>

        {/* Sisa Budget Card (Total Budget - Total Pengeluaran) */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider text-slate-500 uppercase flex items-center gap-1.5">
              <Wallet className="w-4 h-4 text-emerald-500" />
              SISA BUDGET
            </span>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
              remainingBudget >= 0 ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'
            }`}>
              {remainingBudget >= 0 ? 'Aman' : 'Over Budget'}
            </span>
          </div>
          <div className="mt-3">
            <div className={`text-xl sm:text-2xl font-extrabold tabular-nums ${
              remainingBudget >= 0 ? 'text-emerald-600' : 'text-red-600'
            }`}>
              {formatIDR(remainingBudget)}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Sisa budget (Total Budget - Pengeluaran)
            </p>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                remainingBudget >= 0 ? 'bg-emerald-500' : 'bg-red-500'
              }`} 
              style={{ width: `${Math.max(0, 100 - spentPercentage)}%` }}
            />
          </div>
        </div>

      </div>
    </div>
  );
};
