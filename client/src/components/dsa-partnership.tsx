import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { IndianRupee, TrendingUp, Users, GraduationCap, Upload } from "lucide-react";

interface DSAFormData {
  fullName: string;
  email: string;
  mobile: string;
  username: string;
  password: string;
  city: string;
  experience: string;
  background: string;
  agreed: boolean;
}

export default function DSAPartnership() {
  const [formData, setFormData] = useState<DSAFormData>({
    fullName: "",
    email: "",
    mobile: "",
    username: "",
    password: "",
    city: "",
    experience: "",
    background: "",
    agreed: false,
  });

  const { toast } = useToast();

  const registerDSA = useMutation({
    mutationFn: async (data: DSAFormData) => {
      const userData = {
        username: data.username,
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        mobileNumber: data.mobile,
        city: data.city,
      };

      const partnerData = {
        experience: data.experience,
        background: data.background,
      };

      return apiRequest("POST", "/api/dsa-partners", { userData, partnerData });
    },
    onSuccess: () => {
      toast({
        title: "Registration Successful",
        description: "Welcome to our DSA program! You can now login to your portal.",
      });
      setFormData({
        fullName: "",
        email: "",
        mobile: "",
        username: "",
        password: "",
        city: "",
        experience: "",
        background: "",
        agreed: false,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreed) {
      toast({
        title: "Agreement Required",
        description: "Please agree to the terms and conditions.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.fullName || !formData.email || !formData.mobile || !formData.username || !formData.password || !formData.city) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }

    registerDSA.mutate(formData);
  };

  const benefits = [
    {
      icon: IndianRupee,
      title: "Attractive Commission Structure",
      description: "Earn competitive commissions on every successful loan disbursement with transparent payout terms."
    },
    {
      icon: TrendingUp,
      title: "Marketing Support",
      description: "Get comprehensive marketing materials, training, and ongoing support to grow your business."
    },
    {
      icon: Users,
      title: "Dedicated Support Team",
      description: "Access to dedicated relationship managers and technical support for seamless operations."
    },
    {
      icon: GraduationCap,
      title: "Training & Certification",
      description: "Regular training programs and certification to keep you updated with latest products and processes."
    }
  ];

  return (
    <section id="dsa" className="py-16 bg-gradient-to-r from-yellow-400 to-orange-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 text-white">
          <h2 className="text-4xl font-bold mb-4" data-testid="dsa-title">
            Become a DSA Partner
          </h2>
          <p className="text-xl max-w-3xl mx-auto opacity-90" data-testid="dsa-description">
            Join our Direct Sales Agent program and earn attractive commissions by connecting customers with the right loan products.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* DSA Benefits */}
          <div className="text-white" data-testid="dsa-benefits">
            <h3 className="text-3xl font-bold mb-8">Why Partner with Us?</h3>
            <div className="space-y-6">
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <div key={index} className="flex items-start space-x-4" data-testid={`benefit-item-${index}`}>
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <IconComponent className="text-2xl" size={24} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">{benefit.title}</h4>
                      <p className="opacity-90">{benefit.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* DSA Registration Form */}
          <Card className="shadow-2xl" data-testid="dsa-registration-form">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-text-dark mb-6 text-center">
                DSA Registration Form
              </h3>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    type="text"
                    placeholder="Full Name *"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    className="focus:ring-2 focus:ring-yellow-500"
                    data-testid="input-dsa-fullname"
                    required
                  />
                  <Input
                    type="email"
                    placeholder="Email Address *"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="focus:ring-2 focus:ring-yellow-500"
                    data-testid="input-dsa-email"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    type="tel"
                    placeholder="Mobile Number *"
                    value={formData.mobile}
                    onChange={(e) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
                    className="focus:ring-2 focus:ring-yellow-500"
                    data-testid="input-dsa-mobile"
                    required
                  />
                  <Select value={formData.experience} onValueChange={(value) => setFormData(prev => ({ ...prev, experience: value }))}>
                    <SelectTrigger className="focus:ring-2 focus:ring-yellow-500" data-testid="select-dsa-experience">
                      <SelectValue placeholder="Select Experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-1">0-1 Years</SelectItem>
                      <SelectItem value="1-3">1-3 Years</SelectItem>
                      <SelectItem value="3-5">3-5 Years</SelectItem>
                      <SelectItem value="5+">5+ Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    type="text"
                    placeholder="Username *"
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    className="focus:ring-2 focus:ring-yellow-500"
                    data-testid="input-dsa-username"
                    required
                  />
                  <Input
                    type="password"
                    placeholder="Password *"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="focus:ring-2 focus:ring-yellow-500"
                    data-testid="input-dsa-password"
                    required
                  />
                </div>

                <Input
                  type="text"
                  placeholder="City *"
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  className="focus:ring-2 focus:ring-yellow-500"
                  data-testid="input-dsa-city"
                  required
                />
                
                <Textarea
                  placeholder="Brief background and experience"
                  rows={3}
                  value={formData.background}
                  onChange={(e) => setFormData(prev => ({ ...prev, background: e.target.value }))}
                  className="focus:ring-2 focus:ring-yellow-500 resize-none"
                  data-testid="textarea-dsa-background"
                />

                {/* KYC Upload Section */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-text-dark">Upload KYC Documents:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-yellow-500 transition-colors cursor-pointer" data-testid="upload-aadhaar">
                      <Upload className="mx-auto text-2xl text-gray-400 mb-2" />
                      <p className="text-sm text-text-muted">Upload Aadhaar Card</p>
                    </div>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-yellow-500 transition-colors cursor-pointer" data-testid="upload-pan">
                      <Upload className="mx-auto text-2xl text-gray-400 mb-2" />
                      <p className="text-sm text-text-muted">Upload PAN Card</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="dsa-terms"
                    checked={formData.agreed}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, agreed: checked === true }))}
                    data-testid="checkbox-dsa-terms"
                  />
                  <label htmlFor="dsa-terms" className="text-sm text-text-muted">
                    I agree to the terms and conditions and authorize Jay Shree Mahakal Finance Service to contact me.
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={registerDSA.isPending}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white py-4 font-semibold text-lg shadow-lg"
                  data-testid="button-register-dsa"
                >
                  {registerDSA.isPending ? "Registering..." : "Register as DSA Partner"}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                <p className="text-sm text-text-muted">Already a DSA Partner?</p>
                <Button
                  variant="link"
                  onClick={() => window.location.href = '/dsa'}
                  className="text-yellow-600 hover:text-yellow-700 font-semibold"
                  data-testid="link-dsa-login"
                >
                  Login to DSA Portal
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
