import { useState, useEffect } from "react";
import { 
  Eye, 
  ShoppingCart, 
  TrendingUp, 
  IndianRupee,
  Package,
  Users,
  BarChart3,
  UserCheck,
  Archive,
  Settings,
  Calendar,
  Activity
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    siteVisits: 3,
    checkoutReaches: 1,
    conversionRate: "100.0%",
    revenue: 247650,
    totalOrders: 247,
    totalCustomers: 89,
    totalProducts: 16,
    avgOrderValue: 1002
  });

  const [recentActivity] = useState([
    { id: 1, text: "New order #ORD-2024-001", time: "2 hours ago" },
    { id: 2, text: 'Product "Premium Cotton Shirt" updated', time: "5 hours ago" },
    { id: 3, text: "New customer registration", time: "1 day ago" }
  ]);

  const dashboardSections = [
    {
      title: "Manage Orders",
      description: "View and manage all customer orders, update order status and handle returns.",
      icon: Package,
      action: "View Orders",
      color: "bg-blue-600"
    },
    {
      title: "Manage Products", 
      description: "Add new products, edit existing ones, manage inventory and organize collections.",
      icon: Archive,
      action: "Manage Products",
      color: "bg-purple-600"
    },
    {
      title: "Analytics",
      description: "View detailed sales analytics, customer insights, and business performance metrics.",
      icon: BarChart3,
      action: "View Analytics", 
      color: "bg-green-600"
    },
    {
      title: "Customer Management",
      description: "Manage customer accounts, view purchase history, and handle customer support.",
      icon: UserCheck,
      action: "Manage Customers",
      color: "bg-orange-600"
    },
    {
      title: "Inventory Control",
      description: "Track stock levels, manage suppliers, and set up automatic reorder points.", 
      icon: Activity,
      action: "Manage Inventory",
      color: "bg-red-600"
    },
    {
      title: "Settings",
      description: "Configure payment gateways, shipping options, and general store settings.",
      icon: Settings,
      action: "Store Settings",
      color: "bg-gray-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">Dashboard</Button>
              <Button variant="ghost" size="sm">Orders</Button>
              <Button variant="ghost" size="sm">Products</Button>
              <Button variant="ghost" size="sm">Analytics</Button>
              <Button variant="ghost" size="sm">Customers</Button>
              <Button variant="ghost" size="sm">Inventory</Button>
              <Button variant="ghost" size="sm">Settings</Button>
              <Button variant="ghost" size="sm">Logout</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Site Visits</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">{stats.siteVisits}</span>
                    <span className="text-xs text-gray-500">Today: 3</span>
                  </div>
                </div>
                <div className="p-2 bg-blue-600/20 rounded-lg">
                  <Eye className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Checkout Reaches</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">{stats.checkoutReaches}</span>
                  </div>
                </div>
                <div className="p-2 bg-blue-600/20 rounded-lg">
                  <ShoppingCart className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Conversion Rate</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">{stats.conversionRate}</span>
                  </div>
                </div>
                <div className="p-2 bg-green-600/20 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Revenue</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">₹{stats.revenue.toLocaleString()}</span>
                  </div>
                </div>
                <div className="p-2 bg-green-600/20 rounded-lg">
                  <IndianRupee className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Popular Products */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg">Popular Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                  <span className="text-sm">Cotton Woven Full Sleeves Solid Shirt</span>
                  <span className="text-xs text-gray-400">#1</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Total Orders</span>
                  <span className="font-bold">{stats.totalOrders}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Total Customers</span>
                  <span className="font-bold">{stats.totalCustomers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Total Products</span>
                  <span className="font-bold">{stats.totalProducts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Average Order Value</span>
                  <span className="font-bold">₹{stats.avgOrderValue}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm">{activity.text}</p>
                      <p className="text-xs text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {dashboardSections.map((section, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`p-2 ${section.color} rounded-lg flex-shrink-0`}>
                    <section.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">{section.title}</h3>
                    <p className="text-sm text-gray-400 mb-4">{section.description}</p>
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      size="sm"
                      onClick={() => {
                        if (section.title === "Manage Products") {
                          navigate("/admin/products");
                        }
                      }}
                    >
                      {section.action}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;