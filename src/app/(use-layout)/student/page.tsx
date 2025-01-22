"use client";

import { useState, useEffect } from "react";
import { StandList } from "./components/StandList";
import { MenuList } from "./components/MenuList";
import { CartButton } from "./components/CartButton";
import { Cart } from "./components/Cart";
import { apiClient } from "@/lib/auth/browserApiClient";
import { toast } from "sonner";
import { Stand, MenuItem, CartItem } from "@/types/Menu";
import { confirm } from "@/utils/confirm";
import Image from "next/image";
import { useRouter } from "next-nprogress-bar";
import useLocalStorage from "@/hooks/useLocalStorage";

export default function HomePage() {
  const [stands, setStands] = useState<Stand[]>([]);
  const [selectedStand, setSelectedStand] = useState<Stand | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useLocalStorage<CartItem[]>("cart", []);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchStands();
    fetchStudentData();
  }, []);

  useEffect(() => {
    if (selectedStand) {
      fetchMenuItems(selectedStand.id);
    }
  }, [selectedStand]);

  const fetchStudentData = async () => {
    try {
      const response = await apiClient({ url: "/students/me" });
      if (response.statusCode !== 200) {
        router.push("/student/profile");
      }
    } catch {
      toast.error("An error occurred while fetching student data.");
    }
  };

  const fetchStands = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient({ url: "/stands" });
      if (response.statusCode === 200) {
        setStands(response.data);
      } else {
        toast.error("Failed to fetch stands.");
      }
    } catch {
      toast.error("An error occurred while fetching stands.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMenuItems = async (standId: number) => {
    setIsLoading(true);
    try {
      const response = await apiClient({ url: `/menu/stand/${standId}` });
      if (response.statusCode === 200) {
        setMenuItems(response.data);
      } else {
        toast.error("Failed to fetch menu items.");
      }
    } catch {
      toast.error("An error occurred while fetching menu items.");
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (item: MenuItem) => {
    if (cart.length > 0 && cart[0].standId !== item.standId) {
      const shouldClearCart = await confirm({
        title: "Clear Cart?",
        description:
          "You're adding an item from a different stand. Would you like to clear your current cart and add this item?",
        confirmLabel: "Clear Cart & Add",
        cancelLabel: "Cancel",
      });

      if (shouldClearCart) {
        clearCart();
        addItemToCart(item);
      }
    } else {
      addItemToCart(item);
    }
  };

  const addItemToCart = (item: MenuItem | CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem,
        );
      } else {
        const stand = stands.find((s) => s.id === item.standId);
        return [
          ...prevCart,
          {
            ...item,
            quantity: 1,
            standId: item.standId,
            standName: stand?.standName || "",
          },
        ];
      }
    });
  };

  const decrementQuantity = (prevCart: CartItem[], itemId: number) => {
    return prevCart
      .map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item,
      )
      .filter((item) => item.quantity > 0);
  };

  const deleteItem = (prevCart: CartItem[], itemId: number) => {
    return prevCart.filter((item) => item.id !== itemId);
  };

  const removeFromCart = async (itemId: number) => {
    try {
      const itemCart = cart.find((item) => item.id === itemId);

      if (!itemCart) {
        throw new Error("Invalid item");
      }

      if (itemCart.quantity === 1) {
        const userConfirmed = await confirm({
          title: "Delete item?",
          description: "Do you want delete this item from cart?",
          confirmLabel: "Delete",
          cancelLabel: "Cancel",
        });

        if (userConfirmed) {
          setCart((prevCart) => deleteItem(prevCart, itemId));
          toast.success("Item removed from cart");
        }
        return;
      }

      setCart((prevCart) => decrementQuantity(prevCart, itemId));
    } catch (error) {
      toast.error("Failed to remove item", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  };

  const clearCart = async () => {
    const confirmation = await confirm({
      title: "Clear Cart?",
      description: "Are you sure want to clear cart?",
      confirmLabel: "Yes",
    });

    if (!confirmation) return;

    setCart([]);
    setIsCartOpen(false);
  };

  const placeOrder = async () => {
    try {
      if (cart.length < 1) {
        toast.error("Cart is empty.");
        setIsCartOpen(false);
        return;
      }

      setIsPlacingOrder(true);

      const orderData = {
        standId: cart[0].standId,
        items: cart.map((item) => ({
          menuId: item.id,
          quantity: item.quantity,
        })),
      };

      const response = await apiClient({
        url: "/orders",
        method: "POST",
        data: orderData,
      });

      if (response.statusCode === 201) {
        toast.success("Order placed successfully!");
        clearCart();
        setIsCartOpen(false);
      } else {
        toast.error("Failed to place order.");
      }
    } catch {
      toast.error("An error occurred while placing the order.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen pb-20" suppressHydrationWarning>
      <div className="mx-auto max-w-md sm:p-6 md:max-w-2xl lg:max-w-4xl min-h-screen p-4">
        <h1 className="text-3xl font-bold mb-4">Food Ordering App</h1>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <>
            {!selectedStand && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">
                  Welcome to our Food Ordering App!
                </h2>
                <p className="text-gray-600 mb-4">
                  Choose from a variety of delicious meals from our local
                  stands.
                </p>
                <Image
                  src="/food-banner.jpg"
                  alt="Delicious Food"
                  width={400}
                  height={200}
                  className="rounded-lg shadow-md"
                />
              </div>
            )}
            <StandList
              stands={stands}
              selectedStand={selectedStand}
              onSelectStand={setSelectedStand}
            />
            {selectedStand && (
              <MenuList menuItems={menuItems} onAddToCart={addToCart} />
            )}
          </>
        )}
      </div>
      {cart.length > 0 && (
        <CartButton cart={cart} onOpenCart={() => setIsCartOpen(true)} />
      )}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onRemoveItem={removeFromCart}
        onAddItem={addItemToCart}
        onClearCart={clearCart}
        onPlaceOrder={placeOrder}
        isPlacingOrder={isPlacingOrder}
      />
    </div>
  );
}
