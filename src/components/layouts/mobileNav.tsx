import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";

interface MobileNavProps {
  items: { title: string; href: string }[];
}

export function MobileNav({ items }: Readonly<MobileNavProps>) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full max-w-xs">
        <SheetHeader className="px-4 py-6">
          <SheetTitle className="text-lg font-bold">Menu</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="flex flex-col space-y-2 px-4 py-2">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-md px-4 py-2.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
              >
                {item.title}
              </Link>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
