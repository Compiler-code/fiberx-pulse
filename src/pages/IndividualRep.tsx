import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGoogleSheets } from "@/hooks/useGoogleSheets";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { DollarSign, TrendingUp, ShoppingCart, ArrowLeft, Download, FileSpreadsheet } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { SalesChart } from "@/components/SalesChart";
import { SalesTable } from "@/components/SalesTable";
import { toast } from "@/hooks/use-toast";
import { exportToExcel, exportToPDF } from "@/utils/exportUtils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TimeRangeSelector, TimeRange } from "@/components/TimeRangeSelector";
import { subDays, startOfDay, startOfWeek, startOfMonth, startOfYear } from "date-fns";

export default function IndividualRep() {
  const { repName } = useParams<{ repName: string }>();
  const navigate = useNavigate();
  const { data: salesData, loading } = useGoogleSheets();
  const [timeRange, setTimeRange] = useState<TimeRange>("lifetime");
  const [customDateRange, setCustomDateRange] = useState<{ from: Date; to: Date } | undefined>();

  const repData = useMemo(() => {
    const decodedName = decodeURIComponent(repName || "");
    let repSales = salesData.filter((record) => record.salesRepName === decodedName);

    const now = new Date();
    let filterDate: Date | undefined;

    if (timeRange === "today") {
      filterDate = startOfDay(now);
    } else if (timeRange === "week") {
      filterDate = startOfWeek(now);
    } else if (timeRange === "month") {
      filterDate = startOfMonth(now);
    } else if (timeRange === "year") {
      filterDate = startOfYear(now);
    } else if (timeRange === "custom" && customDateRange) {
      repSales = repSales.filter((r) => {
        const recordDate = new Date(r.timestamp);
        return recordDate >= customDateRange.from && recordDate <= customDateRange.to;
      });
    }

    if (filterDate && timeRange !== "lifetime" && timeRange !== "custom") {
      repSales = repSales.filter((r) => new Date(r.timestamp) >= filterDate);
    }

    const totalSales = repSales.length;
    const totalRevenue = repSales.reduce((sum, r) => sum + r.amountPaid, 0);
    const completedSales = repSales.filter((r) => r.paymentStatus === "Paid").length;
    const pendingSales = repSales.filter((r) => r.paymentStatus === "Pending").length;
    const avgSaleValue = totalRevenue / totalSales || 0;

    const planDistribution = repSales.reduce(
      (acc, record) => {
        const plan = record.plan.split("[")[0].trim();
        if (!acc[plan]) {
          acc[plan] = { name: plan, value: 0 };
        }
        acc[plan].value += 1;
        return acc;
      },
      {} as Record<string, any>
    );

    const salesByDate = repSales.reduce(
      (acc, record) => {
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
      },
      {} as Record<string, any>
    );

    return {
      name: decodedName,
      sales: repSales,
      totalSales,
      totalRevenue,
      completedSales,
      pendingSales,
      avgSaleValue,
      planDistribution: Object.values(planDistribution),
      revenueTrend: Object.values(salesByDate),
    };
  }, [salesData, repName, timeRange, customDateRange]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleExportExcel = () => {
    try {
      exportToExcel(repData.sales, `${repData.name}-sales`);
      toast({
        title: "Export Successful",
        description: "Sales data has been exported to Excel.",
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
      exportToPDF(repData.sales, `${repData.name}-sales-report`);
      toast({
        title: "Export Successful",
        description: "Sales report has been exported to PDF.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error generating the report.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 lg:pl-4 pt-16 lg:pt-4">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!repData.sales.length) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 lg:pl-4 pt-16 lg:pt-4">
        <Button variant="outline" onClick={() => navigate("/sales-reps")} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Sales Reps
        </Button>
        <p className="text-muted-foreground">No data found for this sales representative.</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:pl-4 pt-16 lg:pt-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate("/sales-reps")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex-1"
        >
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 ring-2 ring-primary/20">
              <AvatarFallback className="bg-primary text-primary-foreground text-xl font-semibold">
                {getInitials(repData.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">{repData.name}</h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Sales Representative Performance
              </p>
            </div>
          </div>
        </motion.div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExportExcel}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Excel
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportPDF}>
            <Download className="h-4 w-4 mr-2" />
            PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <MetricCard
          title="Total Sales"
          value={repData.totalSales}
          icon={ShoppingCart}
          delay={0.1}
        />
        <MetricCard
          title="Total Revenue"
          value={`₦${repData.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          delay={0.2}
        />
        <MetricCard
          title="Avg Sale Value"
          value={`₦${Math.round(repData.avgSaleValue).toLocaleString()}`}
          icon={TrendingUp}
          delay={0.3}
        />
        <MetricCard
          title="Completion Rate"
          value={`${Math.round((repData.completedSales / repData.totalSales) * 100)}%`}
          icon={TrendingUp}
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <SalesChart
          type="bar"
          data={repData.planDistribution}
          title="Sales by Plan"
          dataKey="value"
          xAxisKey="name"
        />
        <Card>
          <CardHeader>
            <CardTitle>Revenue Over Time</CardTitle>
            <CardDescription>Sales revenue trend</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <TimeRangeSelector
              value={timeRange}
              onChange={setTimeRange}
              customDateRange={customDateRange}
              onCustomDateChange={(from, to) => setCustomDateRange({ from, to })}
            />
            <SalesChart
              type="line"
              data={repData.revenueTrend}
              dataKey="revenue"
              xAxisKey="date"
              showLegend={false}
            />
          </CardContent>
        </Card>
      </div>

      <SalesTable data={repData.sales} />
    </div>
  );
}
