import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Shield, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

interface LoginFormData {
  username: string;
  password: string;
}

export default function AdminLogin() {
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
  });
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      return apiRequest("POST", "/api/auth/login", data);
    },
    onSuccess: (response: any) => {
      if (response.user?.role === "admin") {
        toast({
          title: "Login Successful",
          description: `Welcome back, ${response.user.fullName}!`,
        });
        setLocation("/admin/dashboard");
      } else {
        toast({
          title: "Access Denied",
          description: "Admin credentials required.",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Login Failed",
        description: "Invalid username or password.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      toast({
        title: "Missing Information",
        description: "Please enter both username and password.",
        variant: "destructive",
      });
      return;
    }
    loginMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <Link href="/" className="inline-flex items-center text-red-600 hover:text-red-700 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <Card className="shadow-2xl border-red-200" data-testid="admin-login-card">
          <CardHeader className="text-center space-y-4">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto">
              <Shield className="text-white text-3xl" size={32} />
            </div>
            <CardTitle className="text-2xl font-bold text-red-600" data-testid="admin-login-title">
              Admin Portal
            </CardTitle>
            <p className="text-text-muted">
              Secure access to administration dashboard
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Default credentials: <strong>admin</strong> / <strong>admin123</strong>
              </AlertDescription>
            </Alert>

            <form onSubmit={handleSubmit} className="space-y-4" data-testid="admin-login-form">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter admin username"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  className="focus:ring-2 focus:ring-red-500"
                  data-testid="input-admin-username"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter admin password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="focus:ring-2 focus:ring-red-500"
                  data-testid="input-admin-password"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 font-semibold"
                data-testid="button-admin-login"
              >
                {loginMutation.isPending ? "Signing In..." : "Sign In to Admin Portal"}
              </Button>
            </form>

            <div className="text-center pt-4 border-t">
              <p className="text-sm text-text-muted">
                Need access? Contact system administrator
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
