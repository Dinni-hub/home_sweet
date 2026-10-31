import React, { useState, useEffect } from 'react';
import { CategoryBudget } from '../types/finance';
import { X, Save, Target } from 'lucide-react';

interface CategoryBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cat: Omit<CategoryBudget, 'id'> | CategoryBudget) => void;
  initialData?: CategoryBudget | null;
}

export const CategoryBudgetModal: React.FC<CategoryBudgetModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [categoryName, setCategoryName] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('');

  useEffect(() => {
    if (initialData) {
      setCategoryName(initialData.categoryName);
      setBudgetAmount(initialData.budgetAmount.toString());
    } else {
      setCategoryName('');
      setBudgetAmount('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const budgetNum = parseFloat(budgetAmount.replace(/[^0-9]/g, ''));

    if (!categoryName.trim() || isNaN(budgetNum) || budgetNum < 0) {
      alert('Mohon isi nama kategori dan target budget dengan benar!');
      return;
    }

    if (initialData) {
      onSave({
        ...initialData,
        categoryName: categoryName.trim(),
        budgetAmount: budgetNum,
      });
    } else {
      onSave({
        categoryName: categoryName.trim(),
        budgetAmount: budgetNum,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200 space-y-4 animate-in fade-in zoom-in duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Target className="w-5 h-5 text-rose-500" />
            <span>{initialData ? 'Ubah Target Budget' : '+ Kategori Budget Baru'}</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              🏷️ Nama Kategori
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: 🛒 Bulanan / 🚗 Transportasi"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              🎯 Batas Target Budget (Rp)
            </label>
            <input
              type="number"
              required
              min="0"
              placeholder="0"
              value={budgetAmount}
              onChange={(e) => setBudgetAmount(e.target.value)}
              className="w-full text-sm font-bold p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:outline-hidden"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-rose-500 hover:bg-rose-600 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Budget</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
