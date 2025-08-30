import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Handshake, ArrowLeft, UserPlus } from "lucide-react";
import { Link } from "wouter";

interface LoginFormData {
  username: string;
  password: string;
}

export default function DsaLogin() {
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
  });
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      return apiRequest("POST", "/api/auth/login", data);
    },
    onSuccess: async (response: any) => {
      if (response.user?.role === "dsa" || response.user?.role === "admin") {
        // Update the query cache with the logged in user data
        queryClient.setQueryData(["/api/auth/user"], response.user);
        // Force refetch to ensure data is fresh
        await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
        toast({
          title: "Login Successful",
          description: `Welcome back, ${response.user.fullName}!`,
        });
        // Small delay to ensure state is updated
        setTimeout(() => {
          setLocation("/dsa/dashboard");
        }, 100);
      } else {
        toast({
          title: "Access Denied",
          description: "DSA credentials required.",
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

  const scrollToDSASection = () => {
    setLocation("/");
    setTimeout(() => {
      const element = document.getElementById('dsa');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <Link href="/" className="inline-flex items-center text-yellow-600 hover:text-yellow-700 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <Card className="shadow-2xl border-yellow-200" data-testid="dsa-login-card">
          <CardHeader className="text-center space-y-4">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto">
              <Handshake className="text-white text-3xl" size={32} />
            </div>
            <CardTitle className="text-2xl font-bold text-yellow-600" data-testid="dsa-login-title">
              DSA Portal
            </CardTitle>
            <p className="text-text-muted">
              Direct Sales Agent dashboard access
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <Alert>
              <UserPlus className="h-4 w-4" />
              <AlertDescription>
                New to DSA program? Register below to get started with our partnership program.
              </AlertDescription>
            </Alert>

            <form onSubmit={handleSubmit} className="space-y-4" data-testid="dsa-login-form">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  className="focus:ring-2 focus:ring-yellow-500"
                  data-testid="input-dsa-username"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="focus:ring-2 focus:ring-yellow-500"
                  data-testid="input-dsa-password"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-3 font-semibold"
                data-testid="button-dsa-login"
              >
                {loginMutation.isPending ? "Signing In..." : "Sign In to DSA Portal"}
              </Button>
            </form>

            <div className="text-center pt-4 border-t space-y-3">
              <p className="text-sm text-text-muted">
                Don't have an account?
              </p>
              <Button
                variant="outline"
                onClick={scrollToDSASection}
                className="w-full border-yellow-500 text-yellow-600 hover:bg-yellow-50"
                data-testid="button-register-dsa"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Register as DSA Partner
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
