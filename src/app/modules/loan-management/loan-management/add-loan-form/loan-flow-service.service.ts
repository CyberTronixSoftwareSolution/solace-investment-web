import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class LoanFlowServiceService {
  loanDetails = {
    _id: "",
    loanNo: "",
    reference: "",
    transactionDate: "",
    borrowerDetails: null,
    productDetails: null,
    reason: "",
    recoveryOfficer: null,
    collectionDate: null,
    isChargesReduceFromLoan: false,
    guarantors: [],
  };

  isFirstStep: boolean = false;
  isSecondStep: boolean = false;
  isThirdStep: boolean = false;

  constructor() {}

  setLoanDetails(loanDetails: any) {
    this.loanDetails = loanDetails;
  }

  getLoanDetails() {
    return this.loanDetails;
  }

  setStepValue(step: number, value: boolean) {
    if (step === 0) {
      this.isFirstStep = value;
    } else if (step === 1) {
      this.isSecondStep = value;
    } else if (step === 2) {
      this.isThirdStep = value;
    }
  }

  getStepValue(step: number): boolean {
    if (step === 0) {
      return this.isFirstStep;
    } else if (step === 1) {
      return this.isSecondStep;
    } else if (step === 2) {
      return this.isThirdStep;
    } else {
      return false;
    }
  }

  resetData() {
    this.loanDetails = {
      _id: "",
      loanNo: "",
      reference: "",
      transactionDate: "",
      borrowerDetails: null,
      productDetails: null,
      reason: "",
      recoveryOfficer: null,
      collectionDate: null,
      isChargesReduceFromLoan: false,
      guarantors: [],
    };

    this.isFirstStep = false;
    this.isSecondStep = false;
    this.isThirdStep = false;
  }
}
