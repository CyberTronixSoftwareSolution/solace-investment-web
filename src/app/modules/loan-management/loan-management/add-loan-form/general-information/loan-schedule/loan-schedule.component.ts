import { Component, OnInit } from "@angular/core";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { AppMessageService } from "src/app/shared/services/app-message.service";

@Component({
  selector: "app-loan-schedule",
  templateUrl: "./loan-schedule.component.html",
  styleUrls: ["./loan-schedule.component.css"],
})
export class LoanScheduleComponent implements OnInit {
  product: any = null;
  constructor(
    private config: DynamicDialogConfig,
    private messageService: AppMessageService,
    private ref: DynamicDialogRef
  ) {}

  ngOnInit() {
    let dialogConfig: any = this.config.data;
    this.product = dialogConfig.product;
  }
}
