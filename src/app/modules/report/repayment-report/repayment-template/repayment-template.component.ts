import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { CompanyInfo } from "src/app/shared/data/comapanyInfo";
import { SidebarService } from "src/app/shared/services/sidebar.service";

@Component({
  selector: "app-repayment-template",
  templateUrl: "./repayment-template.component.html",
  styleUrls: ["./repayment-template.component.css"],
})
export class RepaymentTemplateComponent implements OnInit {
  @ViewChild("templateRef", { static: true }) templateRef: TemplateRef<any>;
  constructor(private sidebarService: SidebarService) {}
  fromDate: Date = new Date();
  product: any;
  recoveryOfficer: any;
  collectionDate: any;
  printData: any;
  totalLoanAmount: number = 0;
  totalInstallment: number = 0;
  totalBalance: number = 0;
  totalArrears: number = 0;
  companyInfo: any = CompanyInfo;
  ngOnInit() {
    this.sidebarService.setFooterTemplate(this.templateRef);
    let sidebarData: any = this.sidebarService.getData();
    this.fromDate = sidebarData?.searchData?.fromDate;
    this.product = sidebarData?.searchData?.product;
    this.recoveryOfficer = sidebarData?.searchData?.recoveryOfficer;
    this.collectionDate = sidebarData?.searchData?.collectionDate;
    this.printData = sidebarData?.printData;

    this.printData.forEach((element: any) => {
      this.totalLoanAmount += element.loanAmount;
      this.totalInstallment += element.installment;
      this.totalBalance += element.balance;
      this.totalArrears += element.arrears;
    });
  }
}
