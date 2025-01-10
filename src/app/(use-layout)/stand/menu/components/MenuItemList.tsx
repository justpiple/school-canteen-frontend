import { useState } from "react";
import { MenuItemCard } from "./MenuItemCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MenuItemForm } from "./MenuItemForm";
import { MenuItem } from "@/types/MenuItem";

interface MenuItemListProps {
  items: MenuItem[];
  onAdd: (item: MenuItem) => void;
  onUpdate: (item: MenuItem) => void;
  onDelete: (id: number) => void;
}

export function MenuItemList({
  items,
  onAdd,
  onUpdate,
  onDelete,
}: Readonly<MenuItemListProps>) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const handleAdd = (newItem: MenuItem) => {
    onAdd(newItem);
    setIsAddDialogOpen(false);
  };

  const handleUpdate = (updatedItem: MenuItem) => {
    onUpdate(updatedItem);
    setEditingItem(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Menu Items</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add New Item</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Menu Item</DialogTitle>
              <DialogDescription>
                Fill in the details for the new menu item.
              </DialogDescription>
            </DialogHeader>
            <MenuItemForm
              onSubmit={handleAdd}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <MenuItemCard
            key={item.id}
            item={item}
            onEdit={setEditingItem}
            onDelete={onDelete}
          />
        ))}
      </div>
      {editingItem && (
        <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Menu Item</DialogTitle>
              <DialogDescription>
                Update the details for this menu item.
              </DialogDescription>
            </DialogHeader>
            <MenuItemForm
              initialData={editingItem}
              onSubmit={handleUpdate}
              onCancel={() => setEditingItem(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
