export type PaymentMethod = 'QRIS' | 'Cash' | 'Credit Card' | 'E-Wallet' | 'Transfer';

export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  description: string; // Keterangan
  category: string; // Kategori
  paymentMethod: PaymentMethod;
  amount: number;
}

export interface CategoryBudget {
  id: string;
  categoryName: string;
  pillarGroup?: string; // 1 to 5 pillar group
  budgetAmount: number;
}

export type PriorityLevel = '⭐' | '⭐⭐' | '⭐⭐⭐';

export interface WishlistItem {
  id: string;
  name: string;
  targetAmount: number;
  priority: PriorityLevel;
  savedAmount: number;
  targetDate?: string;
  status: 'Belum Bisa Dibeli' | 'Bisa Dibeli' | 'Tercapai';
  notes?: string;
}

export interface InvestmentItem {
  id: string;
  categoryName: string; // e.g. Emas, Reksadana, Saham, ATM
  targetAmount: number;
  savedAmount: number;
  status: 'Belum Tercapai' | 'Tercapai' | 'Proses';
  notes?: string;
}

export interface FinanceData {
  version: number;
  selectedMonth: string; // e.g. "2026-10" or "Oktober 2026 - November 2026"
  customMonths: string[];
  customTotalBudget?: number;
  transactions: Transaction[];
  categoryBudgets: CategoryBudget[];
  wishlist: WishlistItem[];
  investments: InvestmentItem[];
}
