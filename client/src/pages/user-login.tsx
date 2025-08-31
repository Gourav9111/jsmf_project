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
import { User, ArrowLeft, UserPlus } from "lucide-react";
import { Link } from "wouter";

interface LoginFormData {
  username: string;
  password: string;
}

interface RegisterFormData {
  username: string;
  password: string;
  email: string;
  fullName: string;
  mobileNumber: string;
  city: string;
}

export default function UserLogin() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [loginData, setLoginData] = useState<LoginFormData>({
    username: "",
    password: "",
  });
  const [registerData, setRegisterData] = useState<RegisterFormData>({
    username: "",
    password: "",
    email: "",
    fullName: "",
    mobileNumber: "",
    city: "",
  });
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      const response = await apiRequest("POST", "/api/auth/login", data);
      return await response.json();
    },
    onSuccess: (response: any) => {
      if (response.user?.role === "user") {
        toast({
          title: "Login Successful",
          description: `Welcome back, ${response.user.fullName}!`,
        });
        setLocation("/user/dashboard");
      } else {
        toast({
          title: "Access Denied",
          description: "User credentials required.",
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

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFormData) => {
      const response = await apiRequest("POST", "/api/users/register", { ...data, role: "user" });
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Registration Successful",
        description: "Account created successfully! Please login with your credentials.",
      });
      setIsRegistering(false);
      setRegisterData({
        username: "",
        password: "",
        email: "",
        fullName: "",
        mobileNumber: "",
        city: "",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Please check your information and try again.",
        variant: "destructive",
      });
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.username || !loginData.password) {
      toast({
        title: "Missing Information",
        description: "Please enter both username and password.",
        variant: "destructive",
      });
      return;
    }
    loginMutation.mutate(loginData);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerData.username || !registerData.password || !registerData.email || !registerData.fullName || !registerData.mobileNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }
    registerMutation.mutate(registerData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <Card className="shadow-2xl border-blue-200" data-testid="user-login-card">
          <CardHeader className="text-center space-y-4">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto">
              <User className="text-white text-3xl" size={32} />
            </div>
            <CardTitle className="text-2xl font-bold text-primary" data-testid="user-portal-title">
              {isRegistering ? "Create Account" : "User Portal"}
            </CardTitle>
            <p className="text-text-muted">
              {isRegistering ? "Join our platform to apply for loans" : "Apply for loans and track your applications"}
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {!isRegistering && (
              <Alert>
                <User className="h-4 w-4" />
                <AlertDescription>
                  New to our platform? Create an account to apply for loans and track your applications.
                </AlertDescription>
              </Alert>
            )}

            {isRegistering ? (
              <form onSubmit={handleRegister} className="space-y-4" data-testid="user-register-form">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={registerData.fullName}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, fullName: e.target.value }))}
                      className="focus:ring-2 focus:ring-primary"
                      data-testid="input-register-fullname"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number *</Label>
                    <Input
                      id="mobile"
                      type="tel"
                      value={registerData.mobileNumber}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, mobileNumber: e.target.value }))}
                      className="focus:ring-2 focus:ring-primary"
                      data-testid="input-register-mobile"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                    className="focus:ring-2 focus:ring-primary"
                    data-testid="input-register-email"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username *</Label>
                    <Input
                      id="username"
                      type="text"
                      value={registerData.username}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, username: e.target.value }))}
                      className="focus:ring-2 focus:ring-primary"
                      data-testid="input-register-username"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={registerData.password}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                      className="focus:ring-2 focus:ring-primary"
                      data-testid="input-register-password"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    type="text"
                    value={registerData.city}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, city: e.target.value }))}
                    className="focus:ring-2 focus:ring-primary"
                    data-testid="input-register-city"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={registerMutation.isPending}
                  className="w-full bg-primary hover:bg-blue-700 text-white py-3 font-semibold"
                  data-testid="button-register"
                >
                  {registerMutation.isPending ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleLogin} className="space-y-4" data-testid="user-login-form">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={loginData.username}
                    onChange={(e) => setLoginData(prev => ({ ...prev, username: e.target.value }))}
                    className="focus:ring-2 focus:ring-primary"
                    data-testid="input-user-username"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                    className="focus:ring-2 focus:ring-primary"
                    data-testid="input-user-password"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="w-full bg-primary hover:bg-blue-700 text-white py-3 font-semibold"
                  data-testid="button-user-login"
                >
                  {loginMutation.isPending ? "Signing In..." : "Sign In to User Portal"}
                </Button>
              </form>
            )}

            <div className="text-center pt-4 border-t space-y-3">
              <p className="text-sm text-text-muted">
                {isRegistering ? "Already have an account?" : "Don't have an account?"}
              </p>
              <Button
                variant="outline"
                onClick={() => setIsRegistering(!isRegistering)}
                className="w-full border-primary text-primary hover:bg-blue-50"
                data-testid={isRegistering ? "button-switch-login" : "button-switch-register"}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                {isRegistering ? "Sign In Instead" : "Create New Account"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
