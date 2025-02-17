import { Component, OnInit } from "@angular/core";
import { PopupService } from "src/app/shared/services/popup.service";
import { PaymentReceiptComponent } from "../payment-receipt/payment-receipt.component";

@Component({
  selector: "app-receipt-bulk",
  templateUrl: "./receipt-bulk.component.html",
  styleUrls: ["./receipt-bulk.component.css"],
})
export class ReceiptBulkComponent implements OnInit {
  constructor(private popUpService: PopupService) {}

  ngOnInit() {}

  printReceipt() {
    this.popUpService.OpenModel(PaymentReceiptComponent, {
      header: "PRINT RECEIPT",
      width: "40vw",
    });
  }
}
