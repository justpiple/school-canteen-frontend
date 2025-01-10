import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { Discount } from "@/types/Discount";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface DiscountFormProps {
  initialData?: Discount;
  onSubmit: (data: Discount) => void;
  onCancel: () => void;
}

export function DiscountForm({
  initialData,
  onSubmit,
  onCancel,
}: Readonly<DiscountFormProps>) {
  const [formData, setFormData] = useState<Discount>(
    initialData || {
      id: 0,
      standId: 1,
      name: "",
      percentage: 0,
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
    },
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "percentage" ? parseInt(value || "0") : value,
    }));
  };

  const handleDateChange = (
    date: Date | undefined,
    field: "startDate" | "endDate",
  ) => {
    if (date) {
      setFormData((prev) => ({ ...prev, [field]: date.toISOString() }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);

      if (endDate < startDate) {
        toast.error("End date must be after start date");
        return;
      }

      onSubmit(formData);
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Discount Name</Label>
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
        <Label htmlFor="percentage">Discount Percentage</Label>
        <Input
          id="percentage"
          name="percentage"
          type="number"
          min="0"
          max="100"
          value={formData.percentage}
          onChange={handleChange}
          required
          disabled={isSubmitting}
        />
      </div>
      <div>
        <Label htmlFor="startDate">Start Date</Label>
        <DatePicker
          id="startDate"
          date={new Date(formData.startDate)}
          onSelect={(date) => handleDateChange(date, "startDate")}
        />
      </div>
      <div>
        <Label htmlFor="endDate">End Date</Label>
        <DatePicker
          id="endDate"
          date={new Date(formData.endDate)}
          onSelect={(date) => handleDateChange(date, "endDate")}
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
          {initialData ? "Update" : "Create"} Discount
        </Button>
      </div>
    </form>
  );
}
