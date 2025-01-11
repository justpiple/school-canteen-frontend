"use server";

import { cookies } from "next/headers";
import { User } from "@/components/providers/AuthProviders";
import { apiClientServer } from "./serverApiClient";

const getSession = async (token: string): Promise<User | null> => {
  const response = await apiClientServer({
    method: "get",
    url: "/users/me",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === "success") {
    const { id, username, role } = response.data;
    return { id, username, role };
  }

  return null;
};

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
