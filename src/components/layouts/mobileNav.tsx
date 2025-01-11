"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/atomics";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

interface MobileNavProps {
  items: NavItem[];
}

export function MobileNav({ items }: Readonly<MobileNavProps>) {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t">
      <div className="flex justify-around items-center h-16">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full text-sm font-medium transition-colors",
              pathname === item.href
                ? "text-primary"
                : "text-muted-foreground hover:text-primary",
            )}
          >
            {item.icon}
            <span className="mt-1">{item.title}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
