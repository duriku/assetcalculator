import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {Result, StampDutyRule, Tile} from './model/calculation.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  result: Result;

  purchasePrice = new FormControl('', [
    Validators.required,
  ]);

  monthlyRent = new FormControl('', [
    Validators.required,
  ]);

  mortgage = new FormControl('yes', [
    Validators.required,
  ]);

  mortgageRate = new FormControl('', [
    Validators.required,
  ]);

  deposit = new FormControl('', [
    Validators.required,
  ]);

  monthlyMaintenanceFees = new FormControl('', [
    Validators.required,
  ]);

  monthlyAgentFees = new FormControl('', [
    Validators.required,
  ]);

  yearlyInsurance = new FormControl('', [
    Validators.required,
  ]);

  ngOnInit(): void {

  }

  // TODO: move the calculation to a service
  calculate(): void {
    const stampDuty = calculateStampDuty(this.purchasePrice.value);
    const totalCosts = +this.purchasePrice.value + stampDuty;
    const rentalYield = (12 * this.monthlyRent.value)  / totalCosts;
    // TODO: deposit is the purchase price if it's a cashbuyer
    const monthlyMortgagePayment = ((+this.purchasePrice.value - +this.deposit.value) * (+this.mortgageRate.value / 100)) / 12;
    const monthlyExpenses = (+this.yearlyInsurance.value / 12) + monthlyMortgagePayment + +this.monthlyMaintenanceFees.value;
    const monthlyCashFlow = +this.monthlyRent.value - monthlyExpenses;
    const returnOnInvestment = (12 * monthlyCashFlow) / +this.deposit.value;

    this.result = {
      stampDuty, totalCosts, rentalYield, returnOnInvestment, monthlyCashFlow, monthlyExpenses, monthlyMortgagePayment
    } as Result;
  }

  clicked(): void {
    console.log('clicked');
  }

  ltv(ltv: number): void {
    this.deposit.setValue(+this.purchasePrice.value * ltv);
  }
}

// BTL:
// 3% of £125,000.00
// 5% of £125,000.00
// 8% of £675,000.00
// 13% of £575,000.00
// 15% of Max
function calculateStampDuty(purchasePrice: number): number {
  let result = 0;
  let remainingAmount = purchasePrice;

  const rules: StampDutyRule[] = [{
    value: 125000,
    percentage: 0.03
  },
    {
    value: 125000,
    percentage: 0.05
  },
    {
    value: 675000,
    percentage: 0.08
  }, {
    value: 575000,
    percentage: 0.13
  }, {
    value: 99999999,
    percentage: 0.15
  }];


  for (const rule of rules) {
    if (remainingAmount <= rule.value) {
      return result + remainingAmount * rule.percentage;
    }
    remainingAmount -= rule.value;
    result = rule.value * rule.percentage;
  }

  return result;
}

