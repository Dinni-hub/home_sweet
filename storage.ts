import { FinanceData } from '../types/finance';
import { INITIAL_FINANCE_DATA } from '../data/initialData';

const STORAGE_KEY = 'home_sweet_home_finance_v1';

export const loadFinanceData = (): FinanceData => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveFinanceData(INITIAL_FINANCE_DATA);
      return INITIAL_FINANCE_DATA;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      return INITIAL_FINANCE_DATA;
    }
    return {
      version: parsed.version || 1,
      selectedMonth: parsed.selectedMonth || INITIAL_FINANCE_DATA.selectedMonth,
      customMonths: Array.isArray(parsed.customMonths) && parsed.customMonths.length > 0 
        ? parsed.customMonths 
        : INITIAL_FINANCE_DATA.customMonths,
      customTotalBudget: typeof parsed.customTotalBudget === 'number' && !isNaN(parsed.customTotalBudget) 
        ? parsed.customTotalBudget 
        : undefined,
      transactions: Array.isArray(parsed.transactions) ? parsed.transactions : INITIAL_FINANCE_DATA.transactions,
      categoryBudgets: Array.isArray(parsed.categoryBudgets) ? parsed.categoryBudgets : INITIAL_FINANCE_DATA.categoryBudgets,
      wishlist: Array.isArray(parsed.wishlist) ? parsed.wishlist : INITIAL_FINANCE_DATA.wishlist,
      investments: Array.isArray(parsed.investments) ? parsed.investments : INITIAL_FINANCE_DATA.investments,
    };
  } catch (error) {
    console.error('Error loading finance data from localStorage:', error);
    return INITIAL_FINANCE_DATA;
  }
};

export const saveFinanceData = (data: FinanceData): boolean => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving finance data to localStorage:', error);
    return false;
  }
};

export const resetToDefaultData = (): FinanceData => {
  saveFinanceData(INITIAL_FINANCE_DATA);
  return INITIAL_FINANCE_DATA;
};
