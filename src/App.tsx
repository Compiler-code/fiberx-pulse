import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "./layouts/DashboardLayout";
import Index from "./pages/Index";
import Analytics from "./pages/Analytics";
import SalesReps from "./pages/SalesReps";
import Settings from "./pages/Settings";
import RepPerformance from "./pages/RepPerformance";
import MonthlyReports from "./pages/MonthlyReports";
import IndividualRep from "./pages/IndividualRep";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/sales-reps" element={<SalesReps />} />
            <Route path="/rep-performance" element={<RepPerformance />} />
            <Route path="/monthly-reports" element={<MonthlyReports />} />
            <Route path="/sales-reps/:repName" element={<IndividualRep />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
