import React from 'react';
import { InvestmentItem } from '../types/finance';
import { formatIDR } from '../utils/formatters';
import { Star, Plus, Edit2, Trash2, TrendingUp } from 'lucide-react';

interface InvestmentSectionProps {
  investments: InvestmentItem[];
  onAddInvestmentItem: () => void;
  onEditInvestmentItem: (item: InvestmentItem) => void;
  onDeleteInvestmentItem: (id: string) => void;
}

export const InvestmentSection: React.FC<InvestmentSectionProps> = ({
  investments,
  onAddInvestmentItem,
  onEditInvestmentItem,
  onDeleteInvestmentItem,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-5 space-y-4">
      {/* Header with Contextual Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-100 shrink-0" />
            <span>INSTRUMEN INVESTASI & PORTOFOLIO</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Pantau pertumbuhan aset investasi dan dana darurat jangka panjangmu
          </p>
        </div>

        <button
          onClick={onAddInvestmentItem}
          className="self-start sm:self-auto px-3.5 py-2 text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-200 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span>Tambah Instrumen</span>
        </button>
      </div>

      {/* MOBILE CARD VIEW (On HP screens < 640px) */}
      <div className="sm:hidden space-y-3">
        {investments.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
            Belum ada instrumen investasi.
          </div>
        ) : (
          investments.map((item) => {
            const progressPct = item.targetAmount > 0
              ? Math.min(100, Math.round((item.savedAmount / item.targetAmount) * 100))
              : 0;

            return (
              <div key={item.id} className="p-3.5 bg-amber-50/40 border border-amber-100 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
                    {item.categoryName}
                  </span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                    item.savedAmount >= item.targetAmount
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-white text-slate-600 border-slate-200'
                  }`}>
                    {item.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Target:</span>
                    <span className="font-bold text-slate-700">{formatIDR(item.targetAmount)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Portofolio:</span>
                    <span className="font-bold text-amber-600">{formatIDR(item.savedAmount)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full transition-all duration-300"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-600 tabular-nums">{progressPct}%</span>
                </div>

                {item.notes && (
                  <p className="text-[11px] text-slate-500 italic pt-0.5">{item.notes}</p>
                )}

                <div className="flex justify-end gap-2 pt-2 border-t border-amber-100">
                  <button
                    onClick={() => onEditInvestmentItem(item)}
                    className="p-1 text-slate-500 hover:text-amber-700"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteInvestmentItem(item.id)}
                    className="p-1 text-slate-400 hover:text-red-600"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* DESKTOP/TABLET TABLE VIEW (>= 640px) */}
      <div className="hidden sm:block overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-amber-50/60 text-slate-700 font-bold border-b border-amber-100">
              <th className="py-3 px-4 whitespace-nowrap">Kategori Investasi</th>
              <th className="py-3 px-4 text-right whitespace-nowrap">Target Tabungan</th>
              <th className="py-3 px-4 text-right whitespace-nowrap">Portofolio Terkumpul</th>
              <th className="py-3 px-4 w-40 text-center whitespace-nowrap">Progress Nabung</th>
              <th className="py-3 px-4 text-center whitespace-nowrap">Status</th>
              <th className="py-3 px-4 whitespace-nowrap">Catatan</th>
              <th className="py-3 px-4 text-center whitespace-nowrap">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {investments.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  Belum ada instrumen investasi. Tambahkan portofolio investasimu!
                </td>
              </tr>
            ) : (
              investments.map((item) => {
                const progressPct = item.targetAmount > 0
                  ? Math.min(100, Math.round((item.savedAmount / item.targetAmount) * 100))
                  : 0;

                return (
                  <tr key={item.id} className="hover:bg-amber-50/20 transition-colors group">
                    <td className="py-3 px-4 font-bold text-slate-800 whitespace-nowrap flex items-center gap-2">
                      <TrendingUp className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{item.categoryName}</span>
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-slate-700 tabular-nums whitespace-nowrap">
                      {formatIDR(item.targetAmount)}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-amber-600 tabular-nums whitespace-nowrap">
                      {formatIDR(item.savedAmount)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-amber-500 h-full transition-all duration-300"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-bold text-slate-600 tabular-nums w-10 text-right">
                          {progressPct}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${
                        item.savedAmount >= item.targetAmount
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-xs truncate max-w-xs">
                      {item.notes || '-'}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onEditInvestmentItem(item)}
                          className="p-1.5 text-slate-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit / Update Balance"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteInvestmentItem(item.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
