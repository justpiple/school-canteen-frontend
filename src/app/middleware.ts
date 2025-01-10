import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/getServerSession";
import { User } from "@/components/providers/AuthProviders";

export const middleware = async (req: NextRequest) => {
  const session: User | null = await getServerSession();
  const { pathname } = req.nextUrl;

  const isAuthPage =
    pathname === "/auth/login" || pathname === "/auth/register";
  if (!session) {
    return isAuthPage
      ? NextResponse.next()
      : NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (isAuthPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const unauthorizedRedirect = NextResponse.rewrite(
    new URL("/unauthorized", req.url),
  );
  const rolePaths: Record<User["role"], string> = {
    SUPERADMIN: "/admin",
    STUDENT: "/student",
    ADMIN_STAND: "/stand",
  };

  for (const [role, path] of Object.entries(rolePaths)) {
    if (pathname.startsWith(path) && session.role !== role) {
      return unauthorizedRedirect;
    }
  }

  return NextResponse.next();
};

export const config = {
  matcher: [
    "/admin/:path*",
    "/student/:path*",
    "/stand/:path*",
    "/auth/login",
    "/auth/register",
  ],
};
