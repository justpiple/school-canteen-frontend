import { MenuItem } from "@/types/Menu";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface MenuListProps {
  menuItems: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
}

export function MenuList({ menuItems, onAddToCart }: Readonly<MenuListProps>) {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const calculateDiscountedPrice = (
    price: number,
    discountPercentage: number,
  ) => {
    return price - (price * discountPercentage) / 100;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {menuItems.map((item) => (
        <Card key={item.id} className="overflow-hidden">
          <div className="relative h-40">
            <Image
              src={item.photo}
              alt={item.name}
              layout="fill"
              objectFit="cover"
            />
            {item.discount && (
              <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-sm font-bold">
                {item.discount.percentage}% OFF
              </div>
            )}
          </div>
          <CardHeader className="p-3">
            <CardTitle className="text-base">{item.name}</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <Dialog>
              <DialogTrigger asChild>
                <button
                  className="text-xs text-gray-600 line-clamp-2 cursor-pointer"
                  onClick={() => setSelectedItem(item)}
                >
                  {item.description}
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{selectedItem?.name}</DialogTitle>
                  <DialogDescription>
                    {selectedItem?.description}
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            <div className="mt-2">
              {item.discount ? (
                <div className="flex items-center">
                  <p className="text-sm line-through text-gray-400">
                    Rp {item.price.toLocaleString()}
                  </p>
                  <p className="text-sm font-bold text-red-500 ml-2">
                    Rp{" "}
                    {calculateDiscountedPrice(
                      item.price,
                      item.discount.percentage,
                    ).toLocaleString()}
                  </p>
                </div>
              ) : (
                <p className="text-sm font-bold">
                  Rp {item.price.toLocaleString()}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="p-3 pt-0">
            <Button
              onClick={() => onAddToCart(item)}
              className="w-full text-sm"
            >
              Add to Cart
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
