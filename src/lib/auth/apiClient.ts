import axios, { AxiosInstance, AxiosResponse } from "axios";

const DEFAULT_API_URL = "http://localhost:3000";
const API_URL = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL;

export interface ApiResponse<T> {
  status: string;
  message: string;
  statusCode: number;
  data: T | null;
}

export interface ApiResponseError {
  message: string | string[];
  statusCode: number;
  error: string;
}

const createApiClient = (token?: string): AxiosInstance => {
  const client = axios.create({
    baseURL: API_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (token) {
    client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  client.interceptors.response.use(
    (response: AxiosResponse<ApiResponse<any>>) => {
      return {
        ...response,
        data: response.data,
      };
    },
    (error) => {
      if (axios.isAxiosError(error) && error.response) {
        const errResponse = error.response.data as ApiResponseError;
        return Promise.reject(
          new Error(
            errResponse.message instanceof Array
              ? errResponse.message.join(", ")
              : errResponse.message,
          ),
        );
      }
      return Promise.reject(new Error("An unknown error occurred"));
    },
  );

  return client;
};

export default createApiClient;
