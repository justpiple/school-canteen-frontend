"use client";

import { useEffect, useState } from "react";
import { MenuItemList } from "./components/MenuItemList";
import { MenuItem } from "@/types/MenuItem";
import { apiClient } from "@/lib/auth/browserApiClient";
import { Stand } from "@/types/Stand";
import { toast } from "sonner";
import { useRouter } from "next-nprogress-bar";

export default function MenuCRUDPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [stand, setStand] = useState<Stand>();
  const router = useRouter();

  const handleAdd = (
    newItem: Omit<MenuItem, "id" | "createdAt" | "updatedAt" | "standId">,
  ) => {
    if (stand) {
      const item: MenuItem = {
        ...newItem,
        id: Math.max(...menuItems.map((item) => item.id)) + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        standId: stand.id,
      };

      setMenuItems((menuItems) => [...menuItems, item]);
    }
  };

  const handleUpdate = (updatedItem: MenuItem) => {
    setMenuItems(
      menuItems.map((item) =>
        item.id === updatedItem.id ? updatedItem : item,
      ),
    );
  };

  const handleDelete = async (id: number) => {
    const toastId = toast.loading("Loading...");
    const response = await apiClient({
      method: "DELETE",
      url: `/menu/${id}`,
    });

    if (response.statusCode === 200) {
      toast.success("Item deleted succesfully", { id: toastId });
      setMenuItems(menuItems.filter((item) => item.id !== id));
    } else if (Array.isArray(response.message)) {
      toast.error(response?.message.join("\n"), { id: toastId });
    } else {
      toast.error(response?.message, { id: toastId });
    }
  };

  useEffect(() => {
    async function initialData() {
      const stand = await apiClient({ url: "/stands/me" });

      if (stand.statusCode === 200) setStand(stand.data);
      else if (stand.statusCode === 404) {
        toast.error("You don't have a stand.");
        router.push("/stand/profile");
      }

      const menu = await apiClient({ url: "/menu" });
      if (stand.statusCode === 200) setMenuItems(menu.data);
      else toast.error("Failed to fetch menu data.");
    }

    initialData();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Manage Menu</h1>
      <MenuItemList
        items={menuItems}
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
}
