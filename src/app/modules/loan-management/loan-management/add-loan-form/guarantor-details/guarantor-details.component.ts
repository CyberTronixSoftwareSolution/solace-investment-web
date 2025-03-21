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
  selector: "app-guarantor-details",
  templateUrl: "./guarantor-details.component.html",
  styleUrls: ["./guarantor-details.component.css"],
})
export class GuarantorDetailsComponent implements OnInit {
  FV = new CommonForm();
  selectedGuarantor: any = null;

  guarantorSuggestionsArr: any[] = [];
  guarantors: any[] = [];
  cols: any[] = [];

  loanDetails: any = null;
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

    this.FV.disableField("guarantorCode");
    this.FV.disableField("guarantorNic");
    this.FV.disableField("guarantorFullName");
  }

  ngOnInit() {
    this.loanDetails = this.loanFlowService.getLoanDetails();

    this.guarantors = this.loanDetails.guarantors || [];
    this.cols = [
      // Code , Nic, Guarantor Name
      { field: "customerCode", header: "Code" },
      { field: "nicNumber", header: "NIC" },
      { field: "fullName", header: "Guarantor Name" },
    ];
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      guarantor: ["", [Validators.required]],
      guarantorCode: ["", [Validators.required]],
      guarantorNic: ["", [Validators.required]],
      guarantorFullName: ["", [Validators.required]],
    });
  }

  async searchGuarantor(e: any) {
    let value = e.query;

    try {
      const userResult = await firstValueFrom(
        this.userService.UserSearchByParam("customer", value)
      );

      if (userResult.IsSuccessful) {
        this.guarantorSuggestionsArr = userResult.Result;
      }
    } catch (error) {
      this.messageService.showErrorAlert(error?.message || error);
    }
  }

  onGuarantorSelect(e: any) {
    this.selectedGuarantor = e.value;

    this.FV.setValue("guarantorCode", this.selectedGuarantor.customerCode);
    this.FV.setValue("guarantorNic", this.selectedGuarantor.nicNumber);
    this.FV.setValue("guarantorFullName", this.selectedGuarantor.fullName);
  }

  onGuarantorKeyUp() {
    if (this.selectedGuarantor) {
      this.FV.setValue("guarantor", this.selectedGuarantor);
    }
  }

  onClearGuarantor() {
    this.selectedGuarantor = null;
    this.FV.clearValues(
      "guarantor,guarantorCode,guarantorNic,guarantorFullName"
    );
  }

  addGuarantor() {
    if (
      this.FV.validateControllers(
        "guarantor,guarantorCode,guarantorNic,guarantorFullName"
      )
    ) {
      return;
    }

    // Check if Guarantor is already added
    let isGuarantorExists = this.guarantors.find(
      (x) => x._id === this.selectedGuarantor._id
    );

    if (isGuarantorExists) {
      this.messageService.showWarnAlert("This guarantor is already exists!");
      return;
    }

    // check id if Guarantor is borrower
    if (this.loanDetails.borrowerDetails._id === this.selectedGuarantor._id) {
      this.messageService.showWarnAlert(
        "Borrower cannot be guarantor in same loan!"
      );
      return;
    }

    this.guarantors.push(this.selectedGuarantor);

    this.onClearGuarantor();
  }

  deleteGuarantor(rowData: any) {
    let confirmationConfig = {
      message: `Are you sure you want to delete this guarantor?`,
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
    };

    this.messageService.ConfirmPopUp(
      confirmationConfig,
      (isConfirm: boolean) => {
        if (isConfirm) {
          this.onClearGuarantor();

          this.guarantors = this.guarantors.filter(
            (guarantor) => guarantor._id != rowData._id
          );

          this.messageService.showSuccessAlert(
            "Guarantor deleted successfully!"
          );
        }
      }
    );
  }
}
