"use client";

import { useState } from "react";
import { useAuth } from "@/app/providers/AuthProviders";
import { Button } from "@/components/ui/button";
import { useRouter } from "next-nprogress-bar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LogOut, AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const LogoutPage = () => {
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      logout();
      setLogoutMessage("You have been successfully logged out.");
      setTimeout(() => router.push("/auth/login"), 2000);
    } catch (error) {
      setLogoutMessage(
        "An error occurred while logging out. Please try again.",
      );
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/5 via-accent/10 to-primary/5 backdrop-blur-3xl">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Logout
          </CardTitle>
          <CardDescription className="text-center">
            Are you sure you want to log out of the School Canteen Ordering
            System?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {logoutMessage && (
            <Alert>
              <AlertDescription>{logoutMessage}</AlertDescription>
            </Alert>
          )}
          <p className="text-center text-muted-foreground">
            Logging out will end your current session. You'll need to log in
            again to place orders or manage your account.
          </p>
          <Button
            onClick={() => setShowConfirmDialog(true)}
            disabled={isLoggingOut}
            className="w-full bg-red-500 hover:bg-red-400"
          >
            <LogOut className="mr-2 h-4 w-4" />
            {isLoggingOut ? "Logging out..." : "Logout"}
          </Button>
        </CardContent>
        <CardFooter className="justify-center">
          <Button variant="ghost" onClick={() => router.back()}>
            Cancel and go back
          </Button>
        </CardFooter>
      </Card>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will log you out of the School Canteen Ordering
              System. You will need to log in again to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-500"
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              Yes, log me out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LogoutPage;
