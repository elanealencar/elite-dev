"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type {
  AuthUser,
  LoginResponse,
} from "@/types/auth";

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  setSession: (data: LoginResponse) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(
  null
);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<AuthUser | null>(
    null
  );
  const [token, setToken] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem(
      "elite_token"
    );

    const savedUser = localStorage.getItem(
      "elite_user"
    );

    if (savedToken && savedUser) {
      setToken(savedToken);

      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("elite_token");
        localStorage.removeItem("elite_user");
      }
    }

    setLoading(false);
  }, []);

  function setSession(data: LoginResponse) {
    setToken(data.token);
    setUser(data.user);

    localStorage.setItem(
      "elite_token",
      data.token
    );

    localStorage.setItem(
      "elite_user",
      JSON.stringify(data.user)
    );
  }

  function logout() {
    setToken(null);
    setUser(null);

    localStorage.removeItem("elite_token");
    localStorage.removeItem("elite_user");
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        setSession,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return context;
}