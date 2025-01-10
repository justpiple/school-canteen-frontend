"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  login as loginUtil,
  register as registerUtil,
  getSession as getSessionUtil,
} from "@/lib/auth/authUtils";
import { logout as logoutUtil } from "@/lib/auth/getServerSession";
import { setCookie, parseCookies } from "nookies";

export enum Role {
  STUDENT = "STUDENT",
  ADMIN_STAND = "ADMIN_STAND",
  SUPERADMIN = "SUPERADMIN",
}
export interface User {
  id: string;
  username: string;
  role: Role;
}

const LOGIN_PATH = "/auth/login";

interface AuthContextType {
  user: User | null;
  state: "AUTHENTICATED" | "LOADING" | "LOGGED_OUT";
  login: (username: string, password: string) => Promise<User>;
  register: (
    username: string,
    password: string,
    role: string,
  ) => Promise<{ status: string; message: string }>;
  getSession: () => Promise<User | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [state, setState] = useState<AuthContextType["state"]>("LOADING");

  useEffect(() => {
    const initializeSession = async () => {
      const userData = await getSession();

      if (!userData) {
        setState("LOGGED_OUT");

        if (window.location.pathname !== LOGIN_PATH) {
          setTimeout(() => {
            window.location.href = LOGIN_PATH;
          }, 2000);
        }
        return;
      }

      setUser(userData);
      setState("AUTHENTICATED");
    };

    initializeSession();
  }, []);

  const login = async (username: string, password: string): Promise<User> => {
    const { access_token, id, role } = await loginUtil(username, password);

    setCookie(null, "access_token", access_token, { path: "/" });
    const loggedInUser = { id, username, role };
    setUser(loggedInUser);
    setState("AUTHENTICATED");

    return loggedInUser;
  };

  const register = async (
    username: string,
    password: string,
    role: string,
  ): Promise<{ status: string; message: string }> => {
    return registerUtil(username, password, role);
  };

  const getSession = async (): Promise<User | null> => {
    const { access_token: token } = parseCookies();
    if (!token) return null;

    const session = await getSessionUtil(token);
    if (!session) {
      logout();
      return null;
    }

    return session;
  };

  const logout = () => {
    logoutUtil();
    setUser(null);
    setState("LOGGED_OUT");

    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  return (
    <AuthContext.Provider
      value={{ user, state, login, register, getSession, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
