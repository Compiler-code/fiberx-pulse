import { useMemo } from "react";
import { useGoogleSheets } from "@/hooks/useGoogleSheets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SalesChart } from "@/components/SalesChart";
import { motion } from "framer-motion";
import { TrendingUp, Users, Package, DollarSign } from "lucide-react";

export default function Analytics() {
  const { data: salesData, loading } = useGoogleSheets();

  const analytics = useMemo(() => {
    const planRevenue = salesData.reduce((acc, record) => {
      const plan = record.plan;
      if (!acc[plan]) {
        acc[plan] = { name: plan, revenue: 0, count: 0 };
      }
      acc[plan].revenue += record.amountPaid;
      acc[plan].count += 1;
      return acc;
    }, {} as Record<string, any>);

    const repPerformance = salesData.reduce((acc, record) => {
      const rep = record.salesRepName;
      if (!acc[rep]) {
        acc[rep] = 0;
      }
      acc[rep] += record.amountPaid;
      return acc;
    }, {} as Record<string, number>);

    const salesByDate = salesData.reduce((acc, record) => {
      const date = new Date(record.timestamp).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      if (!acc[date]) {
        acc[date] = { date, revenue: 0, sales: 0 };
      }
      acc[date].revenue += record.amountPaid;
      acc[date].sales += 1;
      return acc;
    }, {} as Record<string, any>);

    return {
      planRevenue: Object.values(planRevenue).map((p: any) => ({
        name: p.name.split("[")[0].trim(),
        value: p.revenue,
      })),
      repPerformance: Object.entries(repPerformance).map(([name, value]) => ({
        name,
        value,
      })),
      salesTrend: Object.values(salesByDate),
    };
  }, [salesData]);

  const metrics = useMemo(() => {
    const totalRevenue = salesData.reduce((sum, r) => sum + r.amountPaid, 0);
    const uniqueReps = new Set(salesData.map((r) => r.salesRepName)).size;
    const uniquePlans = new Set(salesData.map((r) => r.plan)).size;
    const avgSaleValue = totalRevenue / salesData.length || 0;

    return { totalRevenue, uniqueReps, uniquePlans, avgSaleValue };
  }, [salesData]);

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 lg:pl-4 pt-16 lg:pt-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Analytics & Insights</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Deep dive into sales performance and trends
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <div className="bg-primary/10 rounded-lg p-2">
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₦{(metrics.totalRevenue / 1000000).toFixed(2)}M
            </div>
            <p className="text-xs text-muted-foreground mt-1">Across all sales</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Sales Reps</CardTitle>
            <div className="bg-primary/10 rounded-lg p-2">
              <Users className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.uniqueReps}</div>
            <p className="text-xs text-muted-foreground mt-1">Active team members</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Plan Types</CardTitle>
            <div className="bg-primary/10 rounded-lg p-2">
              <Package className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.uniquePlans}</div>
            <p className="text-xs text-muted-foreground mt-1">Different plans sold</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Avg Sale Value</CardTitle>
            <div className="bg-primary/10 rounded-lg p-2">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₦{Math.round(metrics.avgSaleValue).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Per transaction</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <SalesChart
          type="bar"
          data={analytics.planRevenue}
          title="Revenue by Plan"
          dataKey="value"
          xAxisKey="name"
        />
        <SalesChart
          type="bar"
          data={analytics.repPerformance}
          title="Sales Rep Performance"
          dataKey="value"
          xAxisKey="name"
        />
      </div>

      <SalesChart
        type="line"
        data={analytics.salesTrend}
        title="Revenue Trend Over Time"
        dataKey="revenue"
        xAxisKey="date"
      />
    </div>
  );
}
