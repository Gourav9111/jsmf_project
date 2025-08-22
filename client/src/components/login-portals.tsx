import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Handshake, User, Check } from "lucide-react";

const portals = [
  {
    title: "Admin Portal",
    icon: Shield,
    description: "Comprehensive dashboard to manage all loan applications, approve/reject loans, and oversee DSA partners.",
    features: [
      "Manage all applications",
      "Approve/Reject loans", 
      "DSA partner management",
      "Analytics & Reports"
    ],
    buttonText: "Admin Login",
    buttonClass: "bg-red-600 hover:bg-red-700",
    iconBg: "from-red-500 to-red-600",
    href: "/admin"
  },
  {
    title: "DSA Portal",
    icon: Handshake,
    description: "Dedicated dashboard for DSA partners to manage leads, track commissions, and upload documents.",
    features: [
      "Lead management",
      "Commission tracking",
      "Document upload", 
      "Performance analytics"
    ],
    buttonText: "DSA Login",
    buttonClass: "bg-yellow-500 hover:bg-yellow-600 text-black",
    iconBg: "from-yellow-500 to-yellow-600",
    href: "/dsa"
  },
  {
    title: "User Portal",
    icon: User,
    description: "Customer dashboard to fill loan applications, track application status, and manage documents.",
    features: [
      "Fill loan applications",
      "Track application status",
      "Document management",
      "Loan history"
    ],
    buttonText: "User Login",
    buttonClass: "bg-primary hover:bg-blue-700",
    iconBg: "from-primary to-secondary",
    href: "/user"
  }
];

export default function LoginPortals() {
  return (
    <section className="py-16 bg-bg-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-text-dark mb-4" data-testid="portals-title">
            Access Your Portal
          </h2>
          <p className="text-xl text-text-muted max-w-3xl mx-auto" data-testid="portals-description">
            Secure login portals for administrators, DSA partners, and customers to manage applications and track progress.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8" data-testid="portals-grid">
          {portals.map((portal, index) => {
            const IconComponent = portal.icon;
            return (
              <Card 
                key={index}
                className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                data-testid={`portal-card-${portal.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <CardContent className="p-8 text-center">
                  <div className={`w-20 h-20 bg-gradient-to-br ${portal.iconBg} rounded-full flex items-center justify-center mx-auto mb-6`}>
                    <IconComponent className="text-white text-3xl" size={32} />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-text-dark mb-4" data-testid={`portal-title-${index}`}>
                    {portal.title}
                  </h3>
                  
                  <p className="text-text-muted mb-6" data-testid={`portal-description-${index}`}>
                    {portal.description}
                  </p>
                  
                  <ul className="text-left space-y-2 mb-6 text-sm" data-testid={`portal-features-${index}`}>
                    {portal.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <Check className="text-green-500 mr-2 w-4 h-4" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full py-3 font-semibold transition-colors ${portal.buttonClass}`}
                    onClick={() => window.location.href = portal.href}
                    data-testid={`portal-login-button-${index}`}
                  >
                    {portal.buttonText}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
