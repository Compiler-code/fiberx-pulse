import { useState, useMemo, useEffect } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { MetricCard } from "@/components/MetricCard";
import { SalesChart } from "@/components/SalesChart";
import { SalesTable } from "@/components/SalesTable";
import { DollarSign, TrendingUp, Clock, CircleCheck as CheckCircle, ChartBar as BarChart3 } from "lucide-react";
import { useGoogleSheets } from "@/hooks/useGoogleSheets";
import { DashboardMetrics } from "@/types/sales";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { exportToExcel, exportToPDF } from "@/utils/exportUtils";

const Index = () => {
  const [selectedPlans, setSelectedPlans] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const { data: salesData, loading, error, refetch } = useGoogleSheets();

  useEffect(() => {
    if (error) {
      toast({
        title: "Error Loading Data",
        description: error,
        variant: "destructive",
      });
    }
  }, [error]);

  const metrics = useMemo((): DashboardMetrics => {
    if (salesData.length === 0) {
      return {
        totalSales: 0,
        totalRevenue: 0,
        pendingPayments: 0,
        completedPayments: 0,
        averagePaymentPerSale: 0,
      };
    }

    const totalSales = salesData.length;
    const totalRevenue = salesData.reduce((sum, record) => sum + record.amountPaid, 0);
    const completedPayments = salesData.filter(r => r.paymentStatus === "Paid").length;
    const pendingPayments = salesData
      .filter(r => r.paymentStatus === "Pending")
      .reduce((sum, record) => sum + record.amountPaid, 0);
    const averagePaymentPerSale = totalRevenue / totalSales;

    return {
      totalSales,
      totalRevenue,
      pendingPayments,
      completedPayments,
      averagePaymentPerSale,
    };
  }, [salesData]);

  const filteredData = useMemo(() => {
    return salesData.filter((record) => {
      const planMatch = selectedPlans.length === 0 || selectedPlans.includes(record.plan);
      const statusMatch = selectedStatuses.length === 0 || selectedStatuses.includes(record.paymentStatus);
      return planMatch && statusMatch;
    });
  }, [salesData, selectedPlans, selectedStatuses]);

  const availablePlans = useMemo(() => {
    return Array.from(new Set(salesData.map((r) => r.plan)));
  }, [salesData]);

  const planDistribution = useMemo(() => {
    const plans = salesData.reduce((acc, record) => {
      acc[record.plan] = (acc[record.plan] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(plans).map(([name, value]) => ({ name, value }));
  }, [salesData]);

  const paymentStatusData = useMemo(() => {
    const paid = salesData.filter(r => r.paymentStatus === "Paid").length;
    const pending = salesData.filter(r => r.paymentStatus === "Pending").length;
    return [
      { name: "Paid", value: paid },
      { name: "Pending", value: pending },
    ];
  }, [salesData]);

  const salesTrend = useMemo(() => {
    const salesByDate = salesData.reduce((acc, record) => {
      const date = new Date(record.timestamp).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(salesByDate).map(([name, value]) => ({ name, value }));
  }, [salesData]);

  const handleExportExcel = () => {
    try {
      exportToExcel(filteredData, "fiberx-sales");
      toast({
        title: "Export Successful",
        description: "Your Excel file has been downloaded.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting the data.",
        variant: "destructive",
      });
    }
  };

  const handleExportPDF = () => {
    try {
      exportToPDF(filteredData, "fiberx-sales-report");
      toast({
        title: "Export Successful",
        description: "Your PDF report has been downloaded.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error generating the report.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <DashboardHeader
        onExportExcel={handleExportExcel}
        onExportPDF={handleExportPDF}
        selectedPlans={selectedPlans}
        selectedStatuses={selectedStatuses}
        onPlanChange={setSelectedPlans}
        onStatusChange={setSelectedStatuses}
        availablePlans={availablePlans}
      />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 lg:pl-4 pt-16 lg:pt-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">Sales Overview</h1>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Track and analyze FiberX sales performance in real-time
                </p>
              </div>
              {loading && (
                <Card className="px-4 py-2">
                  <p className="text-sm text-muted-foreground">Syncing data...</p>
                </Card>
              )}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
            <MetricCard
              title="Total Sales"
              value={metrics.totalSales}
              icon={BarChart3}
              delay={0.1}
            />
            <MetricCard
              title="Total Revenue"
              value={`₦${metrics.totalRevenue.toLocaleString()}`}
              icon={DollarSign}
              delay={0.2}
            />
            <MetricCard
              title="Pending Payments"
              value={`₦${metrics.pendingPayments.toLocaleString()}`}
              icon={Clock}
              delay={0.3}
            />
            <MetricCard
              title="Completed"
              value={metrics.completedPayments}
              icon={CheckCircle}
              delay={0.4}
            />
            <MetricCard
              title="Avg Per Sale"
              value={`₦${Math.round(metrics.averagePaymentPerSale).toLocaleString()}`}
              icon={TrendingUp}
              delay={0.5}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <SalesChart
              type="bar"
              data={planDistribution}
              title="Sales by Plan"
              dataKey="value"
              xAxisKey="name"
            />
            <SalesChart
              type="pie"
              data={paymentStatusData}
              title="Payment Status Distribution"
              dataKey="value"
            />
          </div>

          <SalesChart
            type="line"
            data={salesTrend}
            title="Sales Trend Over Time"
            dataKey="value"
            xAxisKey="name"
          />

          <SalesTable data={filteredData} />

        <footer className="text-center py-6 text-xs sm:text-sm text-muted-foreground border-t border-border mt-8">
          FiberX Sales Manager Dashboard © 2025 – Internal Use Only
        </footer>
      </main>
    </>
  );
};

export default Index;
