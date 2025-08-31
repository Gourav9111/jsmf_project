import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, User, IndianRupee } from "lucide-react";

interface DirectLoanApplicationProps {
  loanType: string;
  onApply: () => void;
}

export default function DirectLoanApplication({ loanType, onApply }: DirectLoanApplicationProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    applicantInfo: {
      fullName: "",
      mobileNumber: "",
      email: "",
      city: ""
    },
    loanType: loanType.toLowerCase().replace(/\s+/g, '-'),
    amount: "",
    tenure: "",
    monthlyIncome: "",
    employmentType: "",
    purpose: ""
  });

  const handleInputChange = (field: string, value: string, isApplicantInfo = false) => {
    if (isApplicantInfo) {
      setFormData(prev => ({
        ...prev,
        applicantInfo: {
          ...prev.applicantInfo,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/loan-applications/direct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setTrackingNumber(result.trackingNumber);
        setIsSuccess(true);
        alert("Application submitted successfully! Your tracking ID is: " + result.trackingNumber);
      } else {
        alert("Failed to submit application: " + (result.message || "Unknown error"));
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center space-y-4 p-6">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
        <div>
          <p className="text-lg font-semibold mb-2">Your {loanType} application has been submitted</p>
          <p className="text-sm text-gray-600 mb-4">
            You can track your application status using your mobile number
          </p>
          <div className="bg-gray-100 p-3 rounded">
            <p className="text-xs text-gray-500">Tracking ID:</p>
            <p className="font-mono font-bold">{trackingNumber}</p>
          </div>
        </div>
        <Button onClick={() => {
          setIsSuccess(false);
          setTrackingNumber("");
        }} className="w-full">
          Apply for Another Loan
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Apply for {loanType}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Applicant Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.applicantInfo.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value, true)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="mobileNumber">Mobile Number *</Label>
                  <Input
                    id="mobileNumber"
                    value={formData.applicantInfo.mobileNumber}
                    onChange={(e) => handleInputChange('mobileNumber', e.target.value, true)}
                    placeholder="Enter mobile number"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.applicantInfo.email}
                    onChange={(e) => handleInputChange('email', e.target.value, true)}
                    placeholder="Enter email address"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.applicantInfo.city}
                    onChange={(e) => handleInputChange('city', e.target.value, true)}
                    placeholder="Enter your city"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Loan Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IndianRupee className="w-4 h-4" />
                Loan Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Loan Type</Label>
                  <Input value={loanType} disabled />
                </div>
                <div>
                  <Label htmlFor="amount">Loan Amount (₹)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    placeholder="Enter loan amount"
                  />
                </div>
                <div>
                  <Label htmlFor="tenure">Tenure (Months)</Label>
                  <Input
                    id="tenure"
                    type="number"
                    value={formData.tenure}
                    onChange={(e) => handleInputChange('tenure', e.target.value)}
                    placeholder="Enter tenure in months"
                  />
                </div>
                <div>
                  <Label htmlFor="monthlyIncome">Monthly Income (₹)</Label>
                  <Input
                    id="monthlyIncome"
                    type="number"
                    value={formData.monthlyIncome}
                    onChange={(e) => handleInputChange('monthlyIncome', e.target.value)}
                    placeholder="Enter monthly income"
                  />
                </div>
                <div>
                  <Label htmlFor="employmentType">Employment Type</Label>
                  <Select value={formData.employmentType} onValueChange={(value) => handleInputChange('employmentType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select employment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="salaried">Salaried</SelectItem>
                      <SelectItem value="self-employed">Self Employed</SelectItem>
                      <SelectItem value="business">Business Owner</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="purpose">Loan Purpose</Label>
                <Textarea
                  id="purpose"
                  value={formData.purpose}
                  onChange={(e) => handleInputChange('purpose', e.target.value)}
                  placeholder="Brief description of loan purpose"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onApply}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </form>
    </div>
  );
}