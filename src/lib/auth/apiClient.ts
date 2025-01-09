import axios from "axios";

const DEFAULT_API_URL = "http://localhost:3000";
const API_URL = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL;

const createApiClient = (token?: string) => {
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
