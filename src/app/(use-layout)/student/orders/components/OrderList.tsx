import { OrderCard } from "./OrderCard";
import { Order } from "@/types/Order";

interface OrderListProps {
  orders: Order[];
}

export function OrderList({ orders }: Readonly<OrderListProps>) {
  return (
    <div className="space-y-4">
      {orders.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow-md">
          <p className="text-gray-500">No orders found</p>
        </div>
      ) : (
        orders
          .toSorted((a, b) => b.id - a.id)
          .map((order) => <OrderCard key={order.id} order={order} />)
      )}
    </div>
  );
}
