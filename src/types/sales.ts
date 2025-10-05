export interface SalesRecord {
  timestamp: string;
  salesRepName: string;
  customerName: string;
  dateOfSale: string;
  address: string;
  customerPhone: string;
  plan: string;
  amountPaid: number;
  paymentStatus: "Paid" | "Pending";
  finalNotes: string;
  customerEmail: string;
  customerNIN: string;
}

export interface DashboardMetrics {
  totalSales: number;
  totalRevenue: number;
  pendingPayments: number;
  completedPayments: number;
  averagePaymentPerSale: number;
}
