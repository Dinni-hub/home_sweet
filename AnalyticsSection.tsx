import React, { useMemo } from 'react';
import { Transaction, PaymentMethod } from '../types/finance';
import { formatIDR } from '../utils/formatters';
import { PieChart, Wallet, CreditCard, BarChart2 } from 'lucide-react';

interface AnalyticsSectionProps {
  transactions: Transaction[];
}

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ transactions }) => {
  const totalExpense = useMemo(() => {
    return transactions.reduce((sum, tx) => sum + tx.amount, 0);
  }, [transactions]);

  // Group by category
  const categoryBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    transactions.forEach((tx) => {
      map[tx.category] = (map[tx.category] || 0) + tx.amount;
    });

    return Object.entries(map)
      .map(([name, amount]) => ({
        name,
        amount,
        percentage: totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions, totalExpense]);

  // Group by payment method
  const paymentBreakdown = useMemo(() => {
    const map: Record<PaymentMethod, number> = {
      'QRIS': 0,
      'Cash': 0,
      'Credit Card': 0,
      'E-Wallet': 0,
      'Transfer': 0
    };

    transactions.forEach((tx) => {
      if (map[tx.paymentMethod] !== undefined) {
        map[tx.paymentMethod] += tx.amount;
      }
    });

    return Object.entries(map).map(([method, amount]) => ({
      method: method as PaymentMethod,
      amount,
      percentage: totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0
    }));
  }, [transactions, totalExpense]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      
      {/* Top Spending Categories */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-rose-500" />
            <span>ANALISIS PENGELUARAN PER KATEGORI</span>
          </h4>
          <span className="text-xs font-semibold text-slate-500">
            {categoryBreakdown.length} Kategori
          </span>
        </div>

        <div className="space-y-3">
          {categoryBreakdown.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">Belum ada data pengeluaran</p>
          ) : (
            categoryBreakdown.slice(0, 6).map((item) => (
              <div key={item.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 tabular-nums">{formatIDR(item.amount)}</span>
                    <span className="text-slate-400 font-semibold text-[11px] w-8 text-right tabular-nums">
                      {item.percentage}%
                    </span>
                  </div>
                </div>
                <div className="bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-rose-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Payment Method Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-blue-500" />
            <span>METODE PEMBAYARAN TERPAKAI</span>
          </h4>
          <span className="text-xs font-semibold text-slate-500">
            5 Channel
          </span>
        </div>

        <div className="space-y-3">
          {paymentBreakdown.map((item) => (
            <div key={item.method} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">{item.method}</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 tabular-nums">{formatIDR(item.amount)}</span>
                  <span className="text-slate-400 font-semibold text-[11px] w-8 text-right tabular-nums">
                    {item.percentage}%
                  </span>
                </div>
              </div>
              <div className="bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
