import { CartItem } from "@/types/Menu";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Loader2, Minus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { calculateDiscountedPrice } from "@/utils/atomics";
import { confirm } from "@/utils/confirm";

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  isPlacingOrder: boolean;
  onRemoveItem: (itemId: number) => void;
  onAddItem: (item: CartItem) => void;
  onClearCart: () => void;
  onPlaceOrder: () => void;
}

export function Cart({
  isOpen,
  onClose,
  cart,
  onRemoveItem,
  onAddItem,
  onClearCart,
  onPlaceOrder,
  isPlacingOrder,
}: Readonly<CartProps>) {
  const [selectedItem, setSelectedItem] = useState<CartItem | null>(null);

  const totalPrice = cart.reduce(
    (sum, item) =>
      sum +
      calculateDiscountedPrice(item.price, item.discount?.percentage) *
        item.quantity,
    0,
  );

  async function clearCart() {
    const confirmation = await confirm({
      title: "Clear Cart?",
      description: "Are you sure want to clear cart?",
      confirmLabel: "Yes",
    });

    if (confirmation) onClearCart();
  }

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="h-[80vh] rounded-t-3xl">
        <DrawerHeader className="relative">
          <DrawerTitle>Your Cart</DrawerTitle>
        </DrawerHeader>
        <div
          className="px-4 mt-4 space-y-4 overflow-y-auto pb-32"
          style={{ maxHeight: "calc(80vh - 9rem)" }}
        >
          {cart.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <Dialog>
                <DialogTrigger asChild>
                  <button
                    className="flex-1 cursor-pointer text-start"
                    onClick={() => setSelectedItem(item)}
                  >
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-600">
                      {item.discount ? (
                        <>
                          <span className="line-through">
                            Rp {item.price.toLocaleString()}
                          </span>
                          <span className="ml-2 text-red-500">
                            Rp{" "}
                            {calculateDiscountedPrice(
                              item.price,
                              item.discount.percentage,
                            ).toLocaleString()}
                          </span>
                        </>
                      ) : (
                        `Rp ${item.price.toLocaleString()}`
                      )}
                    </p>
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
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onRemoveItem(item.id)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span>{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onAddItem(item)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold">Total:</span>
            <span className="font-bold">Rp {totalPrice.toLocaleString()}</span>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" className="w-full" onClick={clearCart}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Cart
            </Button>
            <Button
              className="w-full"
              onClick={onPlaceOrder}
              disabled={isPlacingOrder}
            >
              {isPlacingOrder && <Loader2 className="animate-spin mr-2" />}
              Place Order
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
