import { AxiosError, AxiosRequestConfig } from "axios";
import createApiClient, { ApiResponse } from "./apiClient";
import { parseCookies } from "nookies";

export const browserApiClient = () => {
  if (typeof window === "undefined") {
    throw new Error("browserApiClient can only be used on the client side.");
  }

  const { access_token: token } = parseCookies();

  return createApiClient(token);
};

export const apiClient = async (
  config: AxiosRequestConfig<any>,
): Promise<ApiResponse> => {
  const client = browserApiClient();

  try {
    const { data: response } = await client(config);

    return response as ApiResponse;
  } catch (err) {
    if (err instanceof AxiosError && err.response?.data) {
      return err.response.data as ApiResponse;
    } else {
      throw err;
    }
  }
};
