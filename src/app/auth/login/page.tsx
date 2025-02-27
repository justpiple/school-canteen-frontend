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
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { AxiosError } from "axios";
import Link from "next/link";

const LoginPage = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | string[] | null>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(username, password);
      router.push("/");
    } catch (err) {
      const e = err as AxiosError;
      const message = (e.response?.data as any)?.message;
      setError(Array.isArray(message) ? message : [message || e.message]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/5 via-accent/10 to-primary/5 backdrop-blur-3xl">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2">
            <Image
              src={"/logo-large.png"}
              alt="Logo"
              className="w-20 h-20"
              width={100}
              height={100}
            />
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
                    {error.map((err) => (
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
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Log In"
              )}
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
