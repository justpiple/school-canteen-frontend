export interface OrderItem {
  id: number;
  orderId: number;
  menuId: number;
  menuName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  userId: string;
  standId: number;
  status: "PENDING" | "COOKING" | "ON_DELIVERY" | "COMPLETED";
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  stand: {
    standName: string;
  };
  user: {
    student: {
      name: string;
    };
  };
}

export type OrderStatus = Order["status"];
