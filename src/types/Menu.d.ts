export interface Stand {
  id: number;
  standName: string;
  ownerName: string;
  phone: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  type: "FOOD" | "DRINK";
  photo: string;
  createdAt: string;
  updatedAt: string;
  standId: number;
  discount?: {
    id: number;
    standId: number;
    name: string;
    percentage: number;
    startDate: string;
    endDate: string;
  };
}

export interface CartItem extends MenuItem {
  quantity: number;
  standName: string;
}
