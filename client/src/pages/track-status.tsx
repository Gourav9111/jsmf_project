import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Search, Phone, Calendar, IndianRupee, MapPin, User, Clock, CheckCircle, AlertCircle, XCircle } from "lucide-react";

interface Lead {
  id: string;
  name: string;
  mobileNumber: string;
  email: string;
  loanType: string;
  amount: string;
  city: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function TrackStatus() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new':
      case 'pending':
        return 'bg-yellow-500';
      case 'processing':
        return 'bg-blue-500';
      case 'approved':
        return 'bg-green-500';
      case 'completed':
        return 'bg-green-600';
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new':
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'processing':
        return <AlertCircle className="w-4 h-4" />;
      case 'approved':
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileNumber.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(`/api/applications/track/${encodeURIComponent(mobileNumber)}`);
      const result = await response.json();
      
      if (response.ok) {
        setLeads(result);
      } else {
        setLeads([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setLeads([]);
    } finally {
      setIsSearching(false);
      setHasSearched(true);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount: string) => {
    if (!amount || amount === "0") return "Not specified";
    return `₹${parseInt(amount).toLocaleString('en-IN')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Track Your Application</h1>
          <p className="text-gray-600">Enter your mobile number to check the status of your loan applications</p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Search Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input
                  id="mobile"
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="Enter your mobile number"
                  required
                />
              </div>
              <div className="flex items-end">
                <Button type="submit" disabled={isSearching}>
                  {isSearching ? "Searching..." : "Search"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {hasSearched && (
          <div>
            {leads.length > 0 ? (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Found {leads.length} application{leads.length > 1 ? 's' : ''}
                </h2>
                {leads.map((lead) => (
                  <Card key={lead.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {lead.loanType.charAt(0).toUpperCase() + lead.loanType.slice(1)} Loan
                          </h3>
                          <p className="text-sm text-gray-500">Application ID: {lead.id}</p>
                        </div>
                        <Badge className={`${getStatusColor(lead.status)} text-white flex items-center gap-1`}>
                          {getStatusIcon(lead.status)}
                          {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">{lead.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">{lead.mobileNumber}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <IndianRupee className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">{formatAmount(lead.amount)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">{lead.city}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">Applied: {formatDate(lead.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">Updated: {formatDate(lead.updatedAt)}</span>
                        </div>
                      </div>

                      {/* Status Timeline */}
                      <div className="border-t pt-4">
                        <h4 className="font-medium text-gray-900 mb-2">Application Progress</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Submitted</span>
                          </div>
                          <div className="w-8 h-px bg-gray-300"></div>
                          <div className="flex items-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${
                              ['processing', 'approved', 'completed'].includes(lead.status.toLowerCase()) 
                                ? 'bg-green-500' 
                                : 'bg-gray-300'
                            }`}></div>
                            <span>Under Review</span>
                          </div>
                          <div className="w-8 h-px bg-gray-300"></div>
                          <div className="flex items-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${
                              ['approved', 'completed'].includes(lead.status.toLowerCase()) 
                                ? 'bg-green-500' 
                                : 'bg-gray-300'
                            }`}></div>
                            <span>Approved</span>
                          </div>
                          <div className="w-8 h-px bg-gray-300"></div>
                          <div className="flex items-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${
                              lead.status.toLowerCase() === 'completed' 
                                ? 'bg-green-500' 
                                : 'bg-gray-300'
                            }`}></div>
                            <span>Completed</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Found</h3>
                  <p className="text-gray-600">
                    No loan applications found for the mobile number {mobileNumber}.
                    <br />
                    Please check the number and try again.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}