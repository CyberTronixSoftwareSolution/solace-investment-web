import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class AddUserControlFlowService {
  isFirstStep: boolean = true;
  isSecondStep: boolean = false;
  isThirdStep: boolean = false;
  isFourthStep: boolean = false;
  constructor() {}

  setStepValue(step: number, value: boolean) {
    if (step === 0) {
      this.isFirstStep = value;
    } else if (step === 1) {
      this.isSecondStep = value;
    } else if (step === 2) {
      this.isThirdStep = value;
    } else if (step === 3) {
      this.isFourthStep = value;
    }
  }

  getStepValue(step: number): boolean {
    if (step === 0) {
      return this.isFirstStep;
    } else if (step === 1) {
      return this.isSecondStep;
    } else if (step === 2) {
      return this.isThirdStep;
    } else if (step === 3) {
      return this.isFourthStep;
    } else {
      return false;
    }
  }
}
