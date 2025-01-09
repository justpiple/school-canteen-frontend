"use client";

import { useEffect, useState } from "react";
import { browserApiClient } from "@/lib/auth/browserApiClient";
import { ApiResponse } from "@/lib/auth/apiClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AxiosError } from "axios";
import { toast } from "sonner";

interface StandData {
  standName: string;
  ownerName: string;
  phone: string;
}

const ProfilePage = () => {
  const [standData, setStandData] = useState<StandData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<StandData>({
    standName: "",
    ownerName: "",
    phone: "",
  });

  useEffect(() => {
    const fetchStandData = async () => {
      const apiClient = browserApiClient();
      try {
        const { data: response } = await apiClient.get<ApiResponse<StandData>>(
          "/stands/me",
        );
        if (response.status === "success" && response.data) {
          setStandData(response.data);
          setFormData(response.data);
        } else {
          toast.error(response.message);
        }
      } catch (err) {
        const e = err as Error;
        toast.error(
          e.message.includes("do not")
            ? "Anda belum mengisi profil stand"
            : "Gagal mengambil data",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStandData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const toastId = toast.loading("Loading...");
    const apiClient = browserApiClient();
    try {
      let response;
      if (standData === null) {
        const { data } = await apiClient.post<ApiResponse<StandData>>(
          "/stands",
          formData,
        );
        response = data;
      } else {
        const { data } = await apiClient.patch<ApiResponse<StandData>>(
          "/stands/me",
          formData,
        );
        response = data;
      }
      if (response.status === "success") {
        setStandData(response.data);
        toast.success("Data berhasil disimpan", { id: toastId });
      } else {
        toast.error(response.message, { id: toastId });
      }
    } catch (err: any) {
      const errorMessage =
        err instanceof AxiosError
          ? err.response?.data?.message || err.message
          : err.message;
      toast.error(errorMessage, { id: toastId });
    }
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Profile Stand</h1>
        <Card className="p-4">
          <p>Loading...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Profile Stand</h1>
      <Card className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="standName" className="block">
              Stand Name
            </label>
            <Input
              type="text"
              id="standName"
              name="standName"
              value={formData.standName}
              onChange={handleChange}
              required
              autoComplete="off"
            />
          </div>
          <div>
            <label htmlFor="ownerName" className="block">
              Owner Name
            </label>
            <Input
              type="text"
              id="ownerName"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
              autoComplete="off"
              required
            />
          </div>
          <div>
            <label htmlFor="phone" className="block">
              Phone
            </label>
            <Input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              autoComplete="off"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Simpan
          </Button>
        </form>
        {error && (
          <div className="mt-4 text-red-500">
            <p>{error}</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProfilePage;
