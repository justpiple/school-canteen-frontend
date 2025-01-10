"use client";

import { useState } from "react";
import { useAuth } from "@/components/providers/AuthProviders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next-nprogress-bar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Utensils, GraduationCap, Store } from "lucide-react";
import Link from "next/link";

type ApiResponse = {
  status?: string;
  message: string | string[];
  error?: string;
  statusCode: number;
  data?: {
    message: string;
  };
};

const RegisterPage = () => {
  const { register } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [userType, setUserType] = useState("STUDENT");
  const router = useRouter();

  const validateForm = () => {
    const errors = [];
    if (password !== confirmPassword) {
      errors.push("Passwords do not match");
    }
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    if (!/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
      errors.push("Password must contain both letters and numbers");
    }
    return errors;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiResponse(null);

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setApiResponse({
        message: validationErrors,
        statusCode: 400,
        error: "Bad Request",
      });
      return;
    }

    try {
      const response = await register(username, password, userType);
      setApiResponse(response as any);
      if (response.status === "success") {
        setTimeout(() => router.push("/auth/login"), 2000);
      }
    } catch (err: any) {
      setApiResponse(err?.response?.data);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/5 via-accent/10 to-primary/5 backdrop-blur-3xl">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2">
            <Utensils className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Create an Account
          </CardTitle>
          <CardDescription className="text-center">
            Register to use the School Canteen Ordering system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {apiResponse && (
            <Alert
              variant={
                apiResponse.status === "success" ? "default" : "destructive"
              }
              className="mb-4"
            >
              <AlertTitle>
                {apiResponse.status === "success" ? "Success" : "Error"}
              </AlertTitle>
              <AlertDescription>
                {Array.isArray(apiResponse.message) ? (
                  <ul className="list-disc pl-4">
                    {apiResponse.message.map((msg) => (
                      <li key={msg}>{msg}</li>
                    ))}
                  </ul>
                ) : (
                  apiResponse.message
                )}
              </AlertDescription>
            </Alert>
          )}
          <Tabs
            defaultValue="STUDENT"
            onValueChange={(value) => setUserType(value)}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="STUDENT">
                <GraduationCap className="mr-2 h-4 w-4" />
                Student
              </TabsTrigger>
              <TabsTrigger value="ADMIN_STAND">
                <Store className="mr-2 h-4 w-4" />
                Stand Owner
              </TabsTrigger>
            </TabsList>
            <TabsContent value="STUDENT">
              <p className="text-sm text-muted-foreground mb-4">
                Register as a student to place orders.
              </p>
            </TabsContent>
            <TabsContent value="ADMIN_STAND">
              <p className="text-sm text-muted-foreground mb-4">
                Register as a stand owner to manage your menu and orders.
              </p>
            </TabsContent>
          </Tabs>
          <form onSubmit={handleRegister} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder={`Enter your username`}
                autoComplete="off"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm your password"
              />
            </div>
            <Button type="submit" className="w-full">
              Register
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center w-full">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-blue-600 hover:underline">
              Log in here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterPage;
