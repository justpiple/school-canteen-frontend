import { OrderCard } from "./OrderCard";
import { Order, OrderStatus } from "@/types/Order";

interface OrderListProps {
  orders: Order[];
  onUpdateStatus: (orderId: number, status: OrderStatus) => Promise<void>;
}

export function OrderList({
  orders,
  onUpdateStatus,
}: Readonly<OrderListProps>) {
  return (
    <div className="space-y-4">
      {orders
        .toSorted((a, b) => b.id - a.id)
        .map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onUpdateStatus={onUpdateStatus}
          />
        ))}
    </div>
  );
}
