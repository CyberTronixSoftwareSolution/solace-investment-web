import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { CompanyInfo } from "src/app/shared/data/comapanyInfo";
import { SidebarService } from "src/app/shared/services/sidebar.service";

@Component({
  selector: "app-investment-report-template",
  templateUrl: "./investment-report-template.component.html",
  styleUrls: ["./investment-report-template.component.css"],
})
export class InvestmentReportTemplateComponent implements OnInit {
  @ViewChild("templateRef", { static: true }) templateRef: TemplateRef<any>;
  printData: any[] = [];
  companyInfo: any = CompanyInfo;
  selectedData: any;
  totalAmount: number = 0;
  totalInvestment: number = 0;
  constructor(private sidebarService: SidebarService) {}

  ngOnInit() {
    this.sidebarService.setFooterTemplate(this.templateRef);
    let sidebarData: any = this.sidebarService.getData();
    this.printData = sidebarData.printData;
    this.selectedData = sidebarData.selectedData;

    this.totalAmount = this.printData.reduce(
      (total, recode) => total + recode.loanAmount,
      0
    );

    this.totalInvestment = this.printData.reduce(
      (total, recode) => total + recode.investment,
      0
    );
  }
}
