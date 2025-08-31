import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import DirectLoanApplication from "@/components/direct-loan-application";

interface ServiceCard {
  title: string;
  badge: string;
  badgeColor: string;
  description: string;
  features: string[];
  image: string;
  alt: string;
  isSpecial?: boolean;
}

const services: ServiceCard[] = [
  {
    title: "Personal Loan",
    badge: "7.5% ROI",
    badgeColor: "bg-accent-red text-white",
    description: "Quick personal loans for salaried individuals with minimal documentation and same-day approval.",
    features: ["Minimum salary ₹15,000", "Cash salary from ₹8,000", "Loan up to ₹10 Lakhs"],
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&h=250",
    alt: "Personal loan consultation"
  },
  {
    title: "Business Loan",
    badge: "Daily Funding",
    badgeColor: "bg-green-500 text-white",
    description: "Expand your business with flexible loan options and daily funding facility for growing enterprises.",
    features: ["Daily funding available", "Flexible repayment terms", "Loan up to ₹50 Lakhs"],
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=400&h=250",
    alt: "Business loan handshake deal"
  },
  {
    title: "Home Loan",
    badge: "Best Rates",
    badgeColor: "bg-blue-500 text-white",
    description: "Make your dream home a reality with our competitive home loan rates and easy approval process.",
    features: ["Competitive interest rates", "Up to 30 years tenure", "Loan up to ₹5 Crores"],
    image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=400&h=250",
    alt: "Home loan family with documents"
  },
  {
    title: "Loan Against Property",
    badge: "High Value",
    badgeColor: "bg-purple-500 text-white",
    description: "Unlock the value of your property with secured loans at attractive interest rates.",
    features: ["Lower interest rates", "Higher loan amounts", "Flexible usage"],
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&h=250",
    alt: "Professional office workspace"
  },
  {
    title: "Working Capital",
    badge: "Quick Fund",
    badgeColor: "bg-orange-500 text-white",
    description: "Maintain smooth cash flow for your business operations with flexible working capital solutions.",
    features: ["Quick disbursement", "Minimal documentation", "Revolving credit facility"],
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&h=250",
    alt: "Financial calculator smartphone"
  },
  {
    title: "DSA Partnership",
    badge: "Earn More",
    badgeColor: "bg-yellow-500 text-black",
    description: "Join our DSA program and earn attractive commissions by referring loan customers.",
    features: ["Attractive commission structure", "Marketing support provided", "Training & certification"],
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=400&h=250",
    alt: "DSA partner business meeting",
    isSpecial: true
  }
];

export default function ServicesGrid() {
  const [selectedLoanType, setSelectedLoanType] = useState<string | null>(null);

  const handleDSAClick = () => {
    // Scroll to DSA section
    const element = document.getElementById('dsa');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLoanClick = (loanType: string) => {
    setSelectedLoanType(loanType);
  };

  return (
    <section id="loans" className="py-16 bg-bg-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-text-dark mb-4" data-testid="services-title">
            Our Loan Services
          </h2>
          <p className="text-xl text-text-muted max-w-3xl mx-auto" data-testid="services-description">
            Comprehensive financial solutions designed for your personal and business needs with competitive rates and quick approvals.
          </p>
        </div>

        {/* Services Grid - 3x3 Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="services-grid">
          {services.map((service, index) => (
            <Card 
              key={index}
              className={`shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${service.isSpecial ? 'border-2 border-yellow-400' : ''}`}
              data-testid={`service-card-${service.title.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <CardContent className="p-8">
                <div className="relative overflow-hidden rounded-xl mb-6">
                  <img 
                    src={service.image} 
                    alt={service.alt}
                    className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
                    data-testid={`service-image-${index}`}
                  />
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-primary" data-testid={`service-title-${index}`}>
                    {service.title}
                  </h3>
                  <Badge className={service.badgeColor} data-testid={`service-badge-${index}`}>
                    {service.badge}
                  </Badge>
                </div>
                
                <p className="text-text-muted mb-6" data-testid={`service-description-${index}`}>
                  {service.description}
                </p>
                
                <ul className="space-y-2 mb-6" data-testid={`service-features-${index}`}>
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-2">
                      {service.isSpecial ? (
                        <Star className="text-yellow-500 w-4 h-4" />
                      ) : (
                        <Check className="text-green-500 w-4 h-4" />
                      )}
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {service.isSpecial ? (
                  <Button 
                    className="w-full py-3 font-semibold transition-colors bg-yellow-500 hover:bg-yellow-600 text-black"
                    onClick={handleDSAClick}
                    data-testid={`service-apply-button-${index}`}
                  >
                    Become DSA Partner
                  </Button>
                ) : (
                  <Button 
                    className="w-full py-3 font-semibold transition-colors bg-primary hover:bg-blue-700 text-white"
                    onClick={() => handleLoanClick(service.title)}
                    data-testid={`service-apply-button-${index}`}
                  >
                    Apply {service.title}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Loan Application Modal */}
      {selectedLoanType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <DirectLoanApplication 
              loanType={selectedLoanType} 
              onApply={() => setSelectedLoanType(null)}
            />
          </div>
        </div>
      )}
    </section>
  );
}
