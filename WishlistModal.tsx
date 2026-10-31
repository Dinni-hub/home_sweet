import React, { useState, useEffect } from 'react';
import { WishlistItem, PriorityLevel } from '../types/finance';
import { X, Save, Heart, PiggyBank } from 'lucide-react';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<WishlistItem, 'id'> | WishlistItem) => void;
  initialData?: WishlistItem | null;
  mode?: 'edit' | 'allocate';
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  mode = 'edit',
}) => {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('⭐⭐');
  const [savedAmount, setSavedAmount] = useState('');
  const [allocateAmount, setAllocateAmount] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setTargetAmount(initialData.targetAmount.toString());
      setPriority(initialData.priority);
      setSavedAmount(initialData.savedAmount.toString());
      setNotes(initialData.notes || '');
      setAllocateAmount('');
    } else {
      setName('');
      setTargetAmount('');
      setPriority('⭐⭐');
      setSavedAmount('0');
      setNotes('');
      setAllocateAmount('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'allocate' && initialData) {
      const addNum = parseFloat(allocateAmount.replace(/[^0-9]/g, ''));
      if (isNaN(addNum) || addNum <= 0) {
        alert('Mohon masukkan nominal tabungan tambahan!');
        return;
      }
      const newSaved = initialData.savedAmount + addNum;
      const isReady = newSaved >= initialData.targetAmount;

      onSave({
        ...initialData,
        savedAmount: newSaved,
        status: isReady ? 'Bisa Dibeli' : initialData.status,
      });
      onClose();
      return;
    }

    const targetNum = parseFloat(targetAmount.replace(/[^0-9]/g, ''));
    const savedNum = parseFloat(savedAmount.replace(/[^0-9]/g, '')) || 0;

    if (!name.trim() || isNaN(targetNum) || targetNum <= 0) {
      alert('Mohon isi nama impian dan target dana dengan benar!');
      return;
    }

    const status = savedNum >= targetNum ? 'Bisa Dibeli' : 'Belum Bisa Dibeli';

    if (initialData) {
      onSave({
        ...initialData,
        name: name.trim(),
        targetAmount: targetNum,
        priority,
        savedAmount: savedNum,
        status,
        notes: notes.trim(),
      });
    } else {
      onSave({
        name: name.trim(),
        targetAmount: targetNum,
        priority,
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
            {mode === 'allocate' ? (
              <>
                <PiggyBank className="w-5 h-5 text-emerald-600" />
                <span>Nabung untuk: {initialData?.name}</span>
              </>
            ) : (
              <>
                <Heart className="w-5 h-5 text-pink-500" />
                <span>{initialData ? 'Ubah Target Wish List' : '+ Tambah Wish List Impian'}</span>
              </>
            )}
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
          {mode === 'allocate' ? (
            <div className="space-y-3">
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs text-emerald-800 space-y-1">
                <p><strong>Target Dana:</strong> Rp {initialData?.targetAmount.toLocaleString('id-ID')}</p>
                <p><strong>Sudah Ditabung:</strong> Rp {initialData?.savedAmount.toLocaleString('id-ID')}</p>
                <p><strong>Kekurangan:</strong> Rp {Math.max(0, (initialData?.targetAmount || 0) - (initialData?.savedAmount || 0)).toLocaleString('id-ID')}</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  💰 Setor Nominal Tabungan Tambahan (Rp)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="Contoh: 500000"
                  value={allocateAmount}
                  onChange={(e) => setAllocateAmount(e.target.value)}
                  className="w-full text-sm font-bold p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-hidden"
                  autoFocus
                />
              </div>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  💗 Nama Impian / Barang
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Galaxy Tab / Mobil / Liburan Bali"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    🎯 Target Dana (Rp)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="0"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    className="w-full text-xs font-bold p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ⭐ Prioritas
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:outline-hidden cursor-pointer bg-white"
                  >
                    <option value="⭐">⭐ (Rendah)</option>
                    <option value="⭐⭐">⭐⭐ (Sedang)</option>
                    <option value="⭐⭐⭐">⭐⭐⭐ (Tinggi / Utama)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  🌱 Dana Sudah Ditabung (Rp)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={savedAmount}
                  onChange={(e) => setSavedAmount(e.target.value)}
                  className="w-full text-xs font-bold p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  📝 Catatan Tambahan
                </label>
                <input
                  type="text"
                  placeholder="Catatan motivasi / spesifikasi..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:outline-hidden"
                />
              </div>
            </>
          )}

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
              className="px-4 py-2 text-xs font-semibold text-white bg-pink-500 hover:bg-pink-600 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Impian</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
