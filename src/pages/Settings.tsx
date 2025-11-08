import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Save, RefreshCw, Database, Bell, Shield, GitMerge, AlertTriangle } from "lucide-react";
import { updatePassword, mergeReps } from "@/utils/settingsApi";
import { useGoogleSheets } from "@/hooks/useGoogleSheets";

export default function Settings() {
  const { data: salesData, refetch } = useGoogleSheets();
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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [fromRep, setFromRep] = useState("");
  const [toRep, setToRep] = useState("");
  const [mergeLoading, setMergeLoading] = useState(false);
  const [showMergeConfirm, setShowMergeConfirm] = useState(false);

  const uniqueReps = Array.from(new Set(salesData.map(r => r.salesRepName))).sort();

  const handleSave = () => {
    localStorage.setItem("autoRefresh", JSON.stringify(autoRefresh));
    localStorage.setItem("notifications", JSON.stringify(notifications));
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Please fill in all password fields.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Validation Error",
        description: "New password and confirmation password do not match.",
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

    if (currentPassword === newPassword) {
      toast({
        title: "Validation Error",
        description: "New password must be different from current password.",
        variant: "destructive",
      });
      return;
    }

    setPasswordLoading(true);
    try {
      await updatePassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast({
        title: "Password Changed",
        description: "Your password has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Password Change Failed",
        description: error instanceof Error ? error.message : "Failed to change password",
        variant: "destructive",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleMergeReps = async () => {
    if (!fromRep || !toRep) {
      toast({
        title: "Validation Error",
        description: "Please select both source and destination rep.",
        variant: "destructive",
      });
      return;
    }

    if (fromRep === toRep) {
      toast({
        title: "Validation Error",
        description: "Source and destination reps cannot be the same.",
        variant: "destructive",
      });
      return;
    }

    setMergeLoading(true);
    try {
      const result = await mergeReps(fromRep, toRep);
      toast({
        title: "Merge Successful",
        description: result.message,
      });
      setFromRep("");
      setToRep("");
      setShowMergeConfirm(false);
      await refetch();
    } catch (error) {
      toast({
        title: "Merge Failed",
        description: error instanceof Error ? error.message : "Failed to merge reps",
        variant: "destructive",
      });
    } finally {
      setMergeLoading(false);
    }
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
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-sm">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <Button
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={handlePasswordChange}
              disabled={passwordLoading}
            >
              {passwordLoading ? "Updating..." : "Change Password"}
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-orange-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="bg-orange-100 rounded-lg p-2">
                <GitMerge className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <CardTitle className="text-base sm:text-lg">Merge Sales Reps</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Move sales from one rep to another
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 flex gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-orange-800">
                This action will reassign all sales from one rep to another in your Google Sheet.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="from-rep" className="text-sm">From Rep (Source)</Label>
              <select
                id="from-rep"
                value={fromRep}
                onChange={(e) => setFromRep(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
              >
                <option value="">Select source rep...</option>
                {uniqueReps.map((rep) => (
                  <option key={rep} value={rep}>
                    {rep}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="to-rep" className="text-sm">To Rep (Destination)</Label>
              <select
                id="to-rep"
                value={toRep}
                onChange={(e) => setToRep(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
              >
                <option value="">Select destination rep...</option>
                {uniqueReps.map((rep) => (
                  <option key={rep} value={rep}>
                    {rep}
                  </option>
                ))}
              </select>
            </div>
            <AlertDialog open={showMergeConfirm} onOpenChange={setShowMergeConfirm}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Merge Sales Reps</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will move all sales from <span className="font-semibold text-foreground">{fromRep}</span> to{" "}
                    <span className="font-semibold text-foreground">{toRep}</span> in your Google Sheet. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex gap-2">
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleMergeReps}
                    disabled={mergeLoading}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {mergeLoading ? "Merging..." : "Confirm Merge"}
                  </AlertDialogAction>
                </div>
              </AlertDialogContent>
            </AlertDialog>
            <Button
              variant="outline"
              className="w-full sm:w-auto border-orange-200 text-orange-600 hover:bg-orange-50"
              onClick={() => setShowMergeConfirm(true)}
              disabled={!fromRep || !toRep || mergeLoading}
            >
              <GitMerge className="h-4 w-4 mr-2" />
              Merge Sales Reps
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
