import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleSheets } from "@/hooks/useGoogleSheets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { DollarSign, TrendingUp, Package, Award } from "lucide-react";

export default function SalesReps() {
  const navigate = useNavigate();
  const { data: salesData, loading } = useGoogleSheets();

  const repStats = useMemo(() => {
    const stats = salesData.reduce((acc, record) => {
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

    return Object.values(stats).sort(
      (a: any, b: any) => b.totalRevenue - a.totalRevenue
    );
  }, [salesData]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">Loading sales representatives...</p>
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
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Sales Representatives</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Performance overview of all FiberX sales team members
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {repStats.map((rep: any, index: number) => (
          <motion.div
            key={rep.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <Card
              className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-primary/30 hover:border-l-primary h-full cursor-pointer"
              onClick={() => navigate(`/sales-reps/${encodeURIComponent(rep.name)}`)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <Avatar className="h-12 w-12 sm:h-14 sm:w-14 ring-2 ring-primary/20">
                    <AvatarFallback className="bg-primary text-primary-foreground text-base sm:text-lg font-semibold">
                      {getInitials(rep.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base sm:text-lg truncate">{rep.name}</CardTitle>
                    <p className="text-xs sm:text-sm text-muted-foreground">Sales Representative</p>
                  </div>
                  {index === 0 && (
                    <Award className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-1 bg-accent/30 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs sm:text-sm">
                      <Package className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>Total Sales</span>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold">{rep.totalSales}</p>
                  </div>
                  <div className="space-y-1 bg-accent/30 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs sm:text-sm">
                      <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>Revenue</span>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold">
                      ₦{(rep.totalRevenue / 1000).toFixed(0)}k
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge variant="default" className="flex-1 justify-center text-xs py-1.5">
                    {rep.completedSales} Completed
                  </Badge>
                  <Badge variant="secondary" className="flex-1 justify-center text-xs py-1.5">
                    {rep.pendingSales} Pending
                  </Badge>
                </div>
                <div className="pt-3 border-t">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-success font-medium">
                    <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>
                      ₦{Math.round(rep.totalRevenue / rep.totalSales).toLocaleString()} avg per sale
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
