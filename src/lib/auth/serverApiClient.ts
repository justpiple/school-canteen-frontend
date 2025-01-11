import { AxiosError, AxiosRequestConfig } from "axios";
import createApiClient, { ApiResponse } from "./apiClient";
import { cookies } from "next/headers";

export const serverApiClient = async () => {
  const userCookies = await cookies();
  const token = userCookies.get("access_token")?.value;

  return createApiClient(token);
};

export const apiClientServer = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: AxiosRequestConfig<any>,
): Promise<ApiResponse> => {
  const client = await serverApiClient();

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
