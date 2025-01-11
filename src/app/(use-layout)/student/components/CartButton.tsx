import { CartItem } from "@/types/Menu";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

interface CartButtonProps {
  cart: CartItem[];
  onOpenCart: () => void;
}

export function CartButton({ cart, onOpenCart }: Readonly<CartButtonProps>) {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div className="fixed bottom-[4.5rem] sm:bottom-4 left-0 right-0 flex justify-center z-50">
      <Button
        onClick={onOpenCart}
        className="flex items-center space-x-1 px-4 py-2 rounded-full shadow-lg bg-primary text-primary-foreground"
      >
        <ShoppingCart className="w-5 h-5" />
        <span>{totalItems} items</span>
        <span>•</span>
        <span>{cart[0]?.standName}</span>
        <span>•</span>
        <span>Rp {totalPrice.toLocaleString()}</span>
      </Button>
    </div>
  );
}
