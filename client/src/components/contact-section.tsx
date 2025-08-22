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
import { MapPin, Phone, Instagram, Info, Calculator, MessageCircle } from "lucide-react";

interface ContactFormData {
  name: string;
  mobile: string;
  email: string;
  loanType: string;
  message: string;
  consent: boolean;
}

export default function ContactSection() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    mobile: "",
    email: "",
    loanType: "",
    message: "",
    consent: false,
  });

  const { toast } = useToast();

  const submitContact = useMutation({
    mutationFn: async (data: ContactFormData) => {
      return apiRequest("POST", "/api/contact-queries", {
        name: data.name,
        mobileNumber: data.mobile,
        email: data.email,
        loanType: data.loanType,
        message: data.message,
      });
    },
    onSuccess: () => {
      toast({
        title: "Message Sent Successfully",
        description: "We'll get back to you within 24 hours.",
      });
      setFormData({
        name: "",
        mobile: "",
        email: "",
        loanType: "",
        message: "",
        consent: false,
      });
    },
    onError: () => {
      toast({
        title: "Failed to Send Message",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.consent) {
      toast({
        title: "Consent Required",
        description: "Please authorize us to contact you.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.name || !formData.mobile || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }

    submitContact.mutate(formData);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Office Location",
      value: "Bhopal, Madhya Pradesh",
      color: "bg-primary"
    },
    {
      icon: Phone,
      title: "Phone Number", 
      value: "+91 91626 207918",
      subtitle: "Available 24/7 for queries",
      color: "bg-accent-red"
    },
    {
      icon: Instagram,
      title: "Instagram",
      value: "@jayshreemahakalfinance",
      subtitle: "Follow for updates & tips",
      color: "bg-gradient-to-r from-pink-500 to-purple-600"
    }
  ];

  const businessHours = [
    { day: "Monday - Friday", time: "9:00 AM - 7:00 PM" },
    { day: "Saturday", time: "9:00 AM - 5:00 PM" },
    { day: "Sunday", time: "Closed", isClosed: true }
  ];

  return (
    <section id="contact" className="py-16 bg-bg-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-text-dark mb-4" data-testid="contact-title">
            Get in Touch
          </h2>
          <p className="text-xl text-text-muted max-w-3xl mx-auto" data-testid="contact-description">
            Ready to secure your financial future? Contact us today for personalized loan solutions and expert guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-primary mb-6">Contact Information</h3>
              <div className="space-y-4" data-testid="contact-info-list">
                {contactInfo.map((info, index) => {
                  const IconComponent = info.icon;
                  return (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-white rounded-xl shadow-sm" data-testid={`contact-info-${index}`}>
                      <div className={`w-12 h-12 ${info.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                        <IconComponent className="text-white" size={20} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-text-dark">{info.title}</h4>
                        <p className="text-text-muted">{info.value}</p>
                        {info.subtitle && (
                          <p className="text-sm text-green-600">{info.subtitle}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Business Hours */}
            <Card className="shadow-sm" data-testid="business-hours-card">
              <CardContent className="p-6">
                <h4 className="text-xl font-bold text-primary mb-4">Business Hours</h4>
                <div className="space-y-2 text-sm">
                  {businessHours.map((schedule, index) => (
                    <div key={index} className="flex justify-between" data-testid={`business-hour-${index}`}>
                      <span className="text-text-dark">{schedule.day}:</span>
                      <span className={`font-semibold ${schedule.isClosed ? 'text-accent-red' : 'text-text-dark'}`}>
                        {schedule.time}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800 flex items-center">
                    <Info className="mr-1 w-4 h-4" />
                    Emergency loan queries available 24/7 via phone
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="shadow-lg" data-testid="contact-form-card">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-primary mb-6">Send us a Message</h3>
              <form className="space-y-4" onSubmit={handleSubmit} data-testid="contact-form">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    type="text"
                    placeholder="Your Name *"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="focus:ring-2 focus:ring-primary"
                    data-testid="input-contact-name"
                    required
                  />
                  <Input
                    type="tel"
                    placeholder="Mobile Number *"
                    value={formData.mobile}
                    onChange={(e) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
                    className="focus:ring-2 focus:ring-primary"
                    data-testid="input-contact-mobile"
                    required
                  />
                </div>
                
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="focus:ring-2 focus:ring-primary"
                  data-testid="input-contact-email"
                />
                
                <Select value={formData.loanType} onValueChange={(value) => setFormData(prev => ({ ...prev, loanType: value }))}>
                  <SelectTrigger className="focus:ring-2 focus:ring-primary" data-testid="select-contact-loan-type">
                    <SelectValue placeholder="Select Loan Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal">Personal Loan</SelectItem>
                    <SelectItem value="business">Business Loan</SelectItem>
                    <SelectItem value="home">Home Loan</SelectItem>
                    <SelectItem value="lap">Loan Against Property</SelectItem>
                    <SelectItem value="working-capital">Working Capital Loan</SelectItem>
                    <SelectItem value="dsa">DSA Partnership</SelectItem>
                    <SelectItem value="general">General Inquiry</SelectItem>
                  </SelectContent>
                </Select>

                <Textarea
                  placeholder="Your Message or Query *"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  className="focus:ring-2 focus:ring-primary resize-none"
                  data-testid="textarea-contact-message"
                  required
                />

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="contact-consent"
                    checked={formData.consent}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, consent: checked === true }))}
                    data-testid="checkbox-contact-consent"
                  />
                  <label htmlFor="contact-consent" className="text-sm text-text-muted">
                    I authorize Jay Shree Mahakal Finance Service to contact me regarding my inquiry.
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={submitContact.isPending}
                  className="w-full bg-primary hover:bg-blue-700 text-white py-4 font-semibold text-lg"
                  data-testid="button-send-message"
                >
                  {submitContact.isPending ? "Sending..." : "Send Message"}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                <p className="text-sm text-text-muted mb-3">Quick Actions:</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 bg-accent-red hover:bg-red-700 text-white py-2 px-4 text-sm font-semibold"
                    onClick={() => document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })}
                    data-testid="button-quick-calculate"
                  >
                    <Calculator className="mr-1 w-4 h-4" />
                    Calculate EMI
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 text-sm font-semibold"
                    onClick={() => window.open('https://wa.me/919162620791', '_blank')}
                    data-testid="button-whatsapp"
                  >
                    <MessageCircle className="mr-1 w-4 h-4" />
                    WhatsApp Us
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
