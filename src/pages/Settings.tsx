import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, MapPin, Package, Shield, Bell, Download, HeadphonesIcon } from "lucide-react";
import ProfileSettings from "@/components/settings/ProfileSettings";
import AddressSettings from "@/components/settings/AddressSettings";
import OrderHistory from "@/components/settings/OrderHistory";
import SecuritySettings from "@/components/settings/SecuritySettings";
import NotificationSettings from "@/components/settings/NotificationSettings";
import PrivacySettings from "@/components/settings/PrivacySettings";
import SupportCenter from "@/components/settings/SupportCenter";

const Settings = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const settingsTabs = [
    {
      value: "profile",
      label: "Profile & Account",
      icon: User,
      component: ProfileSettings
    },
    {
      value: "addresses",
      label: "Addresses",
      icon: MapPin,
      component: AddressSettings
    },
    {
      value: "orders",
      label: "Orders",
      icon: Package,
      component: OrderHistory
    },
    {
      value: "security",
      label: "Security",
      icon: Shield,
      component: SecuritySettings
    },
    {
      value: "notifications",
      label: "Notifications",
      icon: Bell,
      component: NotificationSettings
    },
    {
      value: "privacy",
      label: "Privacy",
      icon: Download,
      component: PrivacySettings
    },
    {
      value: "support",
      label: "Support",
      icon: HeadphonesIcon,
      component: SupportCenter
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Account Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your account preferences and settings</p>
        </div>

        <Card className="shadow-card">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="border-b">
                <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 bg-transparent h-auto p-0">
                  {settingsTabs.map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="flex flex-col gap-2 p-4 data-[state=active]:bg-muted rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                    >
                      <tab.icon className="w-5 h-5" />
                      <span className="text-xs font-medium hidden sm:block">{tab.label}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              <div className="p-6">
                {settingsTabs.map((tab) => (
                  <TabsContent key={tab.value} value={tab.value} className="mt-0">
                    <div className="mb-6">
                      <h2 className="text-2xl font-semibold text-foreground mb-2">{tab.label}</h2>
                    </div>
                    <tab.component />
                  </TabsContent>
                ))}
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;