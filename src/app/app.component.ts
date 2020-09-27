import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {Result, StampDutyRule} from './model/calculation.model';
import {ActivatedRoute, NavigationExtras, Router, UrlSerializer} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  result: Result;
  version = '0.1-alpha';

  calculatorForm = new FormGroup({
      purchasePrice: new FormControl('', [
        Validators.required,
      ]),
      monthlyRent: new FormControl('', [
        Validators.required,
      ]),
      mortgage: new FormControl('yes', [
        Validators.required,
      ]),
      mortgageRate: new FormControl('3.6', [
      ]),
      deposit: new FormControl('', [
      ]),
      legalFees: new FormControl('1500', [
        Validators.required,
      ]),
      refurbCosts: new FormControl('', [
        Validators.required,
      ]),
      monthlyMaintenanceFees: new FormControl('80', [
        Validators.required,
      ]),
      monthlyAgentFees: new FormControl('', [
        Validators.required,
      ]),
      yearlyInsurance: new FormControl('200', [
        Validators.required,
      ]),
      annualGroundRent: new FormControl('', [
        Validators.required,
      ]),
      annualServiceCharge: new FormControl('', [
        Validators.required,
      ])
    },
    {
      validators: [mortgageConditionallyRequiredValidator]
    });


  constructor(private router: Router,
              private route: ActivatedRoute,
              private serializer: UrlSerializer) {

  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.purchasePrice.setValue(params.purchasePrice);
      this.monthlyRent.setValue(params.monthlyRent);
      this.mortgage.setValue(params.mortgage);
      this.mortgageRate.setValue(params.mortgageRate);
      this.deposit.setValue(params.deposit);
      this.legalFees.setValue(params.legalFees);
      this.refurbCosts.setValue(params.refurbCosts);
      this.monthlyMaintenanceFees.setValue(params.monthlyMaintenanceFees);
      this.monthlyAgentFees.setValue(params.monthlyAgentFees);
      this.yearlyInsurance.setValue(params.yearlyInsurance);
      this.annualServiceCharge.setValue(params.annualServiceCharge);
      this.annualGroundRent.setValue(params.annualGroundRent);

      if (this.calculatorForm.valid){
        this.calculate();
      }
    });
  }

  submit(): void {
    const mortgageRate = this.mortgage.value === 'yes' ? this.mortgageRate.value : null;
    const deposit = this.mortgage.value === 'yes' ? this.deposit.value : null;


    const navigationExtras: NavigationExtras = {
      queryParams: {
        purchasePrice: this.purchasePrice.value,
        monthlyRent: this.monthlyRent.value,
        mortgage: this.mortgage.value,
        mortgageRate,
        deposit,
        legalFees: this.legalFees.value,
        refurbCosts: this.refurbCosts.value,
        monthlyMaintenanceFees: this.monthlyMaintenanceFees.value,
        monthlyAgentFees: this.monthlyAgentFees.value,
        yearlyInsurance: this.yearlyInsurance.value,
        annualGroundRent: this.annualGroundRent.value,
        annualServiceCharge: this.annualServiceCharge.value,
      }
    };

    this.router.navigate(['/'], navigationExtras);
  }

  // TODO: move the calculation to a service
  calculate(): void {
    // using mortgage
    const stampDuty = calculateStampDuty(this.purchasePrice.value);
    const rentalYield = (12 * this.monthlyRent.value) / this.purchasePrice.value;

    if ('yes' === this.mortgage.value){
      const totalCosts = +this.deposit.value + stampDuty + +this.legalFees.value + +this.annualGroundRent.value + +this.annualServiceCharge.value;
      const monthlyMortgagePayment = ((+this.purchasePrice.value - +this.deposit.value) * (+this.mortgageRate.value / 100)) / 12;
      const monthlyExpenses = (+this.yearlyInsurance.value / 12) + monthlyMortgagePayment + +this.monthlyMaintenanceFees.value + +this.monthlyAgentFees.value;
      const monthlyCashFlow = +this.monthlyRent.value - monthlyExpenses;
      const yearlyProfit = monthlyCashFlow * 12;
      const returnOnInvestment = (12 * monthlyCashFlow) / (totalCosts);

      this.result = {
        stampDuty, totalCosts, rentalYield, returnOnInvestment, monthlyCashFlow, yearlyProfit, monthlyExpenses, monthlyMortgagePayment
      } as Result;
    }
    // cash buyer
    else {
      const totalCosts = +this.purchasePrice.value + stampDuty + +this.legalFees.value;
      const monthlyExpenses = (+this.yearlyInsurance.value / 12) + +this.monthlyMaintenanceFees.value + +this.monthlyAgentFees.value;
      const monthlyCashFlow = +this.monthlyRent.value - monthlyExpenses;
      const yearlyProfit = monthlyCashFlow * 12;
      const returnOnInvestment = (12 * monthlyCashFlow) / (totalCosts);

      this.result = {
        stampDuty, totalCosts, rentalYield, returnOnInvestment, monthlyCashFlow, yearlyProfit, monthlyExpenses
      } as Result;
    }


    this.router.createUrlTree([], {queryParams: this.result});
  }

  ltv(ltv: number): void {
    this.deposit.setValue(+this.purchasePrice.value * ltv);
  }

  management(rate: number): void {
    this.monthlyAgentFees.setValue(+this.monthlyRent.value * rate);
  }

  get purchasePrice(): AbstractControl {
    return this.calculatorForm.get('purchasePrice');
  }

  get monthlyRent(): AbstractControl {
    return this.calculatorForm.get('monthlyRent');
  }

  get mortgage(): AbstractControl {
    return this.calculatorForm.get('mortgage');
  }

  get mortgageRate(): AbstractControl {
    return this.calculatorForm.get('mortgageRate');
  }

  get deposit(): AbstractControl {
    return this.calculatorForm.get('deposit');
  }

  get legalFees(): AbstractControl {
    return this.calculatorForm.get('legalFees');
  }

  get refurbCosts(): AbstractControl {
    return this.calculatorForm.get('refurbCosts');
  }

  get monthlyMaintenanceFees(): AbstractControl {
    return this.calculatorForm.get('monthlyMaintenanceFees');
  }

  get monthlyAgentFees(): AbstractControl {
    return this.calculatorForm.get('monthlyAgentFees');
  }

  get yearlyInsurance(): AbstractControl {
    return this.calculatorForm.get('yearlyInsurance');
  }

  get annualGroundRent(): AbstractControl {
    return this.calculatorForm.get('annualGroundRent');
  }

  get annualServiceCharge(): AbstractControl {
    return this.calculatorForm.get('annualServiceCharge');
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
    result = result + rule.value * rule.percentage;
  }

  return result;
}

function mortgageConditionallyRequiredValidator(formGroup: FormGroup): { mortgageRequired: boolean } {
  let error = null;
  if (formGroup.get('mortgage').value === 'yes') {
    if (Validators.required(formGroup.get('mortgageRate'))) {
      error = {
        mortgageRequired: true
      };
    }

    if (Validators.required(formGroup.get('deposit'))) {
      error = {
        mortgageRequired: true
      };
    }
  }
  return error;
}
