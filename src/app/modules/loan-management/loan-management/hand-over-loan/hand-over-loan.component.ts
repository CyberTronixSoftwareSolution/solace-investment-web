import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, Validators } from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { LoanService } from "src/app/shared/services/api-services/loan.service";
import { CommonForm } from "src/app/shared/services/app-common-form";
import { AppMessageService } from "src/app/shared/services/app-message.service";

@Component({
  selector: "app-hand-over-loan",
  templateUrl: "./hand-over-loan.component.html",
  styleUrls: ["./hand-over-loan.component.css"],
})
export class HandOverLoanComponent implements OnInit {
  loanData: any = null;
  FV = new CommonForm();
  today: Date = new Date();
  constructor(
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private formBuilder: UntypedFormBuilder,
    private loanService: LoanService,
    private messageService: AppMessageService
  ) {
    this.createForm();
  }

  ngOnInit() {
    let dialogConfig = this.config.data;
    this.loanData = dialogConfig.loanData;
    this.setData();
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      product: [""],
      loanNo: [""],
      remark: [""],
      disbursementDate: ["", [Validators.required]],
    });
  }

  setData() {
    this.FV.setValue("product", this.loanData?.product?.productName);
    this.FV.setValue("loanNo", this.loanData?.loanNumber);
    this.today = this.loanData?.disbursementDate
      ? new Date(this.loanData?.disbursementDate)
      : new Date();

    this.FV.setValue("disbursementDate", this.today);
  }

  onSave() {
    if (this.FV.formGroup.invalid) {
      this.FV.showErrors();
      return;
    }

    let data = this.FV.formGroup.value;

    let request = {
      transactionDate: data.disbursementDate,
      remark: data.remark,
    };

    this.loanService
      .HandOverLoan(this.loanData?._id, request)
      .subscribe((response: any) => {
        if (response.IsSuccessful) {
          this.messageService.showSuccessAlert(response.Message);
          this.ref.close(true);
        } else {
          this.messageService.showErrorAlert(response.Message);
        }
      });
  }

  onCancel() {
    this.ref.close(false);
  }
}
