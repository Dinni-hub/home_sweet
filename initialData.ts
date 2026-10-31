import { FinanceData } from '../types/finance';

export const INITIAL_FINANCE_DATA: FinanceData = {
  version: 1,
  selectedMonth: 'Oktober 2026 - November 2026',
  customMonths: [
    'Oktober 2026 - November 2026',
    'September 2026',
    'Agustus 2026',
    'Juli 2026'
  ],
  categoryBudgets: [
    { id: 'cat-m1', categoryName: '📅 Minggu 1', pillarGroup: '1. Kebutuhan Mingguan', budgetAmount: 1250000 },
    { id: 'cat-m2', categoryName: '📅 Minggu 2', pillarGroup: '1. Kebutuhan Mingguan', budgetAmount: 300000 },
    { id: 'cat-m3', categoryName: '📅 Minggu 3', pillarGroup: '1. Kebutuhan Mingguan', budgetAmount: 300000 },
    { id: 'cat-m4', categoryName: '📅 Minggu 4', pillarGroup: '1. Kebutuhan Mingguan', budgetAmount: 300000 },
    { id: 'cat-m5', categoryName: '📅 Minggu 5', pillarGroup: '1. Kebutuhan Mingguan', budgetAmount: 300000 },
    { id: 'cat-laundry', categoryName: '🧺 Laundry', pillarGroup: '2. Pengeluaran Rutin', budgetAmount: 200000 },
    { id: 'cat-trans', categoryName: '🚗 Transportasi', pillarGroup: '2. Pengeluaran Rutin', budgetAmount: 250000 },
    { id: 'cat-bulanan', categoryName: '🛒 Bulanan', pillarGroup: '2. Pengeluaran Rutin', budgetAmount: 1500000 },
    { id: 'cat-kesehatan', categoryName: '🩺 Kesehatan', pillarGroup: '4. Kesehatan & Edukasi', budgetAmount: 1300000 },
    { id: 'cat-belanja', categoryName: '🛍️ Belanja', pillarGroup: '3. Gaya Hidup', budgetAmount: 500000 },
    { id: 'cat-hiburan', categoryName: '🍿 Hiburan', pillarGroup: '3. Gaya Hidup', budgetAmount: 250000 },
    { id: 'cat-tabungan', categoryName: '🌱 Tabungan', pillarGroup: '5. Tabungan & Masa Depan', budgetAmount: 300000 },
    { id: 'cat-darurat', categoryName: '🛡️ Dana darurat', pillarGroup: '5. Tabungan & Masa Depan', budgetAmount: 125000 },
    { id: 'cat-pendidikan', categoryName: '📚 Pendidikan', pillarGroup: '4. Kesehatan & Edukasi', budgetAmount: 75000 },
    { id: 'cat-lainnya', categoryName: '✨ Lainnya', pillarGroup: '3. Gaya Hidup', budgetAmount: 600000 },
    { id: 'cat-air', categoryName: '💧 Air Minum', pillarGroup: '2. Pengeluaran Rutin', budgetAmount: 150000 },
    { id: 'cat-gas', categoryName: '🔥 Gas LPG', pillarGroup: '2. Pengeluaran Rutin', budgetAmount: 100000 },
  ],
  transactions: [
    {
      id: 'tx-1',
      date: '2026-09-24',
      description: 'sayuran',
      category: '📅 Minggu 1',
      paymentMethod: 'QRIS',
      amount: 125000
    },
    {
      id: 'tx-2',
      date: '2026-09-24',
      description: 'superindo',
      category: '📅 Minggu 1',
      paymentMethod: 'QRIS',
      amount: 551890
    },
    {
      id: 'tx-3',
      date: '2026-09-24',
      description: 'kursi pendek',
      category: '✨ Lainnya',
      paymentMethod: 'Credit Card',
      amount: 61000
    },
    {
      id: 'tx-4',
      date: '2026-09-24',
      description: 'galon',
      category: '📅 Minggu 1',
      paymentMethod: 'Transfer',
      amount: 49000
    },
    {
      id: 'tx-5',
      date: '2026-09-24',
      description: 'plastik es batu',
      category: '📅 Minggu 1',
      paymentMethod: 'Cash',
      amount: 23000
    },
    {
      id: 'tx-6',
      date: '2026-09-25',
      description: 'spl',
      category: '🛒 Bulanan',
      paymentMethod: 'E-Wallet',
      amount: 1922000
    }
  ],
  wishlist: [
    {
      id: 'wish-1',
      name: 'Galaxy Tab',
      targetAmount: 15000000,
      priority: '⭐⭐⭐',
      savedAmount: 0,
      status: 'Belum Bisa Dibeli',
      notes: 'Untuk produktivitas dan belajar'
    },
    {
      id: 'wish-2',
      name: 'Samsung Z Fold 8',
      targetAmount: 28500000,
      priority: '⭐',
      savedAmount: 0,
      status: 'Belum Bisa Dibeli',
      notes: 'Smartphone impian'
    },
    {
      id: 'wish-3',
      name: 'Mobil',
      targetAmount: 350000000,
      priority: '⭐⭐⭐',
      savedAmount: 0,
      status: 'Belum Bisa Dibeli',
      notes: 'Kendaraan keluarga'
    },
    {
      id: 'wish-4',
      name: 'Financial Freedom',
      targetAmount: 1000000000000,
      priority: '⭐⭐⭐',
      savedAmount: 0,
      status: 'Belum Bisa Dibeli',
      notes: 'Bebas finansial jangka panjang'
    },
    {
      id: 'wish-5',
      name: 'Liburan keliling Indonesia',
      targetAmount: 50000000,
      priority: '⭐⭐',
      savedAmount: 0,
      status: 'Belum Bisa Dibeli',
      notes: 'Jelajah nusantara'
    },
    {
      id: 'wish-6',
      name: 'Liburan Keliling Dunia',
      targetAmount: 500000000,
      priority: '⭐⭐',
      savedAmount: 0,
      status: 'Belum Bisa Dibeli',
      notes: 'Eksplorasi mancanegara'
    },
    {
      id: 'wish-7',
      name: 'Rumah',
      targetAmount: 1200000000,
      priority: '⭐⭐',
      savedAmount: 0,
      status: 'Belum Bisa Dibeli',
      notes: 'Hunian nyaman keluarga'
    },
    {
      id: 'wish-8',
      name: 'Tabungan Utama',
      targetAmount: 100000000,
      priority: '⭐⭐⭐',
      savedAmount: 0,
      status: 'Belum Bisa Dibeli',
      notes: 'Dana simpanan aman'
    }
  ],
  investments: [
    {
      id: 'inv-1',
      categoryName: 'Emas',
      targetAmount: 100000000000,
      savedAmount: 0,
      status: 'Belum Tercapai',
      notes: 'Emas Antam / Digital'
    },
    {
      id: 'inv-2',
      categoryName: 'Reksadana Pasar Uang',
      targetAmount: 100000000000,
      savedAmount: 0,
      status: 'Belum Tercapai',
      notes: 'Likuid & risiko rendah'
    },
    {
      id: 'inv-3',
      categoryName: 'Reksadana Pendapatan Tetap',
      targetAmount: 100000000000,
      savedAmount: 0,
      status: 'Belum Tercapai',
      notes: 'Return stabil menengah'
    },
    {
      id: 'inv-4',
      categoryName: 'Saham',
      targetAmount: 100000000000,
      savedAmount: 0,
      status: 'Belum Tercapai',
      notes: 'Saham Bluechip / Dividen'
    },
    {
      id: 'inv-5',
      categoryName: 'ATM / Deposito',
      targetAmount: 600000000000,
      savedAmount: 0,
      status: 'Belum Tercapai',
      notes: 'Kas simpanan siap pakai'
    }
  ]
};
