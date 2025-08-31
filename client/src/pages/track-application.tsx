import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Search, ArrowLeft, FileText } from "lucide-react";
import { Link } from "wouter";

export default function TrackApplication() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [searchMobile, setSearchMobile] = useState("");
  const { toast } = useToast();

  const { data: applications, isLoading, error } = useQuery({
    queryKey: ["/api/applications/track", searchMobile],
    enabled: !!searchMobile,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileNumber.trim()) {
      toast({
        title: "Mobile Number Required",
        description: "Please enter your mobile number to track applications.",
        variant: "destructive",
      });
      return;
    }
    setSearchMobile(mobileNumber.trim());
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-800",
      "under-review": "bg-blue-100 text-blue-800", 
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back to Home */}
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <Card className="shadow-xl border-blue-200 mb-6" data-testid="track-search-card">
          <CardHeader className="text-center space-y-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
              <Search className="text-white text-3xl" size={32} />
            </div>
            <CardTitle className="text-2xl font-bold text-blue-600" data-testid="track-title">
              Track Your Application
            </CardTitle>
            <p className="text-gray-600">
              Enter your mobile number to check the status of your loan applications
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4" data-testid="track-form">
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input
                  id="mobile"
                  type="tel"
                  placeholder="Enter your mobile number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="focus:ring-2 focus:ring-blue-500"
                  data-testid="input-track-mobile"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 font-semibold"
                data-testid="button-track-search"
              >
                {isLoading ? "Searching..." : "Track Applications"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {searchMobile && (
          <Card className="shadow-xl border-blue-200" data-testid="track-results-card">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-blue-600">
                Applications for {searchMobile}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Searching for your applications...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-600">Error loading applications. Please try again.</p>
                </div>
              ) : applications && Array.isArray(applications) && applications.length > 0 ? (
                <div className="space-y-4">
                  {applications.map((app: any) => (
                    <div key={app.id} className="border border-gray-200 rounded-lg p-4" data-testid={`application-${app.id}`}>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-lg capitalize">{app.loanType} Loan</h3>
                          <p className="text-gray-600">Application ID: {app.id.slice(0, 8)}...</p>
                        </div>
                        <Badge className={getStatusBadge(app.status)} data-testid={`status-${app.id}`}>
                          {app.status.replace('-', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Amount:</span> ₹{app.amount || 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">Applied:</span> {new Date(app.createdAt).toLocaleDateString('en-IN')}
                        </div>
                        {app.tenure && (
                          <div>
                            <span className="font-medium">Tenure:</span> {app.tenure} months
                          </div>
                        )}
                        {app.interestRate && (
                          <div>
                            <span className="font-medium">Interest Rate:</span> {app.interestRate}%
                          </div>
                        )}
                      </div>
                      
                      {app.remarks && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-md">
                          <p className="text-sm text-gray-700">
                            <strong>Remarks:</strong> {app.remarks}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No applications found for this mobile number.</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Make sure you've entered the correct mobile number used during application.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}