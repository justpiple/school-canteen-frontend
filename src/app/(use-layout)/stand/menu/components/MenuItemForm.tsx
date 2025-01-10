import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MenuItem } from "@/types/MenuItem";
import { apiClient } from "@/lib/auth/browserApiClient";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface MenuItemFormProps {
  initialData?: MenuItem;
  onSubmit: (data: MenuItem) => void;
  onCancel: () => void;
}

export function MenuItemForm({
  initialData,
  onSubmit,
  onCancel,
}: Readonly<MenuItemFormProps>) {
  const [formData, setFormData] = useState<MenuItem>(
    initialData || {
      createdAt: "",
      description: "",
      id: 0,
      name: "",
      photo: "",
      price: 0,
      standId: 1,
      type: "FOOD",
      updatedAt: "",
    },
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, type: value as "FOOD" | "DRINK" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const form = new FormData(e.target as HTMLFormElement);

      const response = await apiClient({
        method: initialData ? "PATCH" : "POST",
        url: `/menu/${initialData ? formData.id : ""}`,
        data: form,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.statusCode === 201 || response.statusCode === 200) {
        toast.success(
          `Menu item successfully ${initialData ? "updated" : "created"}!`,
        );
        onSubmit(response.data);
      } else if (Array.isArray(response.message)) {
        response.message.forEach((msg: string) => {
          toast.error(msg);
        });
      } else {
        toast.error(response?.message);
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          disabled={isSubmitting}
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          disabled={isSubmitting}
        />
      </div>
      <div>
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          required
          disabled={isSubmitting}
        />
      </div>
      <div>
        <Label htmlFor="type">Type</Label>
        <Select
          name="type"
          value={formData.type}
          onValueChange={handleSelectChange}
          disabled={isSubmitting}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="FOOD">Food</SelectItem>
            <SelectItem value="DRINK">Drink</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="photo">Photo URL</Label>
        <Input
          id="photo"
          name="photo"
          type="file"
          required={!initialData}
          accept="image/*"
          disabled={isSubmitting}
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Update" : "Create"} Menu Item
        </Button>
      </div>
    </form>
  );
}
