import { AppShell } from "@/components/layouts/appShell";
import { getServerSession } from "@/lib/auth/getServerSession";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

  if (!session) return redirect("/auth/login");

  return <AppShell user={session}>{children}</AppShell>;
}
