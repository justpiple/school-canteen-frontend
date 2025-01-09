"use server";

import { cookies } from "next/headers";
import { getSession } from "./authUtils";
import { User } from "@/app/providers/AuthProviders";

export const getServerSession = async (): Promise<User | null> => {
  const userCookies = await cookies();
  const token = userCookies.get("access_token")?.value;

  if (!token) {
    return null;
  }

  return await getSession(token);
};

export const logout = async (): Promise<void> => {
  const cookie = await cookies();

  cookie.delete("access_token");
};
