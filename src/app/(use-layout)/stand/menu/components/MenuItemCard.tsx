import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { MenuItem } from "@/types/MenuItem";
import { confirm } from "@/utils/confirm";

interface MenuItemCardProps {
  item: MenuItem;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: number) => void;
}

export function MenuItemCard({
  item,
  onEdit,
  onDelete,
}: Readonly<MenuItemCardProps>) {
  async function handleDelete() {
    const isConfirmed = await confirm({
      title: "Delete Menu Item",
      description: `Are you sure you want to delete "${item.name}"? This action cannot be undone.`,
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
    });

    if (isConfirmed) {
      onDelete(item.id);
    }
  }

  return (
    <Card className="w-full max-w-sm flex flex-col">
      <CardHeader>
        <CardTitle>{item.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between">
        <div className="relative h-48 w-full">
          <Image
            src={item.photo}
            alt={item.name}
            layout="fill"
            objectFit="cover"
            className="rounded-md"
          />
        </div>
        <div className="flex-grow">
          <p className="text-sm text-muted-foreground">{item.description}</p>
          <p className="font-bold">Rp {item.price.toLocaleString()}</p>
          <p className="text-sm">{item.type}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => onEdit(item)}>
          Edit
        </Button>
        <Button variant="destructive" onClick={handleDelete}>
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
