import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Phone, MapPin, Instagram, CheckCircle } from "lucide-react";
import logoPath from "@assets/Gemini_Generated_Image_bq4jlqbq4jlqbq4j (1)_1755873870848.png";

export default function HeroSection() {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    loanType: ""
  });
  
  const { toast } = useToast();

  const submitQuickApply = useMutation({
    mutationFn: async (data: typeof formData) => {
      return apiRequest("POST", "/api/leads", {
        name: data.name,
        mobileNumber: data.mobile,
        loanType: data.loanType,
        amount: "100000",
        city: "Bhopal",
        source: "quick-apply"
      });
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted",
        description: "We'll contact you soon with the best loan options.",
      });
      setFormData({ name: "", mobile: "", loanType: "" });
    },
    onError: () => {
      toast({
        title: "Submission Failed",
        description: "Please try again or call us directly.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile || !formData.loanType) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }
    submitQuickApply.mutate(formData);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative bg-gradient-to-br from-primary to-secondary text-white py-16">
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1926&h=1080" 
          alt="Professional business consultation" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            {/* Company Logo */}
            <div className="flex items-center justify-center lg:justify-start mb-6">
              <div className="w-20 h-20 mr-4">
                <img src={logoPath} alt="JSMF Logo" className="w-full h-full object-contain" />
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-bold text-white">Jay Shree Mahakal</h2>
                <p className="text-lg text-yellow-300">Finance Service</p>
              </div>
            </div>
            
            <div className="inline-block bg-accent-red px-4 py-2 rounded-full text-white font-semibold mb-6" data-testid="roi-badge">
              <span className="text-2xl font-bold">7.5% ROI</span> - Reducing Interest Rate
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold mb-6" data-testid="hero-title">
              Fast & Secure <span className="text-yellow-300">Loan Solutions</span>
            </h1>
            
            <p className="text-xl mb-8 opacity-90" data-testid="hero-description">
              Professional finance services in Bhopal with same-day approvals and minimum documentation.
            </p>

            {/* Key Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8" data-testid="highlights-grid">
              <div className="flex items-center space-x-3">
                <CheckCircle className="text-green-400 text-xl" />
                <span className="font-medium">Same-day Personal Loan</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="text-green-400 text-xl" />
                <span className="font-medium">Salary eligibility from ₹15k+</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="text-green-400 text-xl" />
                <span className="font-medium">Daily Business Funding</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="text-green-400 text-xl" />
                <span className="font-medium">Minimum Documents Required</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                className="bg-accent-red hover:bg-red-700 px-8 py-4 text-white font-semibold shadow-lg"
                onClick={() => scrollToSection('loans')}
                data-testid="button-apply-now"
              >
                Apply Now
              </Button>
              <Button 
                variant="outline"
                className="bg-white text-primary hover:bg-gray-100 px-8 py-4 font-semibold shadow-lg"
                onClick={() => scrollToSection('calculator')}
                data-testid="button-calculate-emi"
              >
                Calculate EMI
              </Button>
              <Button 
                className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 font-semibold shadow-lg"
                onClick={() => scrollToSection('dsa')}
                data-testid="button-become-dsa"
              >
                Become DSA Partner
              </Button>
            </div>
          </div>

          {/* Contact Info Card */}
          <Card className="bg-white bg-opacity-95 shadow-2xl text-text-dark" data-testid="contact-card">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-primary mb-6 text-center" data-testid="contact-card-title">Contact Us Today</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <MapPin className="text-accent-red text-xl" />
                  <span className="font-medium">Bhopal, Madhya Pradesh</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Phone className="text-accent-red text-xl" />
                  <span className="font-medium">+91 91626 207918</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Instagram className="text-accent-red text-xl" />
                  <span className="font-medium">@jayshreemahakalfinance</span>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-primary mb-3">Quick Apply</h4>
                <form className="space-y-3" onSubmit={handleSubmit} data-testid="quick-apply-form">
                  <Input
                    type="text" 
                    placeholder="Full Name" 
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="focus:ring-2 focus:ring-primary focus:border-transparent"
                    data-testid="input-full-name"
                  />
                  <Input
                    type="tel" 
                    placeholder="Mobile Number" 
                    value={formData.mobile}
                    onChange={(e) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
                    className="focus:ring-2 focus:ring-primary focus:border-transparent"
                    data-testid="input-mobile-number"
                  />
                  <Select value={formData.loanType} onValueChange={(value) => setFormData(prev => ({ ...prev, loanType: value }))}>
                    <SelectTrigger className="focus:ring-2 focus:ring-primary focus:border-transparent" data-testid="select-loan-type">
                      <SelectValue placeholder="Select Loan Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="personal">Personal Loan</SelectItem>
                      <SelectItem value="business">Business Loan</SelectItem>
                      <SelectItem value="home">Home Loan</SelectItem>
                      <SelectItem value="lap">Loan Against Property</SelectItem>
                      <SelectItem value="working-capital">Working Capital Loan</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-blue-700 text-white py-3 font-semibold"
                    disabled={submitQuickApply.isPending}
                    data-testid="button-get-quote"
                  >
                    {submitQuickApply.isPending ? "Submitting..." : "Get Quick Quote"}
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
