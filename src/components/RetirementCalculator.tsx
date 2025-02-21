
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CalculatorInputs {
  currentAge: number;
  retirementAge: number;
  currentIncome: number;
  currentSavings: number;
  monthlySavings: number;
  expectedReturn: number;
  inflationRate: number;
  retirementIncome: number;
}

interface CalculatorResults {
  totalNeeded: number;
  yearsUntilRetirement: number;
  requiredMonthlySavings: number;
}

const RetirementCalculator = () => {
  const { toast } = useToast();
  const [inputs, setInputs] = useState<CalculatorInputs>({
    currentAge: 30,
    retirementAge: 65,
    currentIncome: 50000,
    currentSavings: 10000,
    monthlySavings: 500,
    expectedReturn: 7,
    inflationRate: 2,
    retirementIncome: 80,
  });

  const [results, setResults] = useState<CalculatorResults | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const calculateRetirement = () => {
    // Validate inputs
    if (inputs.currentAge >= inputs.retirementAge) {
      toast({
        title: "Invalid Ages",
        description: "Retirement age must be greater than current age",
        variant: "destructive"
      });
      return;
    }

    const yearsUntilRetirement = inputs.retirementAge - inputs.currentAge;
    const annualIncome = inputs.currentIncome;
    const desiredRetirementIncome = (annualIncome * inputs.retirementIncome) / 100;
    const realReturnRate = (1 + inputs.expectedReturn / 100) / (1 + inputs.inflationRate / 100) - 1;
    
    // Calculate total needed using the present value of an annuity formula
    const yearlyWithdrawal = desiredRetirementIncome;
    const lifeExpectancy = 90 - inputs.retirementAge;
    const totalNeeded = yearlyWithdrawal * ((1 - Math.pow(1 + realReturnRate, -lifeExpectancy)) / realReturnRate);
    
    // Calculate required monthly savings
    const futureValueNeeded = totalNeeded - inputs.currentSavings * Math.pow(1 + realReturnRate, yearsUntilRetirement);
    const monthlyPayment = (futureValueNeeded * (realReturnRate / 12)) / (Math.pow(1 + realReturnRate / 12, yearsUntilRetirement * 12) - 1);

    setResults({
      totalNeeded: Math.max(0, totalNeeded),
      yearsUntilRetirement,
      requiredMonthlySavings: Math.max(0, monthlyPayment)
    });

    toast({
      title: "Calculation Complete",
      description: "Your retirement projection has been updated.",
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="glass-card rounded-2xl p-8 space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight">Retirement Calculator</h1>
          <p className="text-muted-foreground">Plan your future with precision</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="currentAge">Current Age</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-secondary">
                      <p>Your current age in years</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                type="number"
                id="currentAge"
                name="currentAge"
                value={inputs.currentAge}
                onChange={handleInputChange}
                className="input-glass"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="retirementAge">Retirement Age</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-secondary">
                      <p>Your desired retirement age</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                type="number"
                id="retirementAge"
                name="retirementAge"
                value={inputs.retirementAge}
                onChange={handleInputChange}
                className="input-glass"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="currentIncome">Current Annual Income ($)</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-secondary">
                      <p>Your current yearly income before taxes</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                type="number"
                id="currentIncome"
                name="currentIncome"
                value={inputs.currentIncome}
                onChange={handleInputChange}
                className="input-glass"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="currentSavings">Current Savings ($)</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-secondary">
                      <p>Your current retirement savings</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                type="number"
                id="currentSavings"
                name="currentSavings"
                value={inputs.currentSavings}
                onChange={handleInputChange}
                className="input-glass"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="monthlySavings">Monthly Savings ($)</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-secondary">
                      <p>How much you save monthly for retirement</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                type="number"
                id="monthlySavings"
                name="monthlySavings"
                value={inputs.monthlySavings}
                onChange={handleInputChange}
                className="input-glass"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="expectedReturn">Expected Return (%)</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-secondary">
                      <p>Expected annual return on investments</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                type="number"
                id="expectedReturn"
                name="expectedReturn"
                value={inputs.expectedReturn}
                onChange={handleInputChange}
                className="input-glass"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="inflationRate">Inflation Rate (%)</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-secondary">
                      <p>Expected annual inflation rate</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                type="number"
                id="inflationRate"
                name="inflationRate"
                value={inputs.inflationRate}
                onChange={handleInputChange}
                className="input-glass"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="retirementIncome">Desired Retirement Income (%)</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-secondary">
                      <p>Percentage of current income needed in retirement</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                type="number"
                id="retirementIncome"
                name="retirementIncome"
                value={inputs.retirementIncome}
                onChange={handleInputChange}
                className="input-glass"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Button onClick={calculateRetirement} className="w-full max-w-md">
            Calculate
          </Button>
        </div>

        {results && (
          <div className="mt-8 space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="glass-card rounded-xl p-4 text-center">
                <h3 className="text-sm text-muted-foreground mb-2">Total Savings Needed</h3>
                <p className="text-2xl font-semibold">
                  ${Math.round(results.totalNeeded).toLocaleString()}
                </p>
              </div>
              <div className="glass-card rounded-xl p-4 text-center">
                <h3 className="text-sm text-muted-foreground mb-2">Years Until Retirement</h3>
                <p className="text-2xl font-semibold">{results.yearsUntilRetirement}</p>
              </div>
              <div className="glass-card rounded-xl p-4 text-center">
                <h3 className="text-sm text-muted-foreground mb-2">Required Monthly Savings</h3>
                <p className="text-2xl font-semibold">
                  ${Math.round(results.requiredMonthlySavings).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 p-6 glass-card rounded-xl">
          <h2 className="text-xl font-semibold mb-4">How it Works</h2>
          <p className="text-muted-foreground leading-relaxed">
            This calculator uses your current age, income, and savings to project your retirement needs. 
            It factors in inflation and expected investment returns to determine how much you need to save 
            monthly to reach your retirement goals. The calculation assumes a retirement length up to age 90 
            and uses the present value of an annuity formula to determine total savings needed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RetirementCalculator;
