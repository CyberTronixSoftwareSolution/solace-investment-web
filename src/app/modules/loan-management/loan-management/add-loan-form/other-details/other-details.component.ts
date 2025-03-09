import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { firstValueFrom } from "rxjs";
import { UserService } from "src/app/shared/services/api-services/user.service";
import { CommonForm } from "src/app/shared/services/app-common-form";
import { AppMessageService } from "src/app/shared/services/app-message.service";
import { HelperService } from "src/app/shared/services/helper.service";
import { MasterDataService } from "src/app/shared/services/master-data.service";
import { PopupService } from "src/app/shared/services/popup.service";
import { LoanFlowServiceService } from "../loan-flow-service.service";

@Component({
  selector: "app-other-details",
  templateUrl: "./other-details.component.html",
  styleUrls: ["./other-details.component.css"],
})
export class OtherDetailsComponent implements OnInit {
  FV = new CommonForm();
  selectedRecoveryOfficer: any = null;

  collectingDatesArr: any[] = [];
  deductionCharges: any[] = [];
  chargeCols: any[] = [];
  recoveryOfficerSuggestionsArr: any[] = [];

  isOpenDeductionCharges: boolean = false;
  totalDeductionChargeAmount: number = 0;
  loanDetails: any = null;

  selectedProduct: any = null;

  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private popUpService: PopupService,
    private helper: HelperService,
    private messageService: AppMessageService,
    private masterDataService: MasterDataService,
    private userService: UserService,
    private loanFlowService: LoanFlowServiceService
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.loanDetails = this.loanFlowService.getLoanDetails();
    this.selectedProduct = this.loanDetails.productDetails;

    this.chargeCols = [
      { field: "deductionChargeName", header: "Deduction Charge Name" },
      { field: "rate", header: "Rate" },
      { field: "amount", header: "Amount" },
    ];

    this.collectingDatesArr = [
      { name: "MONDAY", value: "MONDAY" },
      { name: "TUESDAY", value: "TUESDAY" },
      { name: "WEDNESDAY", value: "WEDNESDAY" },
      { name: "THURSDAY", value: "THURSDAY" },
      { name: "FRIDAY", value: "FRIDAY" },
      { name: "SATURDAY", value: "SATURDAY" },
      { name: "SUNDAY", value: "SUNDAY" },
    ];

    debugger;
    this.isOpenDeductionCharges = this.selectedProduct.isOpenDeductionCharges;

    this.deductionCharges = this.selectedProduct.deductionCharges || [];

    this.calculateDeductionCharges();

    if (this.selectedProduct.type == "D") {
      this.FV.disableField("collectionDate");
    }

    this.setValues();
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      collectionDate: ["", [Validators.required]],
      recoveryOfficer: ["", [Validators.required]],

      // deduction charges
      deductionChargeName: ["", [Validators.required]],
      deductionChargeRate: ["", [Validators.required]],
      isChargesReduceFromLoan: [""],
    });
  }

  setValues() {
    if (this.loanDetails?.recoveryOfficer) {
      this.FV.setValue("recoveryOfficer", this.loanDetails.recoveryOfficer);
    }

    if (this.loanDetails?.collectionDate) {
      this.FV.setValue("collectionDate", this.loanDetails.collectionDate);
    }

    this.FV.setValue(
      "isChargesReduceFromLoan",
      this.loanDetails?.isChargesReduceFromLoan
    );
  }
  calculateDeductionCharges() {
    this.totalDeductionChargeAmount = 0;
    if (!this.deductionCharges || this.deductionCharges.length <= 0) return;

    if (this.isOpenDeductionCharges) {
      this.deductionCharges.forEach((charge) => {
        this.totalDeductionChargeAmount += charge.amount;
      });
    } else {
      this.deductionCharges.forEach((charge) => {
        let amount = !charge.isPercentage
          ? charge.rate
          : this.selectedProduct.amount * (charge.rate / 100);

        charge.amount = amount;

        this.totalDeductionChargeAmount += amount;
      });
    }
  }

  async searchRecoveryOfficer(e: any) {
    let value = e.query;

    try {
      const userResult = await firstValueFrom(
        this.userService.UserSearchByParam("admin", value)
      );

      if (userResult.IsSuccessful) {
        this.recoveryOfficerSuggestionsArr = userResult.Result;
      }
    } catch (error) {
      this.messageService.showErrorAlert(error?.message || error);
    }
  }

  onRecoveryOfficerSelect(e: any) {
    this.selectedRecoveryOfficer = e.value;
  }

  onRecoveryOfficerKeyUp() {
    if (this.selectedRecoveryOfficer) {
      this.FV.setValue("recoveryOfficer", this.selectedRecoveryOfficer);
    }
  }

  onRecoveryOfficerClear() {
    this.selectedRecoveryOfficer = null;
    this.FV.clearValues("recoveryOfficer");
  }

  addDeductionCharge() {
    let validateParam = "deductionChargeName,deductionChargeRate";

    if (this.FV.validateControllers(validateParam)) {
      return;
    }

    let formData = this.FV.formGroup.value;

    let totalAmounts =
      this.deductionCharges.reduce((total, item) => total + item.amount, 0) ||
      0;

    if (
      totalAmounts + formData.deductionChargeRate >
      this.selectedProduct.amount
    ) {
      this.messageService.showErrorAlert(
        "Deduction charge amount should be less than loan amount!"
      );
      return;
    }

    let deductionCharge = {
      deductionChargeName: formData.deductionChargeName,
      isPercentage: false,
      rate: formData.deductionChargeRate,
      amount: formData.deductionChargeRate,
      _id: this.helper.generateUniqueId(this.deductionCharges),
    };

    this.deductionCharges.push(deductionCharge);

    this.clearDeductionCharge();
    this.calculateDeductionCharges();
  }

  onDeleteDeductionCharge(rowData: any) {
    let confirmationConfig = {
      message: `Are you sure you want to delete this deduction charge?`,
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
    };

    this.messageService.ConfirmPopUp(
      confirmationConfig,
      (isConfirm: boolean) => {
        if (isConfirm) {
          this.clearDeductionCharge();

          this.deductionCharges = this.deductionCharges.filter(
            (charge) => charge._id != rowData._id
          );

          this.calculateDeductionCharges();

          this.messageService.showSuccessAlert(
            "Deduction charge deleted successfully!"
          );
        }
      }
    );
  }

  clearDeductionCharge() {
    this.FV.clearValues("deductionChargeName,deductionChargeRate");
  }
}
