import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Order, OrderStatus } from "@/types/Order";
import { confirm } from "@/utils/confirm";

interface OrderCardProps {
  order: Order;
  onUpdateStatus: (orderId: number, status: OrderStatus) => void;
}

export function OrderCard({ order, onUpdateStatus }: Readonly<OrderCardProps>) {
  const totalAmount = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const statusColors: Record<OrderStatus, string> = {
    PENDING: "bg-yellow-500",
    COOKING: "bg-blue-500",
    ON_DELIVERY: "bg-purple-500",
    COMPLETED: "bg-green-500",
  };

  const nextStatus: Partial<Record<OrderStatus, OrderStatus>> = {
    PENDING: "COOKING",
    COOKING: "ON_DELIVERY",
    ON_DELIVERY: "COMPLETED",
  };

  const buttonColors: Record<OrderStatus, string> = {
    PENDING: "bg-blue-500 hover:bg-blue-600",
    COOKING: "bg-purple-500 hover:bg-purple-600",
    ON_DELIVERY: "bg-green-500 hover:bg-green-600",
    COMPLETED: "bg-gray-500 hover:bg-gray-600",
  };

  const handleStatusUpdate = async () => {
    const nextOrderStatus = nextStatus[order.status];
    if (nextOrderStatus) {
      const isConfirmed = await confirm({
        title: "Update Order Status",
        description: `Are you sure you want to update the status to ${nextOrderStatus}?`,
        confirmLabel: "Update",
        cancelLabel: "Cancel",
      });

      if (isConfirmed) {
        onUpdateStatus(order.id, nextOrderStatus);
      }
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Order #{order.id}</CardTitle>
          <Badge className={statusColors[order.status]}>{order.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Ordered on: {format(new Date(order.createdAt), "PPP")}
        </p>
        <p className="text-sm font-medium">
          Customer: {order.user.student.name}
        </p>
        <div>
          <h3 className="font-semibold">Items:</h3>
          <ul className="list-disc list-inside">
            {order.items.map((item) => (
              <li key={item.id}>
                {item.menuName} x{item.quantity} - Rp{" "}
                {item.price.toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
        <p className="font-bold">Total: Rp {totalAmount.toLocaleString()}</p>
      </CardContent>
      <CardFooter className="flex justify-end">
        {nextStatus[order.status] && (
          <Button
            variant="default"
            className={buttonColors[order.status]}
            onClick={handleStatusUpdate}
          >
            Mark as {nextStatus[order.status]}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
