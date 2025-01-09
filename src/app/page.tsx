"use server";
import { getServerSession } from "@/lib/auth/getServerSession";
import { notFound, redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession();

  if (!session) return redirect("/auth/login");

  if (session.role === "STUDENT") return redirect("/student");
  else if (session.role === "ADMIN_STAND") return redirect("/stand");

  return notFound();
}
