import { useState } from "react";
import { useGoogleSheets } from "@/hooks/useGoogleSheets";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { FileText, Download, Calendar } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { generateMonthlyReport } from "@/utils/reportUtils";

export default function MonthlyReports() {
  const { data: salesData, loading } = useGoogleSheets();
  const [generating, setGenerating] = useState(false);

  const handleGenerateReport = async () => {
    setGenerating(true);
    try {
      await generateMonthlyReport(salesData);
      toast({
        title: "Report Generated",
        description: "Monthly sales report has been downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "There was an error generating the report.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const currentMonth = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:pl-4 pt-16 lg:pt-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Monthly Reports</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Generate comprehensive monthly sales reports in DOCX format
        </p>
      </motion.div>

      <div className="grid gap-4 sm:gap-6 max-w-3xl">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 rounded-lg p-3">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base sm:text-lg">Current Month Report</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    {currentMonth}
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Generate a detailed sales report for {currentMonth} including all transactions,
              sales representatives performance, and revenue analytics.
            </p>
            <Button
              onClick={handleGenerateReport}
              disabled={loading || generating}
              className="gap-2 w-full sm:w-auto"
            >
              <Download className="h-4 w-4" />
              {generating ? "Generating..." : "Generate Report"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 rounded-lg p-2">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base sm:text-lg">Report Features</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  What's included in the monthly report
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Complete sales summary with total revenue and transaction count</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Sales representative performance breakdown</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Plan distribution and payment status analysis</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Detailed transaction table with all sales records</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Professional DOCX format ready for sharing</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-muted">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Automatic Generation</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Reports are automatically generated at the end of each month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              The system will automatically generate and save monthly reports on the last day
              of each month at 11:59 PM. You can also manually generate reports at any time
              using the button above.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
