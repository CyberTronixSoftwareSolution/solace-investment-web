import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { banks } from "src/app/shared/data/bankData";
import { CommonForm } from "src/app/shared/services/app-common-form";
import { AddUserControlFlowService } from "../add-user-control-flow.service";

@Component({
  selector: "app-bank-details",
  templateUrl: "./bank-details.component.html",
  styleUrls: ["./bank-details.component.css"],
})
export class BankDetailsComponent implements OnInit {
  FV = new CommonForm();
  userDetail: any;
  bankArr = banks;

  BankBookImageUrl: string | ArrayBuffer | null = null;
  uploadBankBookImage: any = null;
  selectedBankBookImage: File = null;
  constructor(
    private formBuilder: FormBuilder,
    private addUserControlFlowService: AddUserControlFlowService
  ) {
    this.createForm();
  }

  ngOnInit() {}

  // "bankName": "ABC Bank",
  // "bankId": 1,
  // "branch": "Main Branch",
  // "accountNumber": "123456789012",
  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      bankName: ["", [Validators.required]],
      branchName: ["", [Validators.required]],
      accNumber: ["", [Validators.required]],
      accHolderName: ["", [Validators.required]],
    });
  }
}
