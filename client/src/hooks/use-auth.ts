import { useQuery } from "@tanstack/react-query";

export interface AuthUser {
  id: string;
  username: string;
  role: string;
  fullName: string;
  email: string;
}

export function useAuth() {
  const { data: user, isLoading, error } = useQuery<AuthUser>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isDSA: user?.role === "dsa",
    isUser: user?.role === "user",
  };
}
