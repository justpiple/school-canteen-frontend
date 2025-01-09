"use client";

import { useState } from "react";
import { useAuth } from "@/app/providers/AuthProviders";
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
import { Utensils } from "lucide-react";
import { AxiosError } from "axios";
import Link from "next/link";

const LoginPage = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | string[] | null>([]);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await login(username, password);
      router.push("/");
    } catch (err) {
      const e = err as AxiosError;
      const message = (e.response?.data as any)?.message;
      setError(Array.isArray(message) ? message : [message || e.message]);
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
            School Canteen Login
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the ordering system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && error.length > 0 && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {Array.isArray(error) ? (
                  <ul className="list-disc pl-4">
                    {error.map((err, index) => (
                      <li key={err}>{err}</li>
                    ))}
                  </ul>
                ) : (
                  error
                )}
              </AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter your username"
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
            <Button type="submit" className="w-full">
              Log In
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center w-full">
            New student or stand?{" "}
            <Link
              href="/auth/register"
              className="text-blue-600 hover:underline"
            >
              Register here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
