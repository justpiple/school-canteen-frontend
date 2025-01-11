import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Order } from "@/types/Order";
import { Download } from "lucide-react";
import { apiClient } from "@/lib/auth/browserApiClient";
import { toast } from "sonner";

export function OrderCard({ order }: Readonly<{ order: Order }>) {
  const totalAmount = order.items.reduce((sum, item) => sum + item.price, 0);

  const statusColors: Record<Order["status"], string> = {
    PENDING: "bg-yellow-500",
    COOKING: "bg-blue-500",
    ON_DELIVERY: "bg-purple-500",
    COMPLETED: "bg-green-500",
  };

  const handleDownloadReceipt = async () => {
    try {
      const response = await apiClient({
        url: `/orders/${order.id}/receipt`,
        method: "GET",
        responseType: "blob",
      });

      if (response) {
        const blob = new Blob([response as unknown as Blob], {
          type: "application/pdf",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `receipt-order-${order.id}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
      } else {
        toast.error("Failed to download receipt.");
      }
    } catch {
      toast.error("An error occurred while downloading the receipt.");
    }
  };

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Order #{order.id}</CardTitle>
          <Badge className={statusColors[order.status]}>{order.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Ordered on: {format(new Date(order.createdAt), "PPP")}
        </p>
        <p className="text-sm font-medium">Stand: {order.stand.standName}</p>
        <div>
          <h3 className="font-semibold text-sm">Items:</h3>
          <ul className="list-disc list-inside text-sm">
            {order.items.map((item) => (
              <li key={item.id}>
                {item.menuName} x{item.quantity} - Rp{" "}
                {item.price.toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
        <p className="font-bold text-sm">
          Total: Rp {totalAmount.toLocaleString()}
        </p>
        <Button
          variant="outline"
          className="w-full mt-2 flex items-center justify-center"
          onClick={handleDownloadReceipt}
        >
          <Download className="mr-2 h-4 w-4" /> Download Receipt
        </Button>
      </CardContent>
    </Card>
  );
}
