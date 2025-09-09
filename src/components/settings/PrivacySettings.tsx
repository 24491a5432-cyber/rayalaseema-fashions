import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Download, Trash2, Eye, Shield, AlertTriangle, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PrivacySettings = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  const handleDownloadData = async () => {
    setLoading(true);
    try {
      // This would typically generate a comprehensive data export
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Data Export Started",
        description: "We'll email you a download link when your data export is ready (usually within 24 hours)."
      });
    } catch (error: any) {
      toast({
        title: "Export Error",
        description: "Failed to start data export. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== "DELETE") {
      toast({
        title: "Invalid Confirmation",
        description: "Please type 'DELETE' to confirm account deletion.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // This would typically involve:
      // 1. Marking account for deletion
      // 2. Anonymizing personal data
      // 3. Scheduling data purge
      
      toast({
        title: "Account Deletion Requested",
        description: "Your account will be deleted within 30 days. You can cancel this request by contacting support.",
        variant: "destructive"
      });

      // Sign out the user
      await signOut();
    } catch (error: any) {
      toast({
        title: "Deletion Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Data Export */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Download Your Data
          </CardTitle>
          <CardDescription>
            Get a copy of all your personal data stored in our system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Your data export will include:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Profile information and account details</li>
                <li>• Order history and purchase records</li>
                <li>• Address book and payment information</li>
                <li>• Communication preferences and support tickets</li>
                <li>• Website activity and interaction logs</li>
              </ul>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="w-4 h-4" />
              <span>Data will be provided in JSON format via secure download link</span>
            </div>
            
            <Button onClick={handleDownloadData} disabled={loading}>
              <Download className="w-4 h-4 mr-2" />
              {loading ? "Preparing Export..." : "Request Data Export"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Privacy Controls
          </CardTitle>
          <CardDescription>
            Manage how your data is used and shared
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Analytics & Performance</h4>
                <p className="text-sm text-muted-foreground">
                  Help us improve our service by sharing usage analytics
                </p>
              </div>
              <input
                type="checkbox"
                defaultChecked={true}
                className="rounded border-border"
              />
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Personalized Recommendations</h4>
                <p className="text-sm text-muted-foreground">
                  Use your purchase history to suggest relevant products
                </p>
              </div>
              <input
                type="checkbox"
                defaultChecked={true}
                className="rounded border-border"
              />
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Marketing Communications</h4>
                <p className="text-sm text-muted-foreground">
                  Receive personalized offers and promotions
                </p>
              </div>
              <input
                type="checkbox"
                defaultChecked={false}
                className="rounded border-border"
              />
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Third-party Data Sharing</h4>
                <p className="text-sm text-muted-foreground">
                  Share data with trusted partners for improved service
                </p>
              </div>
              <input
                type="checkbox"
                defaultChecked={false}
                className="rounded border-border"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Retention */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Data Retention Policy
          </CardTitle>
          <CardDescription>
            Understand how long we keep your information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-3 bg-muted/50 rounded-lg">
                <h4 className="font-medium">Account Data</h4>
                <p className="text-muted-foreground mt-1">
                  Kept while account is active + 2 years after deletion
                </p>
              </div>
              
              <div className="p-3 bg-muted/50 rounded-lg">
                <h4 className="font-medium">Order History</h4>
                <p className="text-muted-foreground mt-1">
                  Retained for 7 years for legal and tax purposes
                </p>
              </div>
              
              <div className="p-3 bg-muted/50 rounded-lg">
                <h4 className="font-medium">Communication Logs</h4>
                <p className="text-muted-foreground mt-1">
                  Kept for 3 years to improve customer service
                </p>
              </div>
              
              <div className="p-3 bg-muted/50 rounded-lg">
                <h4 className="font-medium">Website Analytics</h4>
                <p className="text-muted-foreground mt-1">
                  Anonymous data kept for 2 years for analysis
                </p>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex gap-3">
                <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-200">Your Rights</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    You have the right to access, rectify, erase, or port your data. 
                    You can also object to processing or request restriction of processing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Deletion */}
      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="w-5 h-5" />
            Delete Account
          </CardTitle>
          <CardDescription>
            Permanently delete your account and all associated data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex gap-3">
                <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-destructive">Warning: This action cannot be undone</h4>
                  <ul className="text-sm text-destructive/80 mt-2 space-y-1">
                    <li>• Your account will be permanently deleted</li>
                    <li>• All order history and personal data will be removed</li>
                    <li>• You won't be able to recover your account</li>
                    <li>• Active orders may be cancelled</li>
                  </ul>
                </div>
              </div>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete My Account
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove your data from our servers.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <p className="text-sm">
                    Please type <span className="font-semibold">DELETE</span> to confirm:
                  </p>
                  <input
                    type="text"
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md"
                    placeholder="Type DELETE here"
                  />
                </div>
                
                <DialogFooter>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    disabled={loading || deleteConfirmation !== "DELETE"}
                  >
                    {loading ? "Deleting..." : "Delete Account"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacySettings;