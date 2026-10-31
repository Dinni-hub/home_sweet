import React, { useState, useEffect } from 'react';
import { InvestmentItem } from '../types/finance';
import { X, Save, Star } from 'lucide-react';

interface InvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<InvestmentItem, 'id'> | InvestmentItem) => void;
  initialData?: InvestmentItem | null;
}

export const InvestmentModal: React.FC<InvestmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [categoryName, setCategoryName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [savedAmount, setSavedAmount] = useState('');
  const [status, setStatus] = useState<'Belum Tercapai' | 'Tercapai' | 'Proses'>('Belum Tercapai');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialData) {
      setCategoryName(initialData.categoryName);
      setTargetAmount(initialData.targetAmount.toString());
      setSavedAmount(initialData.savedAmount.toString());
      setStatus(initialData.status);
      setNotes(initialData.notes || '');
    } else {
      setCategoryName('');
      setTargetAmount('');
      setSavedAmount('0');
      setStatus('Belum Tercapai');
      setNotes('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetNum = parseFloat(targetAmount.replace(/[^0-9]/g, ''));
    const savedNum = parseFloat(savedAmount.replace(/[^0-9]/g, '')) || 0;

    if (!categoryName.trim() || isNaN(targetNum) || targetNum <= 0) {
      alert('Mohon isi nama instrumen dan target dana dengan benar!');
      return;
    }

    if (initialData) {
      onSave({
        ...initialData,
        categoryName: categoryName.trim(),
        targetAmount: targetNum,
        savedAmount: savedNum,
        status,
        notes: notes.trim(),
      });
    } else {
      onSave({
        categoryName: categoryName.trim(),
        targetAmount: targetNum,
        savedAmount: savedNum,
        status,
        notes: notes.trim(),
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4 animate-in fade-in zoom-in duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-100" />
            <span>{initialData ? 'Ubah Portofolio Investasi' : '+ Tambah Instrumen Investasi'}</span>
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
              ⭐ Kategori Investasi
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Emas Antam / Saham Bluechip / Deposito Bank"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                🎯 Target Tabungan (Rp)
              </label>
              <input
                type="number"
                required
                min="1"
                placeholder="0"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="w-full text-xs font-bold p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                💰 Sudah Ditabung (Rp)
              </label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={savedAmount}
                onChange={(e) => setSavedAmount(e.target.value)}
                className="w-full text-xs font-bold p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Status Capaian
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-hidden cursor-pointer bg-white"
            >
              <option value="Belum Tercapai">Belum Tercapai</option>
              <option value="Proses">Dalam Proses</option>
              <option value="Tercapai">Tercapai</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              📝 Catatan / Alokasi
            </label>
            <input
              type="text"
              placeholder="Contoh: Tabungan jangka panjang / Dana Darurat"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
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
              className="px-4 py-2 text-xs font-semibold text-white bg-amber-500 hover:bg-amber-600 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Portofolio</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
