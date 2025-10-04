import { LayoutDashboard, BarChart3, Users, Settings, Award, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import mtnLogo from "@/assets/mtn-logo.png";
import { NavLink } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";

interface DashboardSidebarProps {
  className?: string;
}

export const DashboardSidebar = ({ className }: DashboardSidebarProps) => {
  const navItems = [
    { icon: LayoutDashboard, label: "Overview", path: "/" },
    { icon: BarChart3, label: "Analytics", path: "/analytics" },
    { icon: Users, label: "Sales Reps", path: "/sales-reps" },
    { icon: Award, label: "Performance", path: "/rep-performance" },
    { icon: FileText, label: "Monthly Reports", path: "/monthly-reports" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <aside
      className={cn(
        "w-64 bg-card border-r border-border flex flex-col h-full lg:h-screen lg:sticky lg:top-0",
        className
      )}
    >
      <div className="p-6 border-b border-border">
        <img src={mtnLogo} alt="MTN Logo" className="h-12 w-auto" />
        <h1 className="text-sm font-semibold mt-3 text-foreground">
          FiberX Sales Manager
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                isActive
                  ? "bg-primary text-primary-foreground font-medium shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Theme</span>
          <ThemeToggle />
        </div>
        <p className="text-xs text-muted-foreground text-center">
          © 2025 MTN FiberX
        </p>
      </div>
    </aside>
  );
};
