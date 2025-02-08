import React, { useEffect, useState } from "react";
import { Store, AlertCircle } from "lucide-react";
import { apiClient } from "@/lib/auth/browserApiClient";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Stand, MenuItem } from "@/types/Menu";
import MenuItemCard, { MenuItemsSkeleton } from "./MenuItem";

interface StandsProps {
  stands: Stand[];
  onAddToCart: (item: MenuItem) => void;
}

const StandHeader = ({ stand }: { stand: Stand }) => (
  <div className="flex items-center gap-3 py-2">
    <div
      className={
        "bg-primary/10 p-2 rounded-lg transition-colors group-data-[state=open]:bg-primary/20"
      }
    >
      <Store className="w-5 h-5 text-primary" />
    </div>
    <div className="text-left">
      <h3 className="font-semibold text-lg">{stand.standName}</h3>
      <p className="text-sm text-muted-foreground">Stand #{stand.id}</p>
    </div>
  </div>
);

const StandContent: React.FC<{
  stand: Stand;
  onAddToCart: (item: MenuItem) => void;
}> = ({ stand, onAddToCart }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);

  const loadMenuItems = async () => {
    if (hasLoaded) return;

    setIsLoadingItems(true);
    setError(null);

    try {
      const response = await apiClient({ url: `/menu/stand/${stand.id}` });
      if (response.statusCode === 200) {
        setMenuItems(response.data);
      } else {
        setError("Failed to fetch menu items");
        toast.error("Failed to fetch menu items");
      }
    } catch {
      setError("An error occurred while fetching menu items");
      toast.error("An error occurred while fetching menu items");
    } finally {
      setIsLoadingItems(false);
      setHasLoaded(true);
    }
  };

  useEffect(() => {
    loadMenuItems();
  }, []);

  return (
    <div className="border-t">
      {isLoadingItems && <MenuItemsSkeleton />}

      {error && (
        <div className="p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      {!isLoadingItems && !error && menuItems.length === 0 && (
        <div className="p-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Items Available</AlertTitle>
            <AlertDescription>
              This stand currently has no menu items available.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {!isLoadingItems && !error && menuItems.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {menuItems.map((item) => (
            <MenuItemCard key={item.id} item={item} onAddToCart={onAddToCart} />
          ))}
        </div>
      )}
    </div>
  );
};

export const Stands: React.FC<StandsProps> = ({ stands, onAddToCart }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 bg-gradient-to-r from-primary/10 to-transparent p-4 rounded-lg">
        <Store className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold">Stands</h2>
      </div>

      <Accordion type="multiple" className="space-y-6">
        {stands.map((stand) => (
          <AccordionItem
            key={stand.id}
            value={stand.id.toString()}
            className="group border rounded-lg data-[state=open]:ring-2 data-[state=open]:ring-primary overflow-hidden"
          >
            <AccordionTrigger className="px-6 hover:no-underline hover:bg-gray-200/50 transition-colors">
              <StandHeader stand={stand} />
            </AccordionTrigger>
            <AccordionContent>
              <StandContent stand={stand} onAddToCart={onAddToCart} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default Stands;
