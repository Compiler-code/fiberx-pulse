import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown } from "lucide-react";
import { SalesRecord } from "@/types/sales";
import { cn } from "@/lib/utils";

interface SalesTableProps {
  data: SalesRecord[];
}

export const SalesTable = ({ data }: SalesTableProps) => {
  const [sortField, setSortField] = useState<keyof SalesRecord>("dateOfSale");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const sortedData = [...data].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    const modifier = sortDirection === "asc" ? 1 : -1;
    
    if (typeof aVal === "string" && typeof bVal === "string") {
      return aVal.localeCompare(bVal) * modifier;
    }
    return ((aVal as number) - (bVal as number)) * modifier;
  });

  const toggleSort = (field: keyof SalesRecord) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  return (
    <Card className="p-4 sm:p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Sales</h3>
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer hover:bg-accent whitespace-nowrap"
                  onClick={() => toggleSort("dateOfSale")}
                >
                  <div className="flex items-center gap-2">
                    Date
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="whitespace-nowrap">Customer</TableHead>
                <TableHead className="whitespace-nowrap hidden md:table-cell">Sales Rep</TableHead>
                <TableHead className="whitespace-nowrap hidden lg:table-cell">Plan</TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-accent whitespace-nowrap"
                  onClick={() => toggleSort("amountPaid")}
                >
                  <div className="flex items-center gap-2">
                    Amount
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="whitespace-nowrap">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((record, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium whitespace-nowrap">
                    {new Date(record.dateOfSale).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="min-w-[120px]">
                      <p className="font-medium">{record.customerName}</p>
                      <p className="text-sm text-muted-foreground">
                        {record.customerPhone}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{record.salesRepName}</TableCell>
                  <TableCell className="hidden lg:table-cell max-w-[200px] truncate">{record.plan}</TableCell>
                  <TableCell className="font-semibold whitespace-nowrap">
                    ₦{record.amountPaid.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        "whitespace-nowrap",
                        record.paymentStatus === "Paid"
                          ? "bg-success text-success-foreground"
                          : "bg-warning text-warning-foreground"
                      )}
                    >
                      {record.paymentStatus}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
};
