import { useMemo } from "react";
import { useGoogleSheets } from "@/hooks/useGoogleSheets";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { DollarSign, TrendingUp, ShoppingCart, Award } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { SalesChart } from "@/components/SalesChart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function RepPerformance() {
  const { data: salesData, loading } = useGoogleSheets();

  const repPerformance = useMemo(() => {
    const repStats = salesData.reduce((acc, record) => {
      const rep = record.salesRepName;
      if (!acc[rep]) {
        acc[rep] = {
          name: rep,
          totalSales: 0,
          totalRevenue: 0,
          completedSales: 0,
          pendingSales: 0,
        };
      }
      acc[rep].totalSales += 1;
      acc[rep].totalRevenue += record.amountPaid;
      if (record.paymentStatus === "Paid") {
        acc[rep].completedSales += 1;
      } else {
        acc[rep].pendingSales += 1;
      }
      return acc;
    }, {} as Record<string, any>);

    return Object.values(repStats).sort(
      (a: any, b: any) => b.totalRevenue - a.totalRevenue
    );
  }, [salesData]);

  const topPerformer = repPerformance[0];
  const chartData = repPerformance.slice(0, 10).map((rep: any) => ({
    name: rep.name,
    value: rep.totalRevenue,
  }));

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 lg:pl-4 pt-16 lg:pt-4">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:pl-4 pt-16 lg:pt-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Sales Rep Performance</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Track individual sales representative performance and achievements
        </p>
      </motion.div>

      {topPerformer && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <MetricCard
            title="Top Performer"
            value={topPerformer.name}
            icon={Award}
            delay={0.1}
          />
          <MetricCard
            title="Total Sales"
            value={topPerformer.totalSales}
            icon={ShoppingCart}
            delay={0.2}
          />
          <MetricCard
            title="Revenue Generated"
            value={`₦${topPerformer.totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            delay={0.3}
          />
          <MetricCard
            title="Completion Rate"
            value={`${Math.round((topPerformer.completedSales / topPerformer.totalSales) * 100)}%`}
            icon={TrendingUp}
            delay={0.4}
          />
        </div>
      )}

      <SalesChart
        type="bar"
        data={chartData}
        title="Top 10 Sales Reps by Revenue"
        dataKey="value"
        xAxisKey="name"
      />

      <Card>
        <CardHeader>
          <CardTitle>All Sales Representatives</CardTitle>
          <CardDescription>Complete performance breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right">Total Sales</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Completed</TableHead>
                  <TableHead className="text-right">Pending</TableHead>
                  <TableHead className="text-right">Completion Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {repPerformance.map((rep: any, index: number) => (
                  <TableRow key={rep.name}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{rep.name}</TableCell>
                    <TableCell className="text-right">{rep.totalSales}</TableCell>
                    <TableCell className="text-right">
                      ₦{rep.totalRevenue.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">{rep.completedSales}</TableCell>
                    <TableCell className="text-right">{rep.pendingSales}</TableCell>
                    <TableCell className="text-right">
                      {Math.round((rep.completedSales / rep.totalSales) * 100)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
