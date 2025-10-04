import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
  delay?: number;
}

export const MetricCard = ({
  title,
  value,
  icon: Icon,
  trend,
  className,
  delay = 0,
}: MetricCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="h-full"
    >
      <Card className={cn(
        "p-4 sm:p-6 h-full flex flex-col hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary/50 hover:border-l-primary",
        className
      )}>
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="bg-primary/10 rounded-xl p-2.5 sm:p-3">
            <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium text-right flex-1">{title}</p>
        </div>
        <div className="mt-auto">
          <p className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">{value}</p>
          {trend && (
            <p
              className={cn(
                "text-xs sm:text-sm font-medium",
                trend.isPositive ? "text-success" : "text-destructive"
              )}
            >
              {trend.value}
            </p>
          )}
        </div>
      </Card>
    </motion.div>
  );
};
