import createApiClient from "./apiClient";
import { cookies } from "next/headers";

export const serverApiClient = async () => {
  const userCookies = await cookies();
  const token = userCookies.get("access_token")?.value;

  return createApiClient(token);
};
