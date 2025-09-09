import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Smartphone, Monitor, Eye, EyeOff, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserSession {
  id: string;
  device_info: any;
  ip_address: string;
  user_agent: string;
  is_active: boolean;
  last_activity: string;
  created_at: string;
}

const SecuritySettings = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    fetchSessions();
  }, [user]);

  const fetchSessions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('last_activity', { ascending: false });

      if (error) throw error;
      setSessions((data || []) as UserSession[]);
    } catch (error: any) {
      console.error('Error fetching sessions:', error);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New passwords do not match.",
        variant: "destructive"
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      toast({
        title: "Password Updated",
        description: "Your password has been successfully updated."
      });

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error: any) {
      toast({
        title: "Update Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOutSession = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('user_sessions')
        .update({ is_active: false })
        .eq('id', sessionId);

      if (error) throw error;

      toast({
        title: "Session Ended",
        description: "The session has been signed out."
      });

      fetchSessions();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleSignOutAllSessions = async () => {
    try {
      const { error } = await supabase
        .from('user_sessions')
        .update({ is_active: false })
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: "All Sessions Ended",
        description: "You have been signed out of all devices. Please sign in again."
      });

      // Sign out the current user
      await signOut();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getDeviceIcon = (userAgent: string) => {
    if (userAgent?.includes('Mobile')) {
      return <Smartphone className="w-4 h-4" />;
    }
    return <Monitor className="w-4 h-4" />;
  };

  const getDeviceName = (userAgent: string) => {
    if (!userAgent) return 'Unknown Device';
    
    if (userAgent.includes('Chrome')) return 'Chrome Browser';
    if (userAgent.includes('Firefox')) return 'Firefox Browser';
    if (userAgent.includes('Safari')) return 'Safari Browser';
    if (userAgent.includes('Edge')) return 'Edge Browser';
    
    return 'Unknown Browser';
  };

  return (
    <div className="space-y-6">
      {/* Password Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Change Password
          </CardTitle>
          <CardDescription>
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  name="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="pr-10"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
                minLength={6}
              />
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Two-Factor Authentication
          </CardTitle>
          <CardDescription>
            Add an extra layer of security to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <h4 className="font-medium">SMS Authentication</h4>
              <p className="text-sm text-muted-foreground">
                Receive verification codes via text message
              </p>
            </div>
            <Badge variant="outline">Coming Soon</Badge>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg mt-3">
            <div>
              <h4 className="font-medium">Authenticator App</h4>
              <p className="text-sm text-muted-foreground">
                Use an authenticator app like Google Authenticator
              </p>
            </div>
            <Badge variant="outline">Coming Soon</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="w-5 h-5" />
                Active Sessions
              </CardTitle>
              <CardDescription>
                Manage devices that are currently signed in to your account
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              onClick={handleSignOutAllSessions}
              className="text-destructive hover:text-destructive"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sessions.length === 0 ? (
              <div className="text-center py-8">
                <Monitor className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No active sessions found</p>
              </div>
            ) : (
              sessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getDeviceIcon(session.user_agent)}
                    <div>
                      <h4 className="font-medium">{getDeviceName(session.user_agent)}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{session.ip_address}</span>
                        <Badge variant="outline" className="text-xs">Current</Badge>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSignOutSession(session.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    Sign Out
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Security Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <p>Use a strong, unique password that includes letters, numbers, and symbols.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <p>Enable two-factor authentication for an extra layer of security.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <p>Regularly review and sign out of unused sessions.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <p>Never share your login credentials with anyone.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecuritySettings;