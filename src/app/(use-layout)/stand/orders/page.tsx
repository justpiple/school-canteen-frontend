"use client";

import { useEffect, useState } from "react";
import { OrderList } from "./components/OrderList";
import { DateFilter } from "./components/DateFilter";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Order, OrderStatus } from "@/types/Order";
import { apiClient } from "@/lib/auth/browserApiClient";
import { toast } from "sonner";
import { useRouter } from "next-nprogress-bar";

export default function OrderPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL");
  const [month, setMonth] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const router = useRouter();

  const handleUpdateStatus = async (
    orderId: number,
    newStatus: OrderStatus,
  ) => {
    const toastId = toast.loading("Loading...");
    const updateOrder = await apiClient({
      url: `/orders/${orderId}`,
      method: "PATCH",
      data: { status: newStatus },
    });
    if (updateOrder.statusCode === 200) {
      toast.success("Order updated successfully", { id: toastId });
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order,
        ),
      );
    } else toast.error("Failed to update order data.", { id: toastId });
  };

  const handleDateFilterChange = (newMonth: string, newYear: string) => {
    setMonth(newMonth);
    setYear(newYear);
  };

  const filteredOrders = orders.filter(
    (order) => statusFilter === "ALL" || order.status === statusFilter,
  );

  useEffect(() => {
    async function initialData() {
      const orders = await apiClient({
        url: "/orders",
        params: {
          year: parseInt(year) || undefined,
          month: parseInt(month) || undefined,
        },
      });
      if (orders.statusCode === 200) setOrders(orders.data);
      else toast.error("Failed to fetch orders data.");
    }

    initialData();
  }, [year, month]);

  useEffect(() => {
    async function initialData() {
      const stand = await apiClient({ url: "/stands/me" });

      if (stand.statusCode === 404) {
        toast.error("You don't have a stand.");
        router.push("/stand/profile");
      }
    }

    initialData();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Manage Orders</h1>

      <div className="mb-6 space-y-4">
        <div className="flex items-center space-x-4">
          <Label htmlFor="status-filter">Filter by Status:</Label>
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value as OrderStatus | "ALL")
            }
          >
            <SelectTrigger id="status-filter" className="w-[180px]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Orders</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="COOKING">Cooking</SelectItem>
              <SelectItem value="ON_DELIVERY">On Delivery</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => {
              setStatusFilter("ALL");
              setMonth("");
              setYear("");
            }}
          >
            Clear Filter
          </Button>
        </div>

        <DateFilter
          onFilterChange={handleDateFilterChange}
          filterVaue={{ year, month }}
        />
      </div>

      <OrderList orders={filteredOrders} onUpdateStatus={handleUpdateStatus} />
    </div>
  );
}
