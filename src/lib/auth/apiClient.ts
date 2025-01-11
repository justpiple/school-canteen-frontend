import axios, { AxiosInstance } from "axios";

const DEFAULT_API_URL = "http://localhost:3000";
const API_URL = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ApiResponse<T = any> {
  status: string;
  message: string | string[];
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

  return client;
};

export default createApiClient;
