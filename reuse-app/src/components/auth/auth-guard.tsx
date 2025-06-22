"use client";

import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/router";
import type React from "react";
import { useEffect, useState } from "react";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export function AuthGuard({ children, requireAuth = false, redirectTo }: AuthGuardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, token, setLoading } = useAuthStore();
  const router = useRouter;

  useEffect(() => {
    const checkAuth = async () => {

    };
  });

  return <>{children}</>;
}