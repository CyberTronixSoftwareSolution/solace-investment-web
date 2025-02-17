import { Component, OnInit } from "@angular/core";
import { SidebarService } from "src/app/shared/services/sidebar.service";

@Component({
  selector: "app-payment-receipt",
  templateUrl: "./payment-receipt.component.html",
  styleUrls: ["./payment-receipt.component.css"],
})
export class PaymentReceiptComponent implements OnInit {
  constructor(private sideBarService: SidebarService) {}

  ngOnInit() {}
}
