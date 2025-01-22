"use client";

import { useEffect, useState } from "react";
import { browserApiClient } from "@/lib/auth/browserApiClient";
import { ApiResponse } from "@/lib/auth/apiClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AxiosError } from "axios";
import { toast } from "sonner";
import FormField from "@/components/ui/form-field";
import { Loader2, Store, User } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProviders";
import { removeEmptyObjects } from "@/utils/atomics";

interface StandData {
  standName: string;
  ownerName: string;
  phone: string;
}

interface UserData {
  username: string;
  password: string;
}

function StandForm({
  formData,
  onChange,
  onSubmit,
  isSubmitting,
}: Readonly<{
  formData: StandData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isSubmitting: boolean;
}>) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormField label="Stand Name" htmlFor="standName" required>
        <Input
          type="text"
          id="standName"
          name="standName"
          value={formData.standName}
          onChange={onChange}
          required
          autoComplete="off"
          disabled={isSubmitting}
        />
      </FormField>

      <FormField label="Owner Name" htmlFor="ownerName" required>
        <Input
          type="text"
          id="ownerName"
          name="ownerName"
          value={formData.ownerName}
          onChange={onChange}
          autoComplete="off"
          required
          disabled={isSubmitting}
        />
      </FormField>

      <FormField label="Phone Number" htmlFor="phone" required>
        <Input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={onChange}
          autoComplete="off"
          required
          disabled={isSubmitting}
        />
      </FormField>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save Stand Data
      </Button>
    </form>
  );
}

function UserForm({
  userData,
  onChange,
  onSubmit,
  isSubmitting,
}: Readonly<{
  userData: UserData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isSubmitting: boolean;
}>) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormField label="Username" htmlFor="username" required>
        <Input
          type="text"
          id="username"
          name="username"
          value={userData.username}
          onChange={onChange}
          required
          autoComplete="off"
          disabled={isSubmitting}
        />
      </FormField>

      <FormField
        label="New Password"
        htmlFor="password"
        helpText="Leave blank if you do not want to change the password"
      >
        <Input
          type="password"
          id="password"
          name="password"
          value={userData.password}
          onChange={onChange}
          autoComplete="new-password"
          disabled={isSubmitting}
        />
      </FormField>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save User Data
      </Button>
    </form>
  );
}

// Main Profile Page Component
const ProfilePage = () => {
  const { user } = useAuth();
  const [standData, setStandData] = useState<StandData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<StandData>({
    standName: "",
    ownerName: "",
    phone: "",
  });
  const [userData, setUserData] = useState<UserData>({
    username: "",
    password: "",
  });

  useEffect(() => {
    setUserData((prev) => ({ ...prev, username: user?.username || "" }));
  }, [user]);

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
          e.message.includes("404")
            ? "Please fill stand profile"
            : "Failed to fetch data",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStandData();
  }, []);

  const handleStandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const toastId = toast.loading("Menyimpan data stand...");
    const apiClient = browserApiClient();
    const cleanedFormData = removeEmptyObjects(formData);
    try {
      let response;
      if (standData === null) {
        const { data } = await apiClient.post<ApiResponse<StandData>>(
          "/stands",
          cleanedFormData,
        );
        response = data;
      } else {
        const { data } = await apiClient.patch<ApiResponse<StandData>>(
          "/stands/me",
          cleanedFormData,
        );
        response = data;
      }
      if (response.status === "success") {
        setStandData(response.data);
        toast.success("Data stand berhasil disimpan", { id: toastId });
      } else {
        toast.error(response.message, { id: toastId });
      }
    } catch (err: any) {
      const errorMessage =
        err instanceof AxiosError
          ? err.response?.data?.message || err.message
          : err.message;
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const toastId = toast.loading("Memperbarui data user...");
    const apiClient = browserApiClient();
    const cleanedUserData = removeEmptyObjects(userData);
    try {
      const { data: response } = await apiClient.patch<ApiResponse<UserData>>(
        "/users/me",
        cleanedUserData,
      );

      if (response.status === "success") {
        toast.success("Data user berhasil diperbarui", { id: toastId });
        setUserData((prev) => ({ ...prev, password: "" }));
      } else {
        toast.error(response.message, { id: toastId });
      }
    } catch (err: any) {
      const errorMessage =
        err instanceof AxiosError
          ? err.response?.data?.message || err.message
          : err.message;
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container max-w-md mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        <Card className="p-4">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <Tabs defaultValue="stand" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="stand" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            Stand
          </TabsTrigger>
          <TabsTrigger value="user" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            User
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stand">
          <Card className="p-4">
            <StandForm
              formData={formData}
              onChange={handleStandChange}
              onSubmit={handleStandSubmit}
              isSubmitting={isSubmitting}
            />
          </Card>
        </TabsContent>

        <TabsContent value="user">
          <Card className="p-4">
            <UserForm
              userData={userData}
              onChange={handleUserChange}
              onSubmit={handleUserSubmit}
              isSubmitting={isSubmitting}
            />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
