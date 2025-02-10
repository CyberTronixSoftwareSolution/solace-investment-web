import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-loan-summary",
  templateUrl: "./loan-summary.component.html",
  styleUrls: ["./loan-summary.component.css"],
})
export class LoanSummaryComponent implements OnInit {
  loanDetails: any = null;
  loanSummary = {
    loanAmount: 0,
    totalInterestAmount: 0,
    isReduceFromLoan: false,
    totalDeductionChargeAmount: 0,
    availableBalance: 0,
    agreedAmount: 0,
  };

  constructor() {}

  ngOnInit() {
    this.loanDetails = {
      isChargesReduceFromLoan: false,
      product: {
        _id: "67a8bd05c6059ffd1b004214",
        productName: "qwdqwdqwd",
        productCode: "qwdqwd",
        isPercentage: true,
        rate: 5,
        rateAmount: 500,
        amount: 10000,
        maxAmount: 20000,
        minAmount: 2500,
        termsCount: 10,
        type: "D",
        isOpenDeductionCharges: false,
        deductionCharges: [
          {
            deductionChargeName: "Test Charge",
            isPercentage: true,
            rate: 2,
            amount: 200,
            _id: "67a8bd05c6059ffd1b004215",
          },
          {
            deductionChargeName: "ergerger",
            isPercentage: false,
            rate: 2500,
            amount: 2500,
            _id: "67a8bd05c6059ffd1b004216",
          },
        ],
        status: 1,
        createdBy: "6793d2f7161fc34b91ea51eb",
        updatedBy: "6793d2f7161fc34b91ea51eb",
        createdAt: "2025-02-09T14:34:45.712Z",
        updatedAt: "2025-02-09T14:34:45.712Z",
      },
    };

    this.calculateLoanSummary();
  }

  calculateLoanSummary() {
    if (this.loanDetails && this.loanDetails.product) {
      let loanAmount = 0;
      let totalInterestAmount = 0;
      let totalDeductionChargeAmount = 0;
      let availableBalance = 0;
      let agreedAmount = 0;

      loanAmount = this.loanDetails.product.amount;

      totalInterestAmount = this.loanDetails.product.isPercentage
        ? loanAmount * (this.loanDetails.product.rate / 100)
        : this.loanDetails.product.rate;

      totalDeductionChargeAmount =
        this.loanDetails.product.deductionCharges.reduce(
          (total, item) => total + item.amount,
          0
        );

      availableBalance = this.loanDetails.isChargesReduceFromLoan
        ? loanAmount - totalDeductionChargeAmount
        : loanAmount;

      agreedAmount = loanAmount + totalInterestAmount;

      this.loanSummary = {
        loanAmount: loanAmount,
        totalInterestAmount: totalInterestAmount,
        isReduceFromLoan: this.loanDetails.isChargesReduceFromLoan || false,
        totalDeductionChargeAmount: totalDeductionChargeAmount,
        availableBalance: availableBalance,
        agreedAmount: agreedAmount,
      };
    } else {
      this.loanSummary = {
        loanAmount: 0,
        totalInterestAmount: 0,
        isReduceFromLoan: false,
        totalDeductionChargeAmount: 0,
        availableBalance: 0,
        agreedAmount: 0,
      };
    }
  }
}
