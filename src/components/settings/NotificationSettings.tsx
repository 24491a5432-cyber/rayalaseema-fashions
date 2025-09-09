import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, Mail, Smartphone, Package, Megaphone, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NotificationPreferences {
  id?: string;
  user_id: string;
  order_updates: boolean;
  promotional_emails: boolean;
  delivery_alerts: boolean;
  marketing_sms: boolean;
}

const NotificationSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    user_id: user?.id || "",
    order_updates: true,
    promotional_emails: true,
    delivery_alerts: true,
    marketing_sms: false,
  });

  useEffect(() => {
    fetchPreferences();
  }, [user]);

  const fetchPreferences = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching preferences:', error);
        return;
      }

      if (data) {
        setPreferences(data);
      }
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
    }
  };

  const handleToggle = (key: keyof NotificationPreferences, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          ...preferences,
          user_id: user.id
        });

      if (error) throw error;

      toast({
        title: "Preferences Updated",
        description: "Your notification preferences have been saved."
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

  const notificationSettings = [
    {
      id: 'order_updates',
      title: 'Order Updates',
      description: 'Get notified about order confirmations, shipping updates, and delivery status',
      icon: Package,
      type: 'Email & SMS',
      value: preferences.order_updates,
    },
    {
      id: 'promotional_emails',
      title: 'Promotional Emails',
      description: 'Receive emails about new products, sales, and special offers',
      icon: Mail,
      type: 'Email',
      value: preferences.promotional_emails,
    },
    {
      id: 'delivery_alerts',
      title: 'Delivery Alerts',
      description: 'Get real-time notifications when your order is out for delivery',
      icon: Bell,
      type: 'SMS & Push',
      value: preferences.delivery_alerts,
    },
    {
      id: 'marketing_sms',
      title: 'Marketing SMS',
      description: 'Receive text messages about flash sales and limited-time offers',
      icon: Smartphone,
      type: 'SMS',
      value: preferences.marketing_sms,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Notification Preferences</h3>
        <p className="text-sm text-muted-foreground">
          Choose how and when you want to receive notifications from us
        </p>
      </div>

      <div className="space-y-4">
        {notificationSettings.map((setting) => (
          <Card key={setting.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <setting.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{setting.title}</h4>
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                        {setting.type}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {setting.description}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={setting.value}
                  onCheckedChange={(checked) => handleToggle(setting.id as keyof NotificationPreferences, checked)}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Email Frequency */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Email Frequency
          </CardTitle>
          <CardDescription>
            Control how often you receive promotional emails
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="daily"
                name="frequency"
                value="daily"
                className="rounded border-border"
                defaultChecked={false}
              />
              <Label htmlFor="daily" className="font-normal">
                Daily - Get the latest updates every day
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="weekly"
                name="frequency"
                value="weekly"
                className="rounded border-border"
                defaultChecked={true}
              />
              <Label htmlFor="weekly" className="font-normal">
                Weekly - A summary of the week's best offers
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="monthly"
                name="frequency"
                value="monthly"
                className="rounded border-border"
                defaultChecked={false}
              />
              <Label htmlFor="monthly" className="font-normal">
                Monthly - Only the most important updates
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Marketing Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="w-5 h-5" />
            Marketing Preferences
          </CardTitle>
          <CardDescription>
            Choose the types of marketing content you're interested in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'New Arrivals',
              'Sale Announcements',
              'Style Tips',
              'Seasonal Collections',
              'Exclusive Member Offers',
              'Product Recommendations'
            ].map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={category.toLowerCase().replace(' ', '_')}
                  className="rounded border-border"
                  defaultChecked={true}
                />
                <Label htmlFor={category.toLowerCase().replace(' ', '_')} className="font-normal text-sm">
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>
            Make sure your contact details are up to date to receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Email Address</h4>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
              <Button variant="outline" size="sm">
                Update
              </Button>
            </div>
          </div>
          
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Phone Number</h4>
                <p className="text-sm text-muted-foreground">
                  {preferences.marketing_sms ? 'Update your phone number in profile settings' : 'Not set'}
                </p>
              </div>
              <Button variant="outline" size="sm">
                Update
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <Button onClick={handleSave} disabled={loading}>
          <Save className="w-4 h-4 mr-2" />
          {loading ? "Saving..." : "Save Preferences"}
        </Button>
      </div>
    </div>
  );
};

export default NotificationSettings;