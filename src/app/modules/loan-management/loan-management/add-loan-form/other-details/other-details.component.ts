import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
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
  collectingDatesArr: any[] = [];

  deductionCharges: any[] = [];
  chargeCols: any[] = [];
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
    this.chargeCols = [
      { field: "deductionChargeName", header: "Deduction Charge Name" },
      { field: "rate", header: "Rate" },
      { field: "amount", header: "Amount" },
    ];
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({});
  }
}
