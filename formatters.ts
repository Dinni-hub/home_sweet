import { Transaction, CategoryBudget, WishlistItem, InvestmentItem } from '../types/finance';

export const formatIDR = (amount: number): string => {
  if (isNaN(amount)) return 'Rp0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(amount).replace(/\s/g, '');
};

export const formatShortIDR = (amount: number): string => {
  if (isNaN(amount) || amount === 0) return 'Rp0';
  const absAmount = Math.abs(amount);
  
  if (absAmount >= 1000000000000) {
    return `Rp ${(amount / 1000000000000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} T`;
  }
  if (absAmount >= 1000000000) {
    return `Rp ${(amount / 1000000000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} M`;
  }
  if (absAmount >= 1000000) {
    return `Rp ${(amount / 1000000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} Jt`;
  }
  if (absAmount >= 1000) {
    return `Rp ${(amount / 1000).toLocaleString('id-ID', { maximumFractionDigits: 0 })}rb`;
  }
  return formatIDR(amount);
};

export const formatDateIndonesian = (dateString: string): string => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  } catch {
    return dateString;
  }
};

export const downloadFile = (content: string, fileName: string, contentType: string) => {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const generateCSVExport = (
  month: string,
  transactions: Transaction[],
  categoryBudgets: CategoryBudget[],
  spentMap: Record<string, number>,
  wishlist: WishlistItem[],
  investments: InvestmentItem[]
): string => {
  const rows: string[][] = [];

  // Title section
  rows.push(['HOME SWEET HOME - LAPORAN KEUANGAN PRIBADI']);
  rows.push(['Periode:', month]);
  rows.push(['Tanggal Unduh:', new Date().toLocaleString('id-ID')]);
  rows.push([]);

  // 1. DAFTAR PENGELUARAN
  rows.push(['--- DAFTAR PENGELUARAN ---']);
  rows.push(['Tanggal', 'Keterangan', 'Kategori', 'Metode Bayar', 'Nominal (Rp)']);
  
  let totalExpense = 0;
  transactions.forEach((tx) => {
    totalExpense += tx.amount;
    rows.push([
      formatDateIndonesian(tx.date),
      `"${tx.description.replace(/"/g, '""')}"`,
      `"${tx.category}"`,
      tx.paymentMethod,
      tx.amount.toString()
    ]);
  });
  rows.push(['TOTAL PENGELUARAN', '', '', '', totalExpense.toString()]);
  rows.push([]);

  // 2. REKAP BUDGET PER KATEGORI
  rows.push(['--- REKAP BUDGET PER KATEGORI ---']);
  rows.push(['Kategori', 'Target Budget (Rp)', 'Terpakai (Rp)', 'Sisa (Rp)', 'Progress (%)']);
  
  let totalBudget = 0;
  categoryBudgets.forEach((cat) => {
    const spent = spentMap[cat.categoryName] || 0;
    const remaining = cat.budgetAmount - spent;
    const progress = cat.budgetAmount > 0 ? Math.round((spent / cat.budgetAmount) * 100) : 0;
    totalBudget += cat.budgetAmount;
    rows.push([
      `"${cat.categoryName}"`,
      cat.budgetAmount.toString(),
      spent.toString(),
      remaining.toString(),
      `${progress}%`
    ]);
  });
  rows.push(['TOTAL BUDGET', totalBudget.toString(), totalExpense.toString(), (totalBudget - totalExpense).toString(), '']);
  rows.push([]);

  // 3. WISH LIST / IMPIAN
  rows.push(['--- WISH LIST / IMPIAN ---']);
  rows.push(['Nama Impian', 'Target Dana (Rp)', 'Prioritas', 'Sudah Ditabung (Rp)', 'Kekurangan (Rp)', 'Status', 'Catatan']);
  
  wishlist.forEach((w) => {
    const remaining = w.targetAmount - w.savedAmount;
    rows.push([
      `"${w.name}"`,
      w.targetAmount.toString(),
      w.priority,
      w.savedAmount.toString(),
      remaining.toString(),
      w.status,
      `"${(w.notes || '').replace(/"/g, '""')}"`
    ]);
  });
  rows.push([]);

  // 4. INSTRUMEN INVESTASI
  rows.push(['--- INSTRUMEN INVESTASI ---']);
  rows.push(['Kategori Investasi', 'Target Tabungan (Rp)', 'Sudah Ditabung (Rp)', 'Status', 'Catatan']);
  
  investments.forEach((inv) => {
    rows.push([
      `"${inv.categoryName}"`,
      inv.targetAmount.toString(),
      inv.savedAmount.toString(),
      inv.status,
      `"${(inv.notes || '').replace(/"/g, '""')}"`
    ]);
  });

  return rows.map((row) => row.join(',')).join('\n');
};
