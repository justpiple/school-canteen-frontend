"use client";

import { useState, useEffect } from "react";
import { OrderList } from "./components/OrderList";
import { DateFilter } from "./components/DateFilter";
import { apiClient } from "@/lib/auth/browserApiClient";
import { toast } from "sonner";
import { Order } from "@/types/Order";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function StudentOrderPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [month, setMonth] = useState<string>("");
  const [year, setYear] = useState<string>("");

  const handleDateFilterChange = (newMonth: string, newYear: string) => {
    setMonth(newMonth);
    setYear(newYear);
  };

  const handleClearFilter = () => {
    setMonth("");
    setYear("");
  };

  useEffect(() => {
    async function fetchOrders() {
      const fetchedOrders = await apiClient({
        url: "/orders",
        params: {
          year: parseInt(year) || undefined,
          month: parseInt(month) || undefined,
        },
      });
      if (fetchedOrders.statusCode === 200) {
        setOrders(fetchedOrders.data);
      } else {
        toast.error("Failed to fetch orders data.");
      }
    }

    fetchOrders();
  }, [year, month]);

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 md:max-w-2xl lg:max-w-4xl min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <h1 className="text-2xl font-bold mb-4">My Orders</h1>

        <div className="space-y-4">
          <DateFilter
            onFilterChange={handleDateFilterChange}
            filterValue={{ year, month }}
          />
          <Button
            variant="outline"
            onClick={handleClearFilter}
            className="w-full flex items-center justify-center"
          >
            <X className="mr-2 h-4 w-4" /> Clear Filter
          </Button>
        </div>
      </div>

      <OrderList orders={orders} />
    </div>
  );
}
