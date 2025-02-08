import { Card } from "@/components/ui/card";
import { MenuItem } from "@/types/Menu";
import { cn } from "@/utils/atomics";
import { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const calculateDiscountedPrice = (
  price: number,
  discountPercentage: number,
): number => {
  return price - (price * discountPercentage) / 100;
};

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onAddToCart }) => {
  const [isImageLoading, setIsImageLoading] = useState<boolean>(true);

  return (
    <Card className="overflow-hidden flex flex-col group transition-all">
      <div className="relative aspect-video bg-muted">
        <div
          className={cn(
            "absolute inset-0 bg-muted",
            isImageLoading ? "animate-pulse" : "hidden",
          )}
        />
        <Image
          src={item.photo}
          alt={item.name}
          layout="fill"
          objectFit="cover"
          className={cn(isImageLoading ? "opacity-0" : "opacity-100")}
          onLoadingComplete={() => setIsImageLoading(false)}
        />
        {item.discount && (
          <Badge variant="destructive" className="absolute top-2 right-2">
            {item.discount.percentage}% OFF
          </Badge>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h4 className="font-semibold text-lg mb-2">{item.name}</h4>
        <Dialog>
          <DialogTrigger asChild>
            <button className="text-sm text-muted-foreground hover:text-foreground line-clamp-2 transition-colors text-left">
              {item.description}
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{item.name}</DialogTitle>
              <DialogDescription className="mt-2">
                {item.description}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <div className="mt-auto pt-4">
          {item.discount ? (
            <div className="flex items-center gap-2">
              <span className="text-sm line-through text-muted-foreground">
                Rp {item.price.toLocaleString()}
              </span>
              <span className="text-base font-bold text-destructive">
                Rp{" "}
                {calculateDiscountedPrice(
                  item.price,
                  item.discount.percentage,
                ).toLocaleString()}
              </span>
            </div>
          ) : (
            <span className="text-base font-bold">
              Rp {item.price.toLocaleString()}
            </span>
          )}
          <Button
            onClick={() => onAddToCart(item)}
            className="w-full gap-2 mt-4"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </Button>
        </div>
      </div>
    </Card>
  );
};

export const MenuItemsSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
    {[1, 2, 3].map((i) => (
      <div key={i} className="space-y-4">
        <Skeleton className="w-full h-48" />
        <Skeleton className="w-3/4 h-4" />
        <Skeleton className="w-full h-20" />
        <Skeleton className="w-1/4 h-4" />
        <Skeleton className="w-full h-10" />
      </div>
    ))}
  </div>
);

export default MenuItemCard;
