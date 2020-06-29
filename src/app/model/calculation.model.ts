export interface Result {
  stampDuty: number;
  totalCosts: number;
  rentalYield: number;
  returnOnInvestment: number;
  monthlyMortgagePayment: number;
  monthlyExpenses: number;
  monthlyCashFlow: number;
}


export interface StampDutyRule {
  value: number;
  percentage: number;
}

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}
