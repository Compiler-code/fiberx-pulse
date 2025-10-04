import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Save, RefreshCw, Database, Bell, Shield } from "lucide-react";

export default function Settings() {
  const [autoRefresh, setAutoRefresh] = useState(() => {
    const saved = localStorage.getItem("autoRefresh");
    return saved ? JSON.parse(saved) : true;
  });
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("notifications");
    return saved ? JSON.parse(saved) : true;
  });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSave = () => {
    localStorage.setItem("autoRefresh", JSON.stringify(autoRefresh));
    localStorage.setItem("notifications", JSON.stringify(notifications));
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const handlePasswordChange = () => {
    if (!currentPassword || !newPassword) {
      toast({
        title: "Validation Error",
        description: "Please fill in both password fields.",
        variant: "destructive",
      });
      return;
    }
    if (newPassword.length < 6) {
      toast({
        title: "Validation Error",
        description: "New password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }
    localStorage.setItem("dashboardPassword", newPassword);
    setCurrentPassword("");
    setNewPassword("");
    toast({
      title: "Password Changed",
      description: "Your password has been updated successfully.",
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:pl-4 pt-16 lg:pt-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Settings</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Manage your dashboard preferences and configuration
        </p>
      </motion.div>

      <div className="grid gap-4 sm:gap-6 max-w-2xl">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 rounded-lg p-2">
                <Database className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base sm:text-lg">Data Source</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Google Sheets connection for live sales data
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sheet-id" className="text-sm">Google Sheet ID</Label>
              <Input
                id="sheet-id"
                value="1U3x7dtoQl9dyFzXFHWAIsBH8EOU4Tqx0Rnk8MDge7zg"
                readOnly
                className="font-mono text-xs sm:text-sm bg-accent/50"
              />
              <p className="text-xs text-muted-foreground">
                Currently connected to your sales data sheet
              </p>
            </div>
            <Button variant="outline" className="gap-2 w-full sm:w-auto">
              <RefreshCw className="h-4 w-4" />
              Reconnect
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 rounded-lg p-2">
                <RefreshCw className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base sm:text-lg">Auto Refresh</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Automatically sync data from Google Sheets
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5 flex-1">
                <Label className="text-sm">Enable Auto Refresh</Label>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Fetch latest data every 5 minutes
                </p>
              </div>
              <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 rounded-lg p-2">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base sm:text-lg">Notifications</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Configure alert preferences
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5 flex-1">
                <Label className="text-sm">Enable Notifications</Label>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Show toast messages for updates
                </p>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 rounded-lg p-2">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base sm:text-lg">Security</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Password and access management
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password" className="text-sm">Current Password</Label>
              <Input 
                id="current-password" 
                type="password" 
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password" className="text-sm">New Password</Label>
              <Input 
                id="new-password" 
                type="password" 
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <Button 
              variant="secondary" 
              className="w-full sm:w-auto"
              onClick={handlePasswordChange}
            >
              Change Password
            </Button>
          </CardContent>
        </Card>

        <Separator />

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Button onClick={handleSave} className="gap-2 w-full sm:w-auto">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
          <Button variant="outline" className="w-full sm:w-auto">Cancel</Button>
        </div>
      </div>
    </div>
  );
}
