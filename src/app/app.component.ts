import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {Result, StampDutyRule} from './model/calculation.model';

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


  // TODO: move the calculation to a service
  calculate(): void {
    console.log(this.purchasePrice.value);
    console.log(this.monthlyRent.value);

    const stampDuty = calculateStampDuty(this.purchasePrice.value);
    const totalCosts = +this.purchasePrice.value + stampDuty;
    const rentalYield = (12 * this.monthlyRent.value)  / totalCosts;

    this.result = {
      stampDuty, totalCosts, rentalYield
    } as Result;
  }

  ngOnInit(): void {

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

