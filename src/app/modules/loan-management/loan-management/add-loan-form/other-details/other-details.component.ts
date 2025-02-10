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

  selectedProduct = {
    _id: "67a0f16eaa422491f666ed36",
    productName: "Personal Loan Daily",
    productCode: "PL123",
    isPercentage: true,
    rate: 10,
    rateAmount: 10000,
    amount: 100000,
    maxAmount: 500000,
    minAmount: 50000,
    termsCount: 12,
    type: "M",
    isOpenDeductionCharges: true,
    deductionCharges: [
      {
        deductionChargeName: "Test Charge",
        isPercentage: true,
        rate: 5,
        amount: 5000,
        _id: "67a4f970995d84705554ddba",
      },
    ],
    status: 1,
  };

  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private popUpService: PopupService,
    private helper: HelperService,
    private messageService: AppMessageService,
    private masterDataService: MasterDataService,
    private userService: UserService
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.chargeCols = [
      { field: "deductionChargeName", header: "Deduction Charge Name" },
      { field: "rate", header: "Rate" },
      { field: "amount", header: "Amount" },
    ];

    this.collectingDatesArr = [
      { name: "Monday", value: "Monday" },
      { name: "Tuesday", value: "Tuesday" },
      { name: "Wednesday", value: "Wednesday" },
      { name: "Thursday", value: "Thursday" },
      { name: "Friday", value: "Friday" },
      { name: "Saturday", value: "Saturday" },
      { name: "Sunday", value: "Sunday" },
    ];

    this.isOpenDeductionCharges = this.selectedProduct.isOpenDeductionCharges;

    if (!this.isOpenDeductionCharges) {
      this.deductionCharges = this.selectedProduct.deductionCharges;

      this.calculateDeductionCharges();
    }

    if (this.selectedProduct.type == "D") {
      this.FV.disableField("collectionDate");
    }
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      collectionDate: ["", [Validators.required]],
      recoveryOfficer: ["", [Validators.required]],
      isChargesReduceFromLoan: ["", [Validators.required]],
    });
  }

  calculateDeductionCharges() {
    this.totalDeductionChargeAmount = 0;

    if (this.isOpenDeductionCharges) {
      this.deductionCharges.forEach((charge) => {
        this.totalDeductionChargeAmount += charge.amount;
      });
    } else {
      debugger;
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
}
