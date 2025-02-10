import { Component, OnInit } from "@angular/core";
import { LoanFlowServiceService } from "../loan-flow-service.service";

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

  constructor(private loanFlowService: LoanFlowServiceService) {}

  ngOnInit() {
    this.loanDetails = this.loanFlowService.getLoanDetails();
    this.calculateLoanSummary();
  }

  calculateLoanSummary() {
    if (this.loanDetails && this.loanDetails.productDetails) {
      let loanAmount = 0;
      let totalInterestAmount = 0;
      let totalDeductionChargeAmount = 0;
      let availableBalance = 0;
      let agreedAmount = 0;

      loanAmount = this.loanDetails.productDetails.amount;

      totalInterestAmount = this.loanDetails.productDetails.isPercentage
        ? loanAmount * (this.loanDetails.productDetails.rate / 100)
        : this.loanDetails.productDetails.rate;

      totalDeductionChargeAmount =
        this.loanDetails.productDetails.deductionCharges.reduce(
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
