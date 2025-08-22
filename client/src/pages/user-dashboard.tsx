import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { LoanApplication } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  LogOut,
  FileText,
  PlusCircle,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp
} from "lucide-react";

interface LoanApplicationData {
  loanType: string;
  amount: string;
  tenure: string;
  monthlyIncome: string;
  employmentType: string;
  purpose: string;
}

export default function UserDashboard() {
  const { user, isLoading, isAuthenticated, isUser } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationData, setApplicationData] = useState<LoanApplicationData>({
    loanType: "",
    amount: "",
    tenure: "",
    monthlyIncome: "",
    employmentType: "",
    purpose: "",
  });

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isUser)) {
      toast({
        title: "Access Denied",
        description: "User access required.",
        variant: "destructive",
      });
      setLocation("/user");
    }
  }, [isLoading, isAuthenticated, isUser, setLocation, toast]);

  // Fetch user's applications
  const { data: applications = [] } = useQuery<LoanApplication[]>({
    queryKey: ["/api/loan-applications"],
    enabled: isUser,
  });

  // Mutations
  const submitApplicationMutation = useMutation({
    mutationFn: async (data: LoanApplicationData) => {
      return apiRequest("POST", "/api/loan-applications", {
        loanType: data.loanType,
        amount: data.amount,
        tenure: parseInt(data.tenure),
        monthlyIncome: data.monthlyIncome,
        employmentType: data.employmentType,
        purpose: data.purpose,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/loan-applications"] });
      toast({
        title: "Application Submitted",
        description: "Your loan application has been submitted successfully.",
      });
      setShowApplicationForm(false);
      setApplicationData({
        loanType: "",
        amount: "",
        tenure: "",
        monthlyIncome: "",
        employmentType: "",
        purpose: "",
      });
    },
    onError: () => {
      toast({
        title: "Submission Failed",
        description: "Failed to submit loan application. Please try again.",
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/auth/logout", {});
    },
    onSuccess: () => {
      toast({
        title: "Logged Out",
        description: "You have been logged out successfully.",
      });
      setLocation("/user");
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicationData.loanType || !applicationData.amount || !applicationData.tenure || !applicationData.monthlyIncome || !applicationData.employmentType) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }
    submitApplicationMutation.mutate(applicationData);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-500", text: "Pending", icon: Clock },
      approved: { color: "bg-green-500", text: "Approved", icon: CheckCircle },
      rejected: { color: "bg-red-500", text: "Rejected", icon: XCircle },
      "under-review": { color: "bg-blue-500", text: "Under Review", icon: Clock },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const IconComponent = config.icon;
    return (
      <Badge className={`${config.color} text-white flex items-center space-x-1`}>
        <IconComponent className="w-3 h-3" />
        <span>{config.text}</span>
      </Badge>
    );
  };

  const stats = [
    {
      title: "Total Applications",
      value: applications.length,
      icon: FileText,
      color: "text-blue-600",
    },
    {
      title: "Approved",
      value: applications.filter((app: any) => app.status === "approved").length,
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Pending",
      value: applications.filter((app: any) => app.status === "pending" || app.status === "under-review").length,
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      title: "Total Amount",
      value: `₹${applications.reduce((sum: number, app: any) => sum + parseInt(app.amount || '0'), 0).toLocaleString('en-IN')}`,
      icon: TrendingUp,
      color: "text-purple-600",
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-light flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-muted">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-bg-light">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <User className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-text-dark" data-testid="user-dashboard-title">
                  User Dashboard
                </h1>
                <p className="text-sm text-text-muted">Welcome back, {user?.fullName}</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="text-primary border-primary hover:bg-blue-50"
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" data-testid="user-stats-grid">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-text-muted">{stat.title}</p>
                      <p className="text-2xl font-bold text-text-dark" data-testid={`user-stat-value-${index}`}>
                        {stat.value}
                      </p>
                    </div>
                    <IconComponent className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="applications" data-testid="tab-user-applications">My Applications</TabsTrigger>
            <TabsTrigger value="apply" data-testid="tab-user-apply">Apply for Loan</TabsTrigger>
          </TabsList>

          {/* Applications List */}
          <TabsContent value="applications">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Your Loan Applications</CardTitle>
                <Button
                  onClick={() => setShowApplicationForm(true)}
                  className="bg-primary hover:bg-blue-700"
                  data-testid="button-new-application"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  New Application
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4" data-testid="user-applications-list">
                  {applications.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-text-muted">No loan applications yet.</p>
                      <p className="text-sm text-text-muted mt-2">
                        Click "New Application" to get started with your loan application.
                      </p>
                    </div>
                  ) : (
                    applications.map((app: any) => (
                      <div key={app.id} className="border rounded-lg p-4 space-y-3" data-testid={`user-application-${app.id}`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-text-dark capitalize">
                              {app.loanType.replace('-', ' ')} Loan
                            </h4>
                            <p className="text-sm text-text-muted">
                              Amount: ₹{parseInt(app.amount || '0').toLocaleString('en-IN')}
                            </p>
                          </div>
                          {getStatusBadge(app.status)}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-text-muted">Tenure:</span>
                            <span className="font-semibold ml-1">{app.tenure} months</span>
                          </div>
                          <div>
                            <span className="text-text-muted">Interest Rate:</span>
                            <span className="font-semibold ml-1">{app.interestRate}%</span>
                          </div>
                        </div>

                        {app.purpose && (
                          <div className="text-sm">
                            <span className="text-text-muted">Purpose:</span>
                            <span className="ml-1">{app.purpose}</span>
                          </div>
                        )}

                        <div className="flex justify-between items-center pt-2 border-t">
                          <p className="text-xs text-text-muted">
                            Applied: {new Date(app.createdAt).toLocaleDateString()}
                          </p>
                          {app.remarks && (
                            <p className="text-xs text-accent-red">{app.remarks}</p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Loan Application Form */}
          <TabsContent value="apply">
            <Card>
              <CardHeader>
                <CardTitle>Apply for a New Loan</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitApplication} className="space-y-6" data-testid="loan-application-form">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="loanType">Loan Type *</Label>
                      <Select value={applicationData.loanType} onValueChange={(value) => setApplicationData(prev => ({ ...prev, loanType: value }))}>
                        <SelectTrigger data-testid="select-loan-type">
                          <SelectValue placeholder="Select loan type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="personal">Personal Loan</SelectItem>
                          <SelectItem value="business">Business Loan</SelectItem>
                          <SelectItem value="home">Home Loan</SelectItem>
                          <SelectItem value="lap">Loan Against Property</SelectItem>
                          <SelectItem value="working-capital">Working Capital Loan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="amount">Loan Amount (₹) *</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="Enter loan amount"
                        value={applicationData.amount}
                        onChange={(e) => setApplicationData(prev => ({ ...prev, amount: e.target.value }))}
                        className="focus:ring-2 focus:ring-primary"
                        data-testid="input-loan-amount"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tenure">Tenure (Months) *</Label>
                      <Input
                        id="tenure"
                        type="number"
                        placeholder="Enter tenure in months"
                        value={applicationData.tenure}
                        onChange={(e) => setApplicationData(prev => ({ ...prev, tenure: e.target.value }))}
                        className="focus:ring-2 focus:ring-primary"
                        data-testid="input-loan-tenure"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="monthlyIncome">Monthly Income (₹) *</Label>
                      <Input
                        id="monthlyIncome"
                        type="number"
                        placeholder="Enter monthly income"
                        value={applicationData.monthlyIncome}
                        onChange={(e) => setApplicationData(prev => ({ ...prev, monthlyIncome: e.target.value }))}
                        className="focus:ring-2 focus:ring-primary"
                        data-testid="input-monthly-income"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="employmentType">Employment Type *</Label>
                      <Select value={applicationData.employmentType} onValueChange={(value) => setApplicationData(prev => ({ ...prev, employmentType: value }))}>
                        <SelectTrigger data-testid="select-employment-type">
                          <SelectValue placeholder="Select employment type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="salaried">Salaried</SelectItem>
                          <SelectItem value="self-employed">Self-Employed</SelectItem>
                          <SelectItem value="business">Business Owner</SelectItem>
                          <SelectItem value="freelancer">Freelancer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="purpose">Purpose of Loan</Label>
                    <Textarea
                      id="purpose"
                      placeholder="Please describe the purpose of your loan"
                      value={applicationData.purpose}
                      onChange={(e) => setApplicationData(prev => ({ ...prev, purpose: e.target.value }))}
                      className="focus:ring-2 focus:ring-primary resize-none"
                      rows={3}
                      data-testid="textarea-loan-purpose"
                    />
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-primary mb-2">Important Information</h4>
                    <ul className="text-sm text-text-muted space-y-1">
                      <li>• Our special interest rate: 7.5% reducing</li>
                      <li>• Minimum documentation required</li>
                      <li>• Same-day approval for eligible applicants</li>
                      <li>• Minimum salary requirement: ₹15,000 (Cash salary: ₹8,000)</li>
                    </ul>
                  </div>

                  <Button
                    type="submit"
                    disabled={submitApplicationMutation.isPending}
                    className="w-full bg-primary hover:bg-blue-700 text-white py-3 font-semibold text-lg"
                    data-testid="button-submit-application"
                  >
                    {submitApplicationMutation.isPending ? "Submitting Application..." : "Submit Loan Application"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
