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
import { Label } from "@/components/ui/label";
import { Loader2, User, GraduationCap } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProviders";
import { removeEmptyObjects } from "@/utils/atomics";

interface StudentData {
  id?: string;
  name: string;
  address: string;
  phone: string;
  photo?: string;
  userId?: string;
}

interface UserData {
  username: string;
  password: string;
}

const ProfilePage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<StudentData>({
    name: "",
    address: "",
    phone: "",
  });
  const [userData, setUserData] = useState<UserData>({
    username: "",
    password: "",
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [newStudent, setNewStudent] = useState(false);

  useEffect(() => {
    setUserData((prev) => ({ ...prev, username: user?.username || "" }));
  }, [user]);

  useEffect(() => {
    const fetchStudentData = async () => {
      const apiClient = browserApiClient();
      try {
        const { data: response } = await apiClient.get<
          ApiResponse<StudentData>
        >("/students/me");
        if (response.status === "success" && response.data) {
          setFormData(response.data);
          if (response.data.photo) {
            setPhotoPreview(response.data.photo);
          }
        } else {
          toast.error(response.message);
        }
      } catch (err) {
        console.log(err);
        const e = err as Error;
        if (e.message.includes("404")) {
          toast.error("Profile not found.");
          setNewStudent(true);
        } else {
          toast.error("Failed to fetch data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  const handleStudentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setPhotoPreview(URL.createObjectURL(file)); // Preview the selected photo
    }
  };

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const toastId = toast.loading("Saving student data...");
    const apiClient = browserApiClient();

    try {
      const form = new FormData(e.target as HTMLFormElement);
      let response;

      if (newStudent) {
        const { data } = await apiClient.post<ApiResponse<StudentData>>(
          "/students",
          form,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        response = data;
      } else {
        const { data } = await apiClient.patch<ApiResponse<StudentData>>(
          "/students/me",
          form,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        response = data;
      }

      if (response.status === "success") {
        toast.success("Student data saved successfully", { id: toastId });
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

    const toastId = toast.loading("Updating user data...");
    const apiClient = browserApiClient();
    const cleanedUserData = removeEmptyObjects(userData);
    try {
      const { data: response } = await apiClient.patch<ApiResponse<UserData>>(
        "/users/me",
        cleanedUserData,
      );

      if (response.status === "success") {
        toast.success("User data updated successfully", { id: toastId });
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
      <Tabs defaultValue="student" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="student" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Student
          </TabsTrigger>
          <TabsTrigger value="user" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            User
          </TabsTrigger>
        </TabsList>

        <TabsContent value="student">
          <Card className="p-4">
            <form onSubmit={handleStudentSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleStudentChange}
                  required
                  autoComplete="off"
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleStudentChange}
                  autoComplete="off"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleStudentChange}
                  autoComplete="off"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="photo">Photo</Label>
                <Input
                  type="file"
                  id="photo"
                  name="photo"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  disabled={isSubmitting}
                  className="cursor-pointer"
                />
                {photoPreview && (
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="mt-2 h-32 w-32 rounded-md object-cover"
                  />
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Student Data
              </Button>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="user">
          <Card className="p-4">
            <form onSubmit={handleUserSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  type="text"
                  id="username"
                  name="username"
                  value={userData.username}
                  onChange={handleUserChange}
                  required
                  autoComplete="off"
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  value={userData.password}
                  onChange={handleUserChange}
                  autoComplete="new-password"
                  disabled={isSubmitting}
                />
                <p className="text-sm text-muted-foreground">
                  Leave blank if you don&lsquo;t want to change the password
                </p>
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save User Data
              </Button>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
