import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back to Home */}
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <Card className="shadow-xl border-blue-200" data-testid="terms-card">
          <CardHeader className="text-center space-y-4">
            <CardTitle className="text-3xl font-bold text-blue-600" data-testid="terms-title">
              Terms & Conditions
            </CardTitle>
            <p className="text-gray-600">
              Jay Shree Mahakal Finance Service (JSMF.in)
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="prose prose-blue max-w-none">
              <p className="text-sm text-gray-600 mb-6">
                By applying for a loan through JSMF.in, you ("Customer" or "Applicant") agree to the following terms and conditions:
              </p>

              <div className="space-y-6">
                <section>
                  <h3 className="text-lg font-semibold text-blue-700 mb-2">1. Service Charges</h3>
                  <p className="text-gray-700">
                    A service charge of 2% of the total loan amount will be applicable and is payable by the Customer.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-blue-700 mb-2">2. Login/Processing Fee</h3>
                  <p className="text-gray-700">
                    A non-refundable login fee of ₹6,860 will be charged at the time of loan application.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-blue-700 mb-2">3. Banking & Transaction Charges</h3>
                  <p className="text-gray-700">
                    All banking and transaction charges related to loan disbursal, repayment, or any other process will be borne by the Customer.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-blue-700 mb-2">4. Cancellation Charges</h3>
                  <p className="text-gray-700">
                    If the loan is cancelled after sanction/approval, the Customer must pay ₹11,000 as cancellation charges.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-blue-700 mb-2">5. Documentation & Compliance</h3>
                  <p className="text-gray-700">
                    The Customer must provide accurate and valid documents (ID proof, address proof, income proof, etc.). Any misrepresentation or false documentation may result in loan rejection without refund of fees.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-blue-700 mb-2">6. Fraudulent or False Documentation</h3>
                  <p className="text-gray-700">
                    The Customer is solely responsible for the authenticity of submitted documents. If any false, forged, or fraudulent documents are provided:
                  </p>
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-gray-700">
                    <li>The loan application will be immediately rejected without refund.</li>
                    <li>If discovered after sanction or disbursal, the Customer shall bear full legal liability.</li>
                    <li>JSMF.in shall hold no responsibility or liability for such cases.</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-blue-700 mb-2">7. Refund Policy</h3>
                  <p className="text-gray-700">
                    All fees and charges, including login fees, processing fees, service charges, and banking charges, are strictly non-refundable.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-blue-700 mb-2">8. Loan Approval Disclaimer</h3>
                  <p className="text-gray-700">
                    JSMF.in only acts as a facilitator between the Customer and financial institutions (banks/NBFCs). Loan approval is at the sole discretion of the lending institution.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-blue-700 mb-2">9. Liability Disclaimer</h3>
                  <p className="text-gray-700">
                    JSMF.in shall not be held liable for:
                  </p>
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-gray-700">
                    <li>Rejection of loan applications</li>
                    <li>Delays in processing or disbursement</li>
                    <li>Decisions made by banks/NBFCs</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-blue-700 mb-2">10. Customer Responsibility</h3>
                  <p className="text-gray-700">
                    The Customer is solely responsible for repayment of the loan. Delay or default in repayment may result in penalties, late fees, or legal action as per the lending institution's policy.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-blue-700 mb-2">11. Confidentiality of Information</h3>
                  <p className="text-gray-700">
                    All information provided by the Customer will be kept confidential and shared only with authorized banks/NBFCs for loan processing.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-blue-700 mb-2">12. Customer Cooperation</h3>
                  <p className="text-gray-700">
                    The Customer must cooperate during the verification process, including document checks, address verification, and income assessment. Non-cooperation may result in rejection of the loan.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-blue-700 mb-2">13. Use of Services</h3>
                  <p className="text-gray-700">
                    The loan services provided by JSMF.in must not be used for illegal, fraudulent, or unlawful activities.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-blue-700 mb-2">14. Governing Law</h3>
                  <p className="text-gray-700">
                    This Agreement and all services are governed by the laws of India, and any disputes shall be subject to the jurisdiction of the courts in Bhopal (M.P.).
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-blue-700 mb-2">15. Changes to Terms</h3>
                  <p className="text-gray-700">
                    JSMF.in reserves the right to modify, amend, or update these Terms & Conditions at any time without prior notice. Customers are advised to review them periodically.
                  </p>
                </section>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500 text-center">
                  Last updated: {new Date().toLocaleDateString('en-IN')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}