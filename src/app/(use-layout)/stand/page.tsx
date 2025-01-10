"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { StatCard } from "./components/StatCard";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next-nprogress-bar";
import { apiClient } from "@/lib/auth/browserApiClient";

interface MonthlyIncome {
  month: string;
  year: number;
  total: number;
}

interface TopSellingMenu {
  menuId: number;
  menuName: string;
  totalSold: number;
  totalIncome: number;
}

interface StatisticsData {
  monthlyIncome: MonthlyIncome[];
  totalOrders: number;
  averageIncomePerOrder: number;
  totalItemsSold: number;
  topSellingMenus: TopSellingMenu[];
}

export default function StatisticsPage() {
  const [stats, setStats] = useState<StatisticsData>();
  const router = useRouter();

  useEffect(() => {
    async function initialData() {
      const stand = await apiClient({ url: "/stands/stats" });

      if (stand.statusCode === 404) {
        toast.error("You don't have a stand.");
        router.push("/stand/profile");
      }

      setStats(stand.data);
    }

    initialData();
  }, []);

  const totalIncome = stats?.monthlyIncome.reduce(
    (sum, item) => sum + item.total,
    0,
  );

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Stand Statistics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Orders" value={stats?.totalOrders || 0} />
        <StatCard
          title="Average Income per Order"
          value={`Rp ${stats?.averageIncomePerOrder.toLocaleString() || 0}`}
        />
        <StatCard title="Total Items Sold" value={stats?.totalItemsSold || 0} />
        <StatCard
          title="Total Income (Last 12 Months)"
          value={`Rp ${totalIncome?.toLocaleString() || 0}`}
        />
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Monthly Income (Last 12 Months)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.monthlyIncome || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value) => `Rp ${value.toLocaleString()}`}
                />
                <Bar dataKey="total" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Selling Menus</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Menu Name</th>
                  <th className="text-right p-2">Total Sold</th>
                  <th className="text-right p-2">Total Income</th>
                </tr>
              </thead>
              <tbody>
                {stats ? (
                  stats.topSellingMenus.map((menu) => (
                    <tr key={menu.menuId} className="border-b">
                      <td className="p-2">{menu.menuName}</td>
                      <td className="text-right p-2">{menu.totalSold}</td>
                      <td className="text-right p-2">
                        Rp {menu.totalIncome.toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="border-b">
                    <td className="p-2">No data.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
