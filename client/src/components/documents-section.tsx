import { Card } from "@/components/ui/card";
import { CreditCard, Building, FileText, Shield, Clock, UserCheck } from "lucide-react";

const documents = [
  {
    icon: CreditCard,
    title: "Aadhaar Card",
    description: "Valid Aadhaar card for identity verification and address proof.",
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: CreditCard,
    title: "PAN Card", 
    description: "Permanent Account Number for tax identification and verification.",
    color: "from-green-500 to-green-600"
  },
  {
    icon: FileText,
    title: "Salary Slip",
    description: "Latest salary slips or bank statements for income verification.",
    color: "from-yellow-500 to-yellow-600"
  },
  {
    icon: Building,
    title: "Business Proof",
    description: "Business registration or GST certificate (for business loans only).",
    color: "from-purple-500 to-purple-600"
  }
];

export default function DocumentsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-text-dark mb-4" data-testid="documents-title">
            Minimum Documents Required
          </h2>
          <p className="text-xl text-text-muted max-w-3xl mx-auto" data-testid="documents-description">
            We keep documentation simple and minimal to ensure quick loan processing without unnecessary hassles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" data-testid="documents-grid">
          {documents.map((doc, index) => {
            const IconComponent = doc.icon;
            return (
              <div key={index} className="text-center group" data-testid={`document-item-${index}`}>
                <div className={`w-24 h-24 bg-gradient-to-br ${doc.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="text-white text-3xl" size={32} />
                </div>
                <h3 className="text-xl font-bold text-text-dark mb-2" data-testid={`document-title-${index}`}>
                  {doc.title}
                </h3>
                <p className="text-text-muted text-sm" data-testid={`document-description-${index}`}>
                  {doc.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Additional Info */}
        <Card className="mt-12 bg-gradient-to-r from-primary to-secondary text-white p-8 text-center" data-testid="security-info-card">
          <h3 className="text-2xl font-bold mb-4">Maximum Security, Minimum Documentation</h3>
          <p className="text-lg mb-6 opacity-90">
            Our streamlined process ensures your personal information is secure while keeping documentation requirements minimal for faster approval.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="flex items-center justify-center space-x-2">
              <Shield className="text-2xl" />
              <span className="font-semibold">Bank-level Security</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Clock className="text-2xl" />
              <span className="font-semibold">Quick Processing</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <UserCheck className="text-2xl" />
              <span className="font-semibold">Data Protection</span>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
