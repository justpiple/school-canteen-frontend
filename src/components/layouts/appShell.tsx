import { User } from "@/components/providers/AuthProviders";
import { MainNav } from "./mainNav";
import { MobileNav } from "./mobileNav";
import { UserNav } from "./userNav";
import Link from "next/link";

interface AppShellProps {
  children: React.ReactNode;
  user: User;
}

export function AppShell({ children, user }: Readonly<AppShellProps>) {
  const navigationItems = {
    SUPERADMIN: [],
    STUDENT: [
      { title: "Beranda", href: "/" },
      { title: "Pesanan", href: "/orders" },
      { title: "Favorit", href: "/favorites" },
    ],
    ADMIN_STAND: [
      { title: "Dashboard", href: "/seller" },
      { title: "Menu", href: "/seller/menu" },
      { title: "Pesanan", href: "/seller/orders" },
    ],
  };

  const items = navigationItems[user.role];

  return (
    <div className="relative flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center space-x-4">
            <MobileNav items={items} />
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl">Food App</span>
            </Link>
          </div>
          <MainNav items={items} className="mx-6 hidden md:flex" />
          <div className="flex items-center space-x-4">
            <UserNav user={user} />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container px-4 py-6 md:px-6 md:py-8 lg:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
