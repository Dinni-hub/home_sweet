import React from 'react';
import { CategoryBudget } from '../types/finance';
import { formatIDR } from '../utils/formatters';
import { Target, Edit2, Trash2, Plus } from 'lucide-react';

interface CategoryBudgetSummaryProps {
  categoryBudgets: CategoryBudget[];
  spentMap: Record<string, number>;
  onEditCategoryBudget: (category: CategoryBudget) => void;
  onDeleteCategoryBudget: (id: string) => void;
  onAddCategoryBudget: () => void;
}

export const CategoryBudgetSummary: React.FC<CategoryBudgetSummaryProps> = ({
  categoryBudgets,
  spentMap,
  onEditCategoryBudget,
  onDeleteCategoryBudget,
  onAddCategoryBudget,
}) => {
  const totalBudget = categoryBudgets.reduce((sum, cat) => sum + cat.budgetAmount, 0);
  const totalSpent = Object.values(spentMap).reduce((sum, val) => sum + val, 0);
  const totalRemaining = totalBudget - totalSpent;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-5 space-y-4">
      {/* Header with Contextual Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Target className="w-5 h-5 text-rose-500 shrink-0" />
            <span>REKAP BUDGET PER KATEGORI</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Pantau batas anggaran vs pengeluaran riil untuk tiap kategori keuangan
          </p>
        </div>

        <button
          onClick={onAddCategoryBudget}
          className="self-start sm:self-auto px-3.5 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span>Tambah Kategori Budget</span>
        </button>
      </div>

      {/* MOBILE CARD VIEW (On HP screens < 640px) */}
      <div className="sm:hidden space-y-3">
        {categoryBudgets.map((cat) => {
          const spent = spentMap[cat.categoryName] || 0;
          const remaining = cat.budgetAmount - spent;
          const progressPct = cat.budgetAmount > 0 
            ? Math.round((spent / cat.budgetAmount) * 100) 
            : 0;

          const isOver = remaining < 0;

          return (
            <div key={cat.id} className="p-3.5 bg-slate-50/80 border border-slate-200 rounded-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                  {cat.categoryName}
                  {isOver && (
                    <span className="text-[10px] text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.2 rounded-md font-bold">
                      Over!
                    </span>
                  )}
                </span>

                {/* Edit & Delete Action Buttons in Mobile View */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEditCategoryBudget(cat)}
                    className="p-1.5 text-slate-600 hover:text-rose-600 bg-white border border-slate-200 rounded-lg cursor-pointer"
                    title="Ubah Target"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteCategoryBudget(cat.id)}
                    className="p-1.5 text-red-500 hover:text-red-700 bg-red-50 border border-red-200 rounded-lg cursor-pointer"
                    title="Hapus Kategori"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-1 text-[11px] pt-1">
                <div>
                  <span className="text-slate-400 block">Target:</span>
                  <span className="font-bold text-slate-700">{formatIDR(cat.budgetAmount)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Terpakai:</span>
                  <span className="font-bold text-amber-600">{formatIDR(spent)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Sisa:</span>
                  <span className={`font-bold ${isOver ? 'text-red-600' : 'text-emerald-600'}`}>
                    {formatIDR(remaining)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isOver ? 'bg-red-500' : progressPct > 85 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, progressPct)}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-slate-600 tabular-nums">
                  {progressPct}%
                </span>
              </div>
            </div>
          );
        })}

        <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl space-y-1 text-xs">
          <div className="flex justify-between font-bold">
            <span>TOTAL BUDGET:</span>
            <span>{formatIDR(totalBudget)}</span>
          </div>
          <div className="flex justify-between font-bold text-amber-600">
            <span>TOTAL TERPAKAI:</span>
            <span>{formatIDR(totalSpent)}</span>
          </div>
          <div className={`flex justify-between font-extrabold ${totalRemaining >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            <span>TOTAL SISA:</span>
            <span>{formatIDR(totalRemaining)}</span>
          </div>
        </div>
      </div>

      {/* DESKTOP/TABLET TABLE VIEW (>= 640px) */}
      <div className="hidden sm:block overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-rose-50/60 text-slate-700 font-bold border-b border-rose-100">
              <th className="py-3 px-4 whitespace-nowrap">Kategori</th>
              <th className="py-3 px-4 text-right whitespace-nowrap">Budget Target</th>
              <th className="py-3 px-4 text-right whitespace-nowrap">Terpakai</th>
              <th className="py-3 px-4 text-right whitespace-nowrap">Sisa Budget</th>
              <th className="py-3 px-4 w-44 text-center whitespace-nowrap">Progress</th>
              <th className="py-3 px-4 text-center whitespace-nowrap">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {categoryBudgets.map((cat) => {
              const spent = spentMap[cat.categoryName] || 0;
              const remaining = cat.budgetAmount - spent;
              const progressPct = cat.budgetAmount > 0 
                ? Math.round((spent / cat.budgetAmount) * 100) 
                : 0;

              const isOver = remaining < 0;

              return (
                <tr key={cat.id} className="hover:bg-rose-50/20 transition-colors group">
                  <td className="py-3 px-4 font-bold text-slate-800 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span>{cat.categoryName}</span>
                      {isOver && (
                        <span className="text-[10px] text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.2 rounded-md font-semibold">
                          Over Budget!
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-slate-700 tabular-nums whitespace-nowrap">
                    {formatIDR(cat.budgetAmount)}
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-amber-600 tabular-nums whitespace-nowrap">
                    {formatIDR(spent)}
                  </td>
                  <td className={`py-3 px-4 text-right font-bold tabular-nums whitespace-nowrap ${
                    isOver ? 'text-red-600' : 'text-emerald-600'
                  }`}>
                    {formatIDR(remaining)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            isOver 
                              ? 'bg-red-500' 
                              : progressPct > 85 
                              ? 'bg-amber-500' 
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, progressPct)}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-bold text-slate-600 tabular-nums w-10 text-right">
                        {progressPct}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEditCategoryBudget(cat)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Ubah Target Budget"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteCategoryBudget(cat.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Hapus Kategori Budget"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-slate-50 font-bold text-slate-900 border-t border-slate-200">
              <td className="py-3.5 px-4 font-extrabold">TOTAL RINGKASAN</td>
              <td className="py-3.5 px-4 text-right text-slate-900 font-black tabular-nums whitespace-nowrap">
                {formatIDR(totalBudget)}
              </td>
              <td className="py-3.5 px-4 text-right text-amber-600 font-black tabular-nums whitespace-nowrap">
                {formatIDR(totalSpent)}
              </td>
              <td className={`py-3.5 px-4 text-right font-black tabular-nums whitespace-nowrap ${
                totalRemaining >= 0 ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {formatIDR(totalRemaining)}
              </td>
              <td className="py-3.5 px-4 text-center font-bold text-slate-700">
                {totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}% Terpakai
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
