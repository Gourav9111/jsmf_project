import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { DsaPartner, Lead, LoanApplication } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Handshake, 
  LogOut,
  TrendingUp,
  Users,
  IndianRupee,
  Target,
  Phone,
  Mail,
  MapPin
} from "lucide-react";

export default function DsaDashboard() {
  const { user, isLoading, isAuthenticated, isDSA } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isDSA)) {
      toast({
        title: "Access Denied",
        description: "DSA access required.",
        variant: "destructive",
      });
      setLocation("/dsa");
    }
  }, [isLoading, isAuthenticated, isDSA, setLocation, toast]);

  // Fetch data
  const { data: dsaProfile } = useQuery<DsaPartner>({
    queryKey: ["/api/dsa-partners/profile"],
    enabled: isDSA,
  });

  const { data: assignedLeads = [] } = useQuery<Lead[]>({
    queryKey: ["/api/leads"],
    enabled: isDSA,
  });

  const { data: applications = [] } = useQuery<LoanApplication[]>({
    queryKey: ["/api/loan-applications"],
    enabled: isDSA,
  });

  // Mutations
  const updateLeadMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      return apiRequest("PATCH", `/api/leads/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
      toast({
        title: "Lead Updated",
        description: "Lead status has been updated successfully.",
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
      setLocation("/dsa");
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      new: { color: "bg-blue-500", text: "New" },
      contacted: { color: "bg-yellow-500", text: "Contacted" },
      qualified: { color: "bg-green-500", text: "Qualified" },
      converted: { color: "bg-purple-500", text: "Converted" },
      closed: { color: "bg-gray-500", text: "Closed" },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.new;
    return <Badge className={`${config.color} text-white`}>{config.text}</Badge>;
  };

  const stats = [
    {
      title: "Total Leads",
      value: dsaProfile?.totalLeads || 0,
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Successful Conversions",
      value: dsaProfile?.successfulLeads || 0,
      icon: Target,
      color: "text-green-600",
    },
    {
      title: "Total Earnings",
      value: `₹${parseInt(dsaProfile?.totalEarnings || '0').toLocaleString('en-IN')}`,
      icon: IndianRupee,
      color: "text-purple-600",
    },
    {
      title: "Commission Rate",
      value: `${dsaProfile?.commissionRate || 0}%`,
      icon: TrendingUp,
      color: "text-orange-600",
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-light flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-muted">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isDSA) {
    return null;
  }

  return (
    <div className="min-h-screen bg-bg-light">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Handshake className="w-8 h-8 text-yellow-600" />
              <div>
                <h1 className="text-xl font-bold text-text-dark" data-testid="dsa-dashboard-title">
                  DSA Dashboard
                </h1>
                <p className="text-sm text-text-muted">Welcome back, {user?.fullName}</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="text-yellow-600 border-yellow-600 hover:bg-yellow-50"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" data-testid="dsa-stats-grid">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-text-muted">{stat.title}</p>
                      <p className="text-2xl font-bold text-text-dark" data-testid={`dsa-stat-value-${index}`}>
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

        {/* Profile Card */}
        {dsaProfile && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Handshake className="w-5 h-5" />
                <span>DSA Profile</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-text-dark mb-2">Experience</h4>
                  <p className="text-text-muted">{dsaProfile.experience || 'Not specified'}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-text-dark mb-2">KYC Status</h4>
                  <Badge variant="outline" className="capitalize">
                    {dsaProfile.kycStatus}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-semibold text-text-dark mb-2">Partner Since</h4>
                  <p className="text-text-muted">
                    {dsaProfile.createdAt ? new Date(dsaProfile.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
              {dsaProfile.background && (
                <div className="mt-4">
                  <h4 className="font-semibold text-text-dark mb-2">Background</h4>
                  <p className="text-text-muted">{dsaProfile.background}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <Tabs defaultValue="leads" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="leads" data-testid="tab-dsa-leads">My Leads</TabsTrigger>
            <TabsTrigger value="applications" data-testid="tab-dsa-applications">Applications</TabsTrigger>
          </TabsList>

          {/* Assigned Leads */}
          <TabsContent value="leads">
            <Card>
              <CardHeader>
                <CardTitle>Assigned Leads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4" data-testid="dsa-leads-list">
                  {assignedLeads.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-text-muted">No leads assigned yet.</p>
                      <p className="text-sm text-text-muted mt-2">
                        New leads will appear here when assigned by admin.
                      </p>
                    </div>
                  ) : (
                    assignedLeads.map((lead: any) => (
                      <div key={lead.id} className="border rounded-lg p-4 space-y-3" data-testid={`dsa-lead-${lead.id}`}>
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <h4 className="font-semibold text-text-dark">{lead.name}</h4>
                            <div className="space-y-1 text-sm text-text-muted">
                              <div className="flex items-center space-x-2">
                                <Phone className="w-4 h-4" />
                                <span>{lead.mobileNumber}</span>
                              </div>
                              {lead.email && (
                                <div className="flex items-center space-x-2">
                                  <Mail className="w-4 h-4" />
                                  <span>{lead.email}</span>
                                </div>
                              )}
                              {lead.city && (
                                <div className="flex items-center space-x-2">
                                  <MapPin className="w-4 h-4" />
                                  <span>{lead.city}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          {getStatusBadge(lead.status)}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-text-muted">Loan Type:</span>
                            <span className="font-semibold ml-1 capitalize">{lead.loanType}</span>
                          </div>
                          <div>
                            <span className="text-text-muted">Amount:</span>
                            <span className="font-semibold ml-1">
                              ₹{parseInt(lead.amount || '0').toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t">
                          <p className="text-xs text-text-muted">
                            Assigned: {new Date(lead.assignedAt).toLocaleDateString()}
                          </p>
                          <Select
                            value={lead.status}
                            onValueChange={(value) => 
                              updateLeadMutation.mutate({ id: lead.id, updates: { status: value } })
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">New</SelectItem>
                              <SelectItem value="contacted">Contacted</SelectItem>
                              <SelectItem value="qualified">Qualified</SelectItem>
                              <SelectItem value="converted">Converted</SelectItem>
                              <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Applications */}
          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle>Loan Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4" data-testid="dsa-applications-list">
                  {applications.length === 0 ? (
                    <div className="text-center py-12">
                      <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-text-muted">No applications from your leads yet.</p>
                      <p className="text-sm text-text-muted mt-2">
                        Applications from converted leads will appear here.
                      </p>
                    </div>
                  ) : (
                    applications.map((app: any) => (
                      <div key={app.id} className="border rounded-lg p-4 space-y-3" data-testid={`dsa-application-${app.id}`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-text-dark capitalize">
                              {app.loanType.replace('-', ' ')} Loan
                            </h4>
                            <p className="text-sm text-text-muted">
                              Amount: ₹{parseInt(app.amount || '0').toLocaleString('en-IN')}
                            </p>
                          </div>
                          <Badge variant="outline" className="capitalize">
                            {app.status}
                          </Badge>
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
                        <p className="text-xs text-text-muted">
                          Applied: {new Date(app.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
