import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";

interface MenuItem {
  id: number;
  name: string;
  price: number;
}

interface Discount {
  id: number;
  standId: number;
  name: string;
  percentage: number;
  startDate: string;
  endDate: string;
  menus: MenuItem[];
}

interface DiscountDetailProps {
  discount: Discount;
  allMenus: MenuItem[];
  onUpdateMenus: (discountId: number, menuIds: number[]) => void;
  onClose: () => void;
}

export function DiscountDetail({
  discount,
  allMenus,
  onUpdateMenus,
  onClose,
}: Readonly<DiscountDetailProps>) {
  const [selectedMenus, setSelectedMenus] = useState<number[]>(
    discount.menus.map((menu) => menu.id),
  );

  useEffect(() => {
    setSelectedMenus(discount.menus.map((menu) => menu.id));
  }, [discount]);

  const handleMenuToggle = (menuId: number) => {
    setSelectedMenus((prev) =>
      prev.includes(menuId)
        ? prev.filter((id) => id !== menuId)
        : [...prev, menuId],
    );
  };

  const handleSave = () => {
    onUpdateMenus(discount.id, selectedMenus);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{discount.name} Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="font-bold">{discount.percentage}% Off</p>
          <p className="text-sm text-muted-foreground">
            Valid from {format(discount.startDate, "MMMM dd, yyyy")} to{" "}
            {format(discount.endDate, "MMMM dd, yyyy")}
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Applicable Menus</h3>
          <div className="space-y-2">
            {allMenus.map((menu) => (
              <div key={menu.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`menu-${menu.id}`}
                  checked={selectedMenus.includes(menu.id)}
                  onCheckedChange={() => handleMenuToggle(menu.id)}
                />
                <label
                  htmlFor={`menu-${menu.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {menu.name} - Rp {menu.price.toLocaleString()}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
}
