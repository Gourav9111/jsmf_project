import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { LoanApplication, DsaPartner, Lead, ContactQuery } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  FileText, 
  TrendingUp, 
  Shield, 
  LogOut,
  Eye,
  UserPlus,
  CheckCircle,
  XCircle,
  Clock,
  Download
} from "lucide-react";

export default function AdminDashboard() {
  const { user, isLoading, isAuthenticated, isAdmin } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Removed access denied check - allow anyone to access admin dashboard for now
  useEffect(() => {
    console.log('Admin Dashboard - Auth State:', { isLoading, isAuthenticated, isAdmin, user });
  }, [isLoading, isAuthenticated, isAdmin, user]);

  // Fetch data
  const { data: applications = [] } = useQuery<LoanApplication[]>({
    queryKey: ["/api/loan-applications"],
    enabled: isAdmin,
  });

  const { data: dsaPartners = [] } = useQuery<DsaPartner[]>({
    queryKey: ["/api/dsa-partners"],
    enabled: isAdmin,
  });

  const { data: leads = [] } = useQuery<Lead[]>({
    queryKey: ["/api/leads"],
    enabled: isAdmin,
  });

  const { data: contactQueries = [] } = useQuery<ContactQuery[]>({
    queryKey: ["/api/contact-queries"],
    enabled: isAdmin,
  });

  // Mutations
  const updateApplicationMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      return apiRequest("PATCH", `/api/loan-applications/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/loan-applications"] });
      toast({
        title: "Application Updated",
        description: "Application status has been updated successfully.",
      });
    },
  });

  const assignLeadMutation = useMutation({
    mutationFn: async ({ leadId, dsaId }: { leadId: string; dsaId: string }) => {
      return apiRequest("PATCH", `/api/leads/${leadId}/assign`, { dsaId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
      toast({
        title: "Lead Assigned",
        description: "Lead has been assigned to DSA partner successfully.",
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
      setLocation("/admin");
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleExport = async (type: 'loan-applications' | 'leads' | 'dsa-partners') => {
    try {
      const response = await fetch(`/api/export/${type}`, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Export failed');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${type}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Export Successful",
        description: `${type.replace('-', ' ')} data has been downloaded.`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Unable to download data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-500", text: "Pending" },
      approved: { color: "bg-green-500", text: "Approved" },
      rejected: { color: "bg-red-500", text: "Rejected" },
      "under-review": { color: "bg-blue-500", text: "Under Review" },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge className={`${config.color} text-white`}>{config.text}</Badge>;
  };

  const stats = [
    {
      title: "Total Applications",
      value: applications.length,
      icon: FileText,
      color: "text-blue-600",
    },
    {
      title: "DSA Partners",
      value: dsaPartners.length,
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Active Leads",
      value: leads.filter((lead: any) => lead.status !== "closed").length,
      icon: TrendingUp,
      color: "text-purple-600",
    },
    {
      title: "Pending Queries",
      value: contactQueries.filter((query: any) => query.status === "new").length,
      icon: Clock,
      color: "text-orange-600",
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

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-bg-light">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-red-600" />
              <div>
                <h1 className="text-xl font-bold text-text-dark" data-testid="dashboard-title">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-text-muted">Welcome back, {user?.fullName}</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="text-red-600 border-red-600 hover:bg-red-50"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" data-testid="stats-grid">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-text-muted">{stat.title}</p>
                      <p className="text-2xl font-bold text-text-dark" data-testid={`stat-value-${index}`}>
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="applications" data-testid="tab-applications">Applications</TabsTrigger>
            <TabsTrigger value="leads" data-testid="tab-leads">Leads</TabsTrigger>
            <TabsTrigger value="dsa" data-testid="tab-dsa">DSA Partners</TabsTrigger>
            <TabsTrigger value="queries" data-testid="tab-queries">Queries</TabsTrigger>
          </TabsList>

          {/* Loan Applications */}
          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Loan Applications</CardTitle>
                  <Button
                    onClick={() => handleExport('loan-applications')}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    data-testid="button-export-applications"
                  >
                    <Download className="w-4 h-4" />
                    Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4" data-testid="applications-list">
                  {applications.length === 0 ? (
                    <p className="text-center text-text-muted py-8">No loan applications found.</p>
                  ) : (
                    applications.map((app: any) => (
                      <div key={app.id} className="border rounded-lg p-4 space-y-3" data-testid={`application-${app.id}`}>
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
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-text-muted">
                            Applied: {new Date(app.createdAt).toLocaleDateString()}
                          </p>
                          <div className="flex space-x-2">
                            <Select
                              value={app.status}
                              onValueChange={(value) => 
                                updateApplicationMutation.mutate({ id: app.id, updates: { status: value } })
                              }
                            >
                              <SelectTrigger className="w-40">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="under-review">Under Review</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leads Management */}
          <TabsContent value="leads">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Lead Management</CardTitle>
                  <Button
                    onClick={() => handleExport('leads')}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    data-testid="button-export-leads"
                  >
                    <Download className="w-4 h-4" />
                    Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4" data-testid="leads-list">
                  {leads.length === 0 ? (
                    <p className="text-center text-text-muted py-8">No leads found.</p>
                  ) : (
                    leads.map((lead: any) => (
                      <div key={lead.id} className="border rounded-lg p-4 space-y-3" data-testid={`lead-${lead.id}`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-text-dark">{lead.name}</h4>
                            <p className="text-sm text-text-muted">
                              {lead.mobileNumber} • {lead.loanType} • ₹{parseInt(lead.amount || '0').toLocaleString('en-IN')}
                            </p>
                          </div>
                          <Badge variant="outline" className="capitalize">
                            {lead.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-text-muted">
                            {lead.assignedDsaId ? "Assigned" : "Unassigned"}
                          </p>
                          {!lead.assignedDsaId && (
                            <Select
                              onValueChange={(value) => 
                                assignLeadMutation.mutate({ leadId: lead.id, dsaId: value })
                              }
                            >
                              <SelectTrigger className="w-48">
                                <SelectValue placeholder="Assign to DSA" />
                              </SelectTrigger>
                              <SelectContent>
                                {dsaPartners.map((dsa: any) => (
                                  <SelectItem key={dsa.userId} value={dsa.userId}>
                                    DSA Partner {dsa.userId.slice(0, 8)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* DSA Partners */}
          <TabsContent value="dsa">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>DSA Partners</CardTitle>
                  <Button
                    onClick={() => handleExport('dsa-partners')}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    data-testid="button-export-dsa"
                  >
                    <Download className="w-4 h-4" />
                    Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4" data-testid="dsa-partners-list">
                  {dsaPartners.length === 0 ? (
                    <p className="text-center text-text-muted py-8">No DSA partners found.</p>
                  ) : (
                    dsaPartners.map((partner: any) => (
                      <div key={partner.id} className="border rounded-lg p-4 space-y-3" data-testid={`dsa-partner-${partner.id}`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-text-dark">
                              DSA Partner {partner.userId.slice(0, 8)}
                            </h4>
                            <p className="text-sm text-text-muted">
                              Experience: {partner.experience} • Commission: {partner.commissionRate}%
                            </p>
                          </div>
                          <Badge variant="outline" className="capitalize">
                            {partner.kycStatus}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-text-muted">Total Leads:</span>
                            <span className="font-semibold ml-1">{partner.totalLeads}</span>
                          </div>
                          <div>
                            <span className="text-text-muted">Successful:</span>
                            <span className="font-semibold ml-1">{partner.successfulLeads}</span>
                          </div>
                          <div>
                            <span className="text-text-muted">Earnings:</span>
                            <span className="font-semibold ml-1">₹{parseInt(partner.totalEarnings).toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Queries */}
          <TabsContent value="queries">
            <Card>
              <CardHeader>
                <CardTitle>Contact Queries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4" data-testid="contact-queries-list">
                  {contactQueries.length === 0 ? (
                    <p className="text-center text-text-muted py-8">No contact queries found.</p>
                  ) : (
                    contactQueries.map((query: any) => (
                      <div key={query.id} className="border rounded-lg p-4 space-y-3" data-testid={`query-${query.id}`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-text-dark">{query.name}</h4>
                            <p className="text-sm text-text-muted">
                              {query.mobileNumber} • {query.loanType || 'General Inquiry'}
                            </p>
                          </div>
                          <Badge variant="outline" className="capitalize">
                            {query.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-text-dark">{query.message}</p>
                        <p className="text-xs text-text-muted">
                          Submitted: {new Date(query.createdAt).toLocaleDateString()}
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
