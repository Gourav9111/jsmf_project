import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator } from "lucide-react";

interface EMIResult {
  monthlyEMI: number;
  totalPayable: number;
  totalInterest: number;
  principalPercentage: number;
  interestPercentage: number;
}

export default function EMICalculator() {
  const [loanAmount, setLoanAmount] = useState(1000000);
  const [tenureYears, setTenureYears] = useState(5);
  const [tenureMonths, setTenureMonths] = useState(0);
  const [interestRate, setInterestRate] = useState(7.5);
  const [result, setResult] = useState<EMIResult>({
    monthlyEMI: 20276,
    totalPayable: 1216560,
    totalInterest: 216560,
    principalPercentage: 82,
    interestPercentage: 18,
  });

  const calculateEMI = useCallback(() => {
    const totalMonths = tenureYears * 12 + tenureMonths;
    const monthlyRate = interestRate / 12 / 100;

    if (totalMonths > 0 && monthlyRate > 0) {
      const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                 (Math.pow(1 + monthlyRate, totalMonths) - 1);
      
      const totalPayable = emi * totalMonths;
      const totalInterest = totalPayable - loanAmount;
      
      const principalPercentage = Math.round((loanAmount / totalPayable) * 100);
      const interestPercentage = 100 - principalPercentage;

      setResult({
        monthlyEMI: Math.round(emi),
        totalPayable: Math.round(totalPayable),
        totalInterest: Math.round(totalInterest),
        principalPercentage,
        interestPercentage,
      });
    }
  }, [loanAmount, tenureYears, tenureMonths, interestRate]);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatLoanAmount = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(0)}L`;
    }
    return `₹${(amount / 1000).toFixed(0)}K`;
  };

  const sliderPercentage = ((loanAmount - 50000) / (5000000 - 50000)) * 100;

  return (
    <section id="calculator" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-text-dark mb-4" data-testid="calculator-title">
            EMI Calculator
          </h2>
          <p className="text-xl text-text-muted max-w-3xl mx-auto" data-testid="calculator-description">
            Calculate your monthly EMI and plan your loan repayment with our advanced calculator tool.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Calculator Form */}
          <Card className="bg-bg-light shadow-lg" data-testid="calculator-form">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-primary mb-6">Calculate Your EMI</h3>
              
              <form className="space-y-6" data-testid="emi-calculator-form">
                {/* Loan Amount */}
                <div>
                  <Label className="block text-sm font-semibold text-text-dark mb-3">
                    Loan Amount (₹)
                  </Label>
                  <input
                    type="range"
                    min="50000"
                    max="5000000"
                    step="50000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer emi-slider"
                    style={{
                      background: `linear-gradient(to right, hsl(202 95% 37%) 0%, hsl(202 95% 37%) ${sliderPercentage}%, hsl(201 30% 91%) ${sliderPercentage}%, hsl(201 30% 91%) 100%)`
                    }}
                    data-testid="slider-loan-amount"
                  />
                  <div className="flex justify-between text-sm text-text-muted mt-2">
                    <span>₹50K</span>
                    <span className="font-semibold text-primary" data-testid="loan-amount-display">
                      {formatLoanAmount(loanAmount)}
                    </span>
                    <span>₹50L</span>
                  </div>
                </div>

                {/* Tenure */}
                <div>
                  <Label className="block text-sm font-semibold text-text-dark mb-3">
                    Loan Tenure
                  </Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="number"
                      placeholder="Years"
                      min="1"
                      max="30"
                      value={tenureYears}
                      onChange={(e) => setTenureYears(Number(e.target.value) || 0)}
                      className="focus:ring-2 focus:ring-primary"
                      data-testid="input-tenure-years"
                    />
                    <Input
                      type="number"
                      placeholder="Months"
                      min="0"
                      max="11"
                      value={tenureMonths}
                      onChange={(e) => setTenureMonths(Number(e.target.value) || 0)}
                      className="focus:ring-2 focus:ring-primary"
                      data-testid="input-tenure-months"
                    />
                  </div>
                </div>

                {/* Interest Rate */}
                <div>
                  <Label className="block text-sm font-semibold text-text-dark mb-3">
                    Interest Rate (% per annum)
                  </Label>
                  <Input
                    type="number"
                    step="0.1"
                    min="1"
                    max="30"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value) || 0)}
                    className="focus:ring-2 focus:ring-primary"
                    data-testid="input-interest-rate"
                  />
                  <p className="text-sm text-accent-red mt-1 font-medium">
                    Our special rate: 7.5%
                  </p>
                </div>

                <Button
                  type="button"
                  onClick={calculateEMI}
                  className="w-full bg-primary hover:bg-blue-700 text-white py-4 font-semibold text-lg"
                  data-testid="button-calculate-emi"
                >
                  <Calculator className="mr-2" />
                  Calculate EMI
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Results Display */}
          <Card className="border-2 border-primary shadow-lg" data-testid="calculator-results">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-primary mb-6">EMI Calculation Results</h3>
              
              {/* EMI Result Cards */}
              <div className="space-y-4">
                <div className="bg-primary text-white rounded-xl p-6 text-center">
                  <h4 className="text-lg font-semibold mb-2">Monthly EMI</h4>
                  <p className="text-3xl font-bold" data-testid="monthly-emi-display">
                    {formatAmount(result.monthlyEMI)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-bg-light rounded-xl p-4 text-center">
                    <h4 className="text-sm font-semibold text-text-muted mb-1">Total Payable</h4>
                    <p className="text-xl font-bold text-text-dark" data-testid="total-payable-display">
                      {formatAmount(result.totalPayable)}
                    </p>
                  </div>
                  <div className="bg-bg-light rounded-xl p-4 text-center">
                    <h4 className="text-sm font-semibold text-text-muted mb-1">Total Interest</h4>
                    <p className="text-xl font-bold text-accent-red" data-testid="total-interest-display">
                      {formatAmount(result.totalInterest)}
                    </p>
                  </div>
                </div>

                {/* Interest Breakdown Chart */}
                <div className="bg-bg-light rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-text-dark mb-4 text-center">
                    Interest Breakdown
                  </h4>
                  <div className="flex justify-center">
                    <div className="relative w-32 h-32">
                      <div className="w-full h-full rounded-full bg-gradient-to-r from-primary via-secondary to-accent-red opacity-80"></div>
                      <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-xs text-text-muted">Principal</div>
                          <div className="text-sm font-bold text-primary" data-testid="principal-percentage">
                            {result.principalPercentage}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between mt-4 text-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-primary rounded mr-2"></div>
                      <span>Principal ({result.principalPercentage}%)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-accent-red rounded mr-2"></div>
                      <span>Interest ({result.interestPercentage}%)</span>
                    </div>
                  </div>
                </div>

                {/* Apply Button */}
                <Button 
                  className="w-full bg-accent-red hover:bg-red-700 text-white py-4 font-semibold text-lg"
                  onClick={() => window.location.href = '/user'}
                  data-testid="button-apply-loan"
                >
                  Apply for This Loan
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
