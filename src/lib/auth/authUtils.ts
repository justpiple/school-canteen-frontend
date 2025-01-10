import createApiClient from "./apiClient";
import { User } from "@/components/providers/AuthProviders";

export const login = async (
  username: string,
  password: string,
): Promise<User & { access_token: string }> => {
  const apiClient = createApiClient();

  const response = await apiClient.post("/auth/signin", {
    username,
    password,
  });
  const data = response.data;

  if (data.status === "success") {
    const { access_token, id, username, role } = data.data;
    return { access_token, id, username, role };
  } else {
    throw new Error(data);
  }
};

export const register = async (
  username: string,
  password: string,
  role: string,
): Promise<{ status: string; message: string }> => {
  const apiClient = createApiClient();
  const response = await apiClient.post("/auth/signup", {
    username,
    password,
    role,
  });
  const data = response.data;

  if (data.status === "success") {
    return data;
  } else {
    throw new Error(data.message);
  }
};

export const getSession = async (token: string): Promise<User | null> => {
  const apiClient = createApiClient(token);

  try {
    const response = await apiClient.get("/users/me");
    const data = response.data;

    if (data.status === "success") {
      return {
        id: data.data.id,
        username: data.data.username,
        role: data.data.role,
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching session:", error);
    return null;
  }
};
