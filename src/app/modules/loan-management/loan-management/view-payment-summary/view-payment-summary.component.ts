import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { WellKnownLoanStatus } from "src/app/shared/enums/well-known-loan-status.enum";

@Component({
  selector: "app-view-payment-summary",
  templateUrl: "./view-payment-summary.component.html",
  styleUrls: ["./view-payment-summary.component.css"],
})
export class ViewPaymentSummaryComponent implements OnInit {
  paymentDetails: any[] = [];
  loanData: any = null;
  cols: any[] = [];
  totalInterest: number = 0;
  totalCapital: number = 0;
  totalInstallment: number = 0;
  constructor(
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    let dialogConfig: any = this.config.data;
    this.paymentDetails = dialogConfig.paymentDetails;
    this.loanData = dialogConfig.loanData;

    if (this.loanData.status == WellKnownLoanStatus.PENDING) {
      this.cols = [
        { field: "detailIndex", header: "#" },
        { field: "dueDate", header: "Due Date" },
        { field: "interest", header: "Interest" },
        { field: "capital", header: "Capital" },
        { field: "installment", header: "Installment" },
      ];
    } else {
      this.cols = [
        { field: "detailIndex", header: "#" },
        { field: "dueDate", header: "Due Date" },
        { field: "status", header: "Status" },
        { field: "paymentDate", header: "Payment Date" },
        { field: "interest", header: "Interest" },
        { field: "capital", header: "Capital" },
        { field: "installment", header: "Installment" },
      ];
    }

    this.paymentDetails.forEach((element: any) => {
      this.totalInterest += element.interest;
      this.totalCapital += element.capital;
      this.totalInstallment += element.installment;
      console.log(this.datePipe.transform(element.dueDate, "dd-MM-yyyy"));
    });
  }
}
