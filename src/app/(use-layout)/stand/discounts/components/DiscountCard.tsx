import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { confirm } from "@/utils/confirm";
import { format } from "date-fns";
import { Discount } from "@/types/Discount";

interface DiscountCardProps {
  discount: Discount;
  onEdit: (discount: Discount) => void;
  onDelete: (id: number) => void;
  onViewDetails: (id: number) => void;
}

export function DiscountCard({
  discount,
  onEdit,
  onDelete,
  onViewDetails,
}: Readonly<DiscountCardProps>) {
  const handleDeleteClick = async () => {
    const isConfirmed = await confirm({
      title: "Delete Discount",
      description: `Are you sure you want to delete "${discount.name}"? This action cannot be undone.`,
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
    });

    if (isConfirmed) {
      onDelete(discount.id);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{discount.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="font-bold">{discount.percentage}% Off</p>
        <p className="text-sm text-muted-foreground">
          Valid from {format(discount.startDate, "MMMM dd, yyyy")} to{" "}
          {format(discount.endDate, "MMMM dd, yyyy")}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => onViewDetails(discount.id)}>
          View Details
        </Button>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => onEdit(discount)}>
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDeleteClick}>
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
