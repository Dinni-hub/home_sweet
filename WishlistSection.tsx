import React from 'react';
import { WishlistItem } from '../types/finance';
import { formatIDR } from '../utils/formatters';
import { Heart, Plus, Edit2, Trash2, PiggyBank, Sparkles } from 'lucide-react';

interface WishlistSectionProps {
  wishlist: WishlistItem[];
  onAddWishlistItem: () => void;
  onEditWishlistItem: (item: WishlistItem) => void;
  onDeleteWishlistItem: (id: string) => void;
  onAllocateSavings: (item: WishlistItem) => void;
}

export const WishlistSection: React.FC<WishlistSectionProps> = ({
  wishlist,
  onAddWishlistItem,
  onEditWishlistItem,
  onDeleteWishlistItem,
  onAllocateSavings,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-5 space-y-4">
      {/* Header with Contextual Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-100 shrink-0" />
            <span>WISH LIST / IMPIAN</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar target barang impian dan bebas finansial yang ingin kamu wujudkan
          </p>
        </div>

        <button
          onClick={onAddWishlistItem}
          className="self-start sm:self-auto px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span>Tambah Wish List</span>
        </button>
      </div>

      {/* MOBILE CARD VIEW (On HP screens < 640px) */}
      <div className="sm:hidden space-y-3">
        {wishlist.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
            Belum ada daftar wish list.
          </div>
        ) : (
          wishlist.map((item) => {
            const progressPct = item.targetAmount > 0
              ? Math.min(100, Math.round((item.savedAmount / item.targetAmount) * 100))
              : 0;
            const isReady = item.savedAmount >= item.targetAmount;

            return (
              <div key={item.id} className="p-3.5 bg-pink-50/40 border border-pink-100 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                    {item.name}
                  </span>
                  <span className="text-amber-500 font-bold text-xs">{item.priority}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Target:</span>
                    <span className="font-bold text-slate-800">{formatIDR(item.targetAmount)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Terkumpul:</span>
                    <span className="font-bold text-emerald-600">{formatIDR(item.savedAmount)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${isReady ? 'bg-emerald-500' : 'bg-pink-500'}`}
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-600 tabular-nums">{progressPct}%</span>
                </div>

                {item.notes && (
                  <p className="text-[11px] text-slate-500 italic pt-0.5">{item.notes}</p>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-pink-100">
                  <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${
                    isReady || item.status === 'Tercapai'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {isReady ? 'Bisa Dibeli ✨' : item.status}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onAllocateSavings(item)}
                      className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-[11px] font-bold border border-emerald-200 flex items-center gap-1 cursor-pointer"
                    >
                      <PiggyBank className="w-3 h-3" />
                      <span>Nabung</span>
                    </button>
                    <button
                      onClick={() => onEditWishlistItem(item)}
                      className="p-1 text-slate-500 hover:text-rose-600"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteWishlistItem(item.id)}
                      className="p-1 text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
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
            <tr className="bg-pink-50/60 text-slate-700 font-bold border-b border-pink-100">
              <th className="py-3 px-4 whitespace-nowrap">Nama Impian</th>
              <th className="py-3 px-4 text-right whitespace-nowrap">Target Dana</th>
              <th className="py-3 px-4 text-center whitespace-nowrap">Prioritas</th>
              <th className="py-3 px-4 text-right whitespace-nowrap">Sudah Ditabung</th>
              <th className="py-3 px-4 w-40 text-center whitespace-nowrap">Progress Nabung</th>
              <th className="py-3 px-4 text-center whitespace-nowrap">Status</th>
              <th className="py-3 px-4 whitespace-nowrap">Catatan</th>
              <th className="py-3 px-4 text-center whitespace-nowrap">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {wishlist.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400">
                  Belum ada daftar wish list. Tambahkan barang impian pertamamu!
                </td>
              </tr>
            ) : (
              wishlist.map((item) => {
                const progressPct = item.targetAmount > 0
                  ? Math.min(100, Math.round((item.savedAmount / item.targetAmount) * 100))
                  : 0;

                const isReady = item.savedAmount >= item.targetAmount;

                return (
                  <tr key={item.id} className="hover:bg-pink-50/20 transition-colors group">
                    <td className="py-3 px-4 font-bold text-slate-800 whitespace-nowrap flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                      <span>{item.name}</span>
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-slate-800 tabular-nums whitespace-nowrap">
                      {formatIDR(item.targetAmount)}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span className="text-amber-500 font-bold">{item.priority}</span>
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-emerald-600 tabular-nums whitespace-nowrap">
                      {formatIDR(item.savedAmount)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${
                              isReady ? 'bg-emerald-500' : 'bg-pink-500'
                            }`}
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
                        isReady || item.status === 'Tercapai'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {isReady ? 'Bisa Dibeli ✨' : item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-xs truncate max-w-xs">
                      {item.notes || '-'}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onAllocateSavings(item)}
                          title="Nabung Dana"
                          className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-[11px] font-semibold border border-emerald-200 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <PiggyBank className="w-3 h-3" />
                          <span>Nabung</span>
                        </button>
                        <button
                          onClick={() => onEditWishlistItem(item)}
                          className="p-1 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Impian"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteWishlistItem(item.id)}
                          className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
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
