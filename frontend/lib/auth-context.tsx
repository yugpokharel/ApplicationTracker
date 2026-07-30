"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { User } from "@/types";
import { api, setToken } from "./api";
import toast from "react-hot-toast";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: "login" | "register" | "mfa";
  pendingMfaEmail: string | null;
  openAuthModal: (mode?: "login" | "register") => void;
  closeAuthModal: () => void;
  login: (token: string, user: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "register" | "mfa">("login");
  const [pendingMfaEmail, setPendingMfaEmail] = useState<string | null>(null);

  const refreshUser = useCallback(async () => {
    try {
      const res = await api.auth.me();
      setUser(res.data.user);
    } catch {
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const openAuthModal = (mode: "login" | "register" = "login") => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setPendingMfaEmail(null);
  };

  const login = (token: string, userData: User) => {
    setToken(token);
    setUser(userData);
    setIsAuthModalOpen(false);
    toast.success(`Welcome back, ${userData.name}!`);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    toast.success("Logged out successfully.");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthModalOpen,
        authModalMode,
        pendingMfaEmail,
        openAuthModal,
        closeAuthModal,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
