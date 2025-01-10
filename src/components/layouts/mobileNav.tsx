import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Menu, LogOut } from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

interface MobileNavProps {
  items: NavItem[];
}

export function MobileNav({ items }: Readonly<MobileNavProps>) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full max-w-xs p-0">
        <SheetHeader className="px-6 py-4">
          <SheetTitle className="text-xl font-bold">Canteen App</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="flex flex-col py-2">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center px-6 py-3 text-sm font-medium transition-colors hover:bg-primary hover:text-accent-foreground"
              >
                {item.icon}
                {item.title}
              </Link>
            ))}
          </div>
        </ScrollArea>
        <Separator />
        <SheetFooter className="px-6 py-4">
          <Button variant="outline" className="w-full hover:bg-primary" asChild>
            <Link href="/logout" className="flex items-center justify-center">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Link>
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
