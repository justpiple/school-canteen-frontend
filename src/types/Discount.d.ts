export interface Discount {
  id: number;
  standId: number;
  name: string;
  percentage: number;
  startDate: string;
  endDate: string;
}

export interface DiscountDetail extends Discount {
  menus: MenuItem[];
}
