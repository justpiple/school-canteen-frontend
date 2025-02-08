import { User } from "@/components/providers/AuthProviders";
import { MainNav } from "./mainNav";
import { MobileNav } from "./mobileNav";
import { UserNav } from "./userNav";
import Link from "next/link";
import {
  Home,
  ShoppingBag,
  Utensils,
  Percent,
  UserIcon,
  ScrollText,
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

interface AppShellProps {
  children: React.ReactNode;
  user: User;
}

export function AppShell({ children, user }: Readonly<AppShellProps>) {
  const navigationItems: Record<string, NavItem[]> = {
    SUPERADMIN: [],
    STUDENT: [
      { title: "Home", href: "/student", icon: <Home className="h-5 w-5" /> },
      {
        title: "Orders",
        href: "/student/orders",
        icon: <ScrollText className="h-5 w-5" />,
      },
      {
        title: "Profile",
        href: "/student/profile",
        icon: <UserIcon className="h-5 w-5" />,
      },
    ],
    ADMIN_STAND: [
      {
        title: "Home",
        href: "/stand",
        icon: <Home className="h-5 w-5" />,
      },
      {
        title: "Orders",
        href: "/stand/orders",
        icon: <ShoppingBag className="h-5 w-5" />,
      },
      {
        title: "Menu",
        href: "/stand/menu",
        icon: <Utensils className="h-5 w-5" />,
      },
      {
        title: "Discounts",
        href: "/stand/discounts",
        icon: <Percent className="h-5 w-5" />,
      },
    ],
  };

  const items = navigationItems[user.role] || [];

  return (
    <div className="relative flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">School Canteen</span>
          </Link>
          <MainNav items={items} className="mx-6 hidden md:flex" />
          <div className="flex items-center space-x-4">
            <UserNav user={user} />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container px-4 py-6 mx-auto mb-16 md:mb-0">
          {children}
        </div>
      </main>
      <MobileNav items={items} />
    </div>
  );
}
