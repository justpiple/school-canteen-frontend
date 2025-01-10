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
}
