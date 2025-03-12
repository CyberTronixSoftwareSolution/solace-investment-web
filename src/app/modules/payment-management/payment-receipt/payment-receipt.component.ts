import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { CompanyInfo } from "src/app/shared/data/comapanyInfo";
import { SidebarService } from "src/app/shared/services/sidebar.service";
import html2canvas from "html2canvas";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-payment-receipt",
  templateUrl: "./payment-receipt.component.html",
  styleUrls: ["./payment-receipt.component.css"],
})
export class PaymentReceiptComponent implements OnInit {
  @ViewChild("templateRef", { static: true }) templateRef: TemplateRef<any>;
  printData: any;
  companyInfo: any = CompanyInfo;
  constructor(
    private sidebarService: SidebarService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    let sidebarData = this.sidebarService.getData();
    this.printData = sidebarData.printData;
    console.log(this.printData);
    this.sidebarService.setFooterTemplate(this.templateRef);
  }

  printBluetoothReceipt() {
    debugger;
  }

  downloadAsImage() {
    const element = document.getElementById("demo");
    if (element) {
      html2canvas(element, { scale: 2, allowTaint: true, useCORS: true }).then(
        (canvas) => {
          const image = canvas.toDataURL("image/png");
          const link = document.createElement("a");
          link.href = image;
          link.download = `${
            this.printData?.receiptNo
          } - ${this.datePipe.transform(new Date(), "short")}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      );
    }
  }
}
