"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  children?: NavItem[];
}

interface MainNavProps {
  items: NavItem[];
  className?: string;
}

export function MainNav({ items, className }: Readonly<MainNavProps>) {
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState<string | null>(null);

  return (
    <NavigationMenu className={cn("hidden md:flex", className)}>
      <NavigationMenuList className="space-x-2">
        {items.map((item) => (
          <NavigationMenuItem key={item.href}>
            {item.children ? (
              <>
                <NavigationMenuTrigger
                  className={cn(
                    "px-4 py-2 text-sm font-medium transition-colors hover:text-primary",
                    pathname.startsWith(item.href) && "text-primary",
                  )}
                >
                  {item.icon}
                  <span className="ml-2">{item.title}</span>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-3 p-4 md:w-[300px] md:grid-cols-2">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={child.href}
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                              pathname === child.href &&
                                "bg-accent text-accent-foreground",
                            )}
                          >
                            {child.icon}
                            <span className="ml-2">{child.title}</span>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </>
            ) : (
              <Link href={item.href} legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(
                    "inline-flex items-center px-4 py-2 text-sm font-medium transition-colors hover:text-primary",
                    pathname === item.href && "text-primary",
                  )}
                  onMouseEnter={() => setActiveItem(item.href)}
                  onMouseLeave={() => setActiveItem(null)}
                >
                  {item.icon}
                  <span className="ml-2">{item.title}</span>
                  {activeItem === item.href && (
                    <span className="absolute bottom-0 left-0 h-1 w-full" />
                  )}
                </NavigationMenuLink>
              </Link>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
