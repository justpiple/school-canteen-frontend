import createApiClient from "./apiClient";
import { parseCookies } from "nookies";

export const browserApiClient = () => {
  if (typeof window === "undefined") {
    throw new Error("browserApiClient can only be used on the client side.");
  }

  const { access_token: token } = parseCookies();

  return createApiClient(token);
};
