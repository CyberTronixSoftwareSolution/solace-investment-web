import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { SidebarService } from "src/app/shared/services/sidebar.service";

@Component({
  selector: "app-payment-receipt",
  templateUrl: "./payment-receipt.component.html",
  styleUrls: ["./payment-receipt.component.css"],
})
export class PaymentReceiptComponent implements OnInit {
  @ViewChild("templateRef", { static: true }) templateRef: TemplateRef<any>;
  printData: any;
  constructor(private sidebarService: SidebarService) {}

  ngOnInit() {
    let sidebarData = this.sidebarService.getData();
    this.printData = sidebarData.printData;
    console.log(this.printData);
    this.sidebarService.setFooterTemplate(this.templateRef);
  }
}
