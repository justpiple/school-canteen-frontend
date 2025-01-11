import { apiClient } from "./browserApiClient";
import { User } from "@/components/providers/AuthProviders";

export const login = async (username: string, password: string) => {
  const response = await apiClient({
    method: "post",
    url: "/auth/signin",
    data: {
      username,
      password,
    },
  });

  return response;
};

export const register = async (
  username: string,
  password: string,
  role: string,
) => {
  const response = await apiClient({
    method: "post",
    url: "/auth/signup",
    data: {
      username,
      password,
      role,
    },
  });

  return response;
};

export const getSession = async (token: string): Promise<User | null> => {
  const response = await apiClient({
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
