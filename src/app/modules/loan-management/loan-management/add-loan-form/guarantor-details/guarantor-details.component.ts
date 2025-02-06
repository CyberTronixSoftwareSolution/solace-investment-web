import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { CommonForm } from "src/app/shared/services/app-common-form";
import { AppMessageService } from "src/app/shared/services/app-message.service";
import { HelperService } from "src/app/shared/services/helper.service";
import { MasterDataService } from "src/app/shared/services/master-data.service";
import { PopupService } from "src/app/shared/services/popup.service";

@Component({
  selector: "app-guarantor-details",
  templateUrl: "./guarantor-details.component.html",
  styleUrls: ["./guarantor-details.component.css"],
})
export class GuarantorDetailsComponent implements OnInit {
  FV = new CommonForm();
  guarantors: any[] = [];
  cols: any[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private popUpService: PopupService,
    private helper: HelperService,
    private messageService: AppMessageService,
    private masterDataService: MasterDataService
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.cols = [
      // Code , Nic, Guarantor Name
      { field: "code", header: "Code" },
      { field: "nic", header: "NIC" },
      { field: "guarantorName", header: "Guarantor Name" },
    ];
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({});
  }
}
