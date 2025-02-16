import { DatePipe } from "@angular/common";
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
  loanSchedule: any[] = [];
  cols: any[] = [];
  totalData: any = {
    totalInterest: 0,
    totalCapital: 0,
    totalInstallment: 0,
  };
  constructor(
    private config: DynamicDialogConfig,
    private messageService: AppMessageService,
    private ref: DynamicDialogRef,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    let dialogConfig: any = this.config.data;
    this.product = dialogConfig.product;

    this.cols = [
      { field: "index", header: "#" },
      { field: "dueDate", header: "Due Date" },
      { field: "interestPerTerm", header: "Interest" },
      { field: "capital", header: "Capital" },
      { field: "installment", header: "Installment" },
    ];

    this.calculateLoanSchedule();
  }

  calculateLoanSchedule() {
    this.loanSchedule = [];

    let totalInterest = this.product.rate;

    if (this.product.isPercentage) {
      totalInterest = (this.product.amount * this.product.rate) / 100;
    }

    let dueDate = this.product.disbursementDate
      ? new Date(this.product.disbursementDate)
      : new Date();

    let interestPerTerm = totalInterest / this.product.termsCount;
    let capital = this.product.amount / this.product.termsCount;

    this.totalData.totalInterest = totalInterest;
    this.totalData.totalCapital = this.product.amount;
    this.totalData.totalInstallment = this.product.amount + totalInterest;

    for (let i = 1; i <= this.product.termsCount; i++) {
      // Change due date
      if (this.product.type == "M") {
        dueDate.setMonth(dueDate.getMonth() + 1);
      } else if (this.product.type == "W") {
        dueDate.setDate(dueDate.getDate() + 7);
      } else if (this.product.type == "D") {
        dueDate.setDate(dueDate.getDate() + 1);
      }

      let data = {
        index: i,
        dueDate: this.datePipe.transform(dueDate, "yyyy-MM-dd"),
        interestPerTerm: interestPerTerm,
        capital: capital,
        installment: capital + interestPerTerm,
      };

      this.loanSchedule.push(data);
    }
  }
}
