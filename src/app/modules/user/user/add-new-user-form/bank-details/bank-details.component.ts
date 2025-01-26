import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { banks } from "src/app/shared/data/bankData";
import { CommonForm } from "src/app/shared/services/app-common-form";
import { AddUserControlFlowService } from "../add-user-control-flow.service";
import { WebcamViewComponent } from "src/app/shared/components/webcam-view/webcam-view.component";
import { PopupService } from "src/app/shared/services/popup.service";
import { WellKnownUploadType } from "src/app/shared/enums/well-known-upload-type.enum";

@Component({
  selector: "app-bank-details",
  templateUrl: "./bank-details.component.html",
  styleUrls: ["./bank-details.component.css"],
})
export class BankDetailsComponent implements OnInit {
  FV = new CommonForm();
  userDetail: any;
  bankArr = banks;

  WellKnownUploadType = WellKnownUploadType;

  BankBookImageUrl: string | ArrayBuffer | null = null;
  uploadBankBookImage: any = null;
  selectedBankBookImage: File = null;

  isBankSelected: boolean = false;
  isView: boolean = false;
  isEdit: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private addUserControlFlowService: AddUserControlFlowService,
    private popUpService: PopupService
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.userDetail = this.addUserControlFlowService.getUserDetail();
    this.isView = this.addUserControlFlowService.getIsView();
    this.isEdit = this.addUserControlFlowService.getIsEdit();

    this.setValue();
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      bankName: [null],
      branchName: [""],
      accNumber: [""],
      accHolderName: [""],
    });
  }

  setValue() {
    let selectedBank =
      this.bankArr.find((bank) => bank.id == this.userDetail.bankId) || null;

    this.FV.setValue("bankName", selectedBank);
    if (selectedBank) {
      this.onBankChange(selectedBank);
    }
    this.FV.setValue("branchName", this.userDetail.branch);
    this.FV.setValue("accNumber", this.userDetail.accountNumber);
    this.FV.setValue("accHolderName", this.userDetail.accountHolderName);

    if (this.userDetail.bankBookUrl) {
      this.BankBookImageUrl = this.userDetail.bankBookUrl;
    }

    if (this.isView) {
      this.FV.disableFormControlls();
    }
  }

  onBankChange(e: any) {
    this.isBankSelected = true;
    this.FV.formGroup.get("branchName").setValidators([Validators.required]);
    this.FV.formGroup.get("accNumber").setValidators([Validators.required]);
    this.FV.formGroup.get("accHolderName").setValidators([Validators.required]);

    this.FV.formGroup.get("branchName").updateValueAndValidity();
    this.FV.formGroup.get("accNumber").updateValueAndValidity();
    this.FV.formGroup.get("accHolderName").updateValueAndValidity();
  }

  onBankClear() {
    this.isBankSelected = false;

    this.FV.formGroup.get("branchName").clearValidators();
    this.FV.formGroup.get("accNumber").clearValidators();
    this.FV.formGroup.get("accHolderName").clearValidators();

    this.FV.formGroup.get("branchName").updateValueAndValidity();
    this.FV.formGroup.get("accNumber").updateValueAndValidity();
    this.FV.formGroup.get("accHolderName").updateValueAndValidity();
  }

  openUploadDialog(uploadType: number) {
    let header = "Capture Bank Book Image";

    this.popUpService
      .OpenModel(WebcamViewComponent, {
        header: header,
        width: "35vw",
        height: "35vh",
      })
      .subscribe((res) => {
        if (res?.isSave) {
          debugger;
          this.uploadBankBookImage = res;
          this.BankBookImageUrl = res.imageUrl;
          this.selectedBankBookImage = res.file;

          this.addUserControlFlowService.setUploadImage(
            uploadType,
            res.file,
            res.imageUrl
          );
        }
      });
  }

  removeImage(uploadType: number) {
    this.uploadBankBookImage = null;
    this.BankBookImageUrl = null;
    this.selectedBankBookImage = null;
    let userDetails = {
      ...this.userDetail,
      bankBookUrl: "",
    };
    this.addUserControlFlowService.setUserDetail(userDetails);

    this.addUserControlFlowService.setUploadImage(uploadType, null, "");
  }
}
