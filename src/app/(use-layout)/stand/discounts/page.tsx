"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DiscountForm } from "./components/DiscountForm";
import { DiscountCard } from "./components/DiscountCard";
import { DiscountDetail } from "./components/DiscountDetail";
import { confirm } from "@/utils/confirm";
import {
  Discount,
  DiscountDetail as DiscountDetailInterface,
} from "@/types/Discount";
import { apiClient } from "@/lib/auth/browserApiClient";
import { toast } from "sonner";
import { useRouter } from "next-nprogress-bar";

interface MenuItem {
  id: number;
  name: string;
  price: number;
}

export default function DiscountCRUDPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  const [viewingDiscount, setViewingDiscount] =
    useState<DiscountDetailInterface | null>(null);
  const [allMenus, setAllMenus] = useState<MenuItem[]>([]);
  const router = useRouter();

  const handleAdd = async (newDiscount: Discount) => {
    const isConfirmed = await confirm({
      title: "Add New Discount",
      description: "Are you sure you want to add this new discount?",
      confirmLabel: "Add",
      cancelLabel: "Cancel",
    });

    if (isConfirmed) {
      const { id, ...discount } = newDiscount; // eslint-disable-line @typescript-eslint/no-unused-vars
      const toastId = toast.loading("Loading...");
      const postDiscount = await apiClient({
        url: `/discounts`,
        data: discount,
        method: "POST",
      });

      if (postDiscount.statusCode === 201) {
        toast.success("Item successfully updated", { id: toastId });
        setDiscounts([...discounts, postDiscount.data]);
        setIsAddDialogOpen(false);
        setEditingDiscount(null);
      } else {
        toast.error(postDiscount.message, { id: toastId });
      }
    }
  };

  const handleUpdate = async (updatedDiscount: Discount) => {
    const isConfirmed = await confirm({
      title: "Update Discount",
      description: "Are you sure you want to update this discount?",
      confirmLabel: "Update",
      cancelLabel: "Cancel",
    });

    if (isConfirmed) {
      const toastId = toast.loading("Loading...");
      const updateMenus = await apiClient({
        url: `/discounts/${updatedDiscount.id}`,
        data: updatedDiscount,
        method: "PATCH",
      });

      if (updateMenus.statusCode === 200) {
        toast.success("Item successfully updated", { id: toastId });
        setDiscounts(
          discounts.map((d) =>
            d.id === updatedDiscount.id ? { ...updatedDiscount } : d,
          ),
        );
        setEditingDiscount(null);
      } else {
        toast.error("Failed to update item", { id: toastId });
      }
    }
  };

  const handleDelete = async (id: number) => {
    const toastId = toast.loading("Loading...");
    const updateMenus = await apiClient({
      url: `/discounts/${id}`,
      method: "DELETE",
    });

    if (updateMenus.statusCode === 200) {
      toast.success("Item successfully deleted", { id: toastId });
      setDiscounts(discounts.filter((d) => d.id !== id));
    } else {
      toast.error("Failed to delete item", { id: toastId });
    }
  };

  const handleUpdateMenus = async (discountId: number, menuIds: number[]) => {
    const toastId = toast.loading("Loading...");
    const updateMenus = await apiClient({
      url: `/discounts/${discountId}`,
      data: { menus: menuIds },
      method: "PATCH",
    });

    if (updateMenus.statusCode === 200) {
      toast.success("Item successfully updated", { id: toastId });
      setViewingDiscount(null);
    } else {
      toast.error(updateMenus.message, { id: toastId });
    }
  };

  const handleViewDiscount = async (discountId: number) => {
    const toastId = toast.loading("Loading...");

    const discount = await apiClient({ url: `/discounts/${discountId}` });
    if (discount.statusCode === 200) setViewingDiscount(discount.data);

    toast.dismiss(toastId);
  };

  useEffect(() => {
    async function initialData() {
      const stand = await apiClient({ url: "/stands/me" });

      if (stand.statusCode === 404) {
        toast.error("You don't have a stand.");
        router.push("/stand/profile");
      }

      const discounts = await apiClient({ url: "/discounts" });
      if (discounts.statusCode === 200) setDiscounts(discounts.data);
      else toast.error("Failed to fetch discounts data.");

      const menus = await apiClient({ url: "/menu" });
      if (menus.statusCode === 200) setAllMenus(menus.data);
      else toast.error("Failed to fetch menus data.");
    }

    initialData();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Discounts</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          Add New Discount
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {discounts.map((discount) => (
          <DiscountCard
            key={discount.id}
            discount={discount}
            onEdit={setEditingDiscount}
            onDelete={handleDelete}
            onViewDetails={(id) => handleViewDiscount(id)}
          />
        ))}
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Discount</DialogTitle>
          </DialogHeader>
          <DiscountForm
            onSubmit={handleAdd}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {editingDiscount && (
        <Dialog
          open={!!editingDiscount}
          onOpenChange={() => setEditingDiscount(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Discount</DialogTitle>
            </DialogHeader>
            <DiscountForm
              initialData={editingDiscount}
              onSubmit={handleUpdate}
              onCancel={() => setEditingDiscount(null)}
            />
          </DialogContent>
        </Dialog>
      )}

      {viewingDiscount && (
        <Dialog
          open={!!viewingDiscount}
          onOpenChange={() => setViewingDiscount(null)}
        >
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Discount Details</DialogTitle>
            </DialogHeader>
            <DiscountDetail
              discount={viewingDiscount}
              allMenus={allMenus}
              onUpdateMenus={handleUpdateMenus}
              onClose={() => setViewingDiscount(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
