import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { CompanyInfo } from "src/app/shared/data/comapanyInfo";
import { SidebarService } from "src/app/shared/services/sidebar.service";

@Component({
  selector: "app-daily-manager-report-template",
  templateUrl: "./daily-manager-report-template.component.html",
  styleUrls: ["./daily-manager-report-template.component.css"],
})
export class DailyManagerReportTemplateComponent implements OnInit {
  @ViewChild("templateRef", { static: true }) templateRef: TemplateRef<any>;

  companyInfo: any = CompanyInfo;
  selectedData: any;
  handOverLoanData: any;
  todayCollectLoanData: any;
  todayDeductionChargeData: any;
  newLoanData: any;
  printData: any;
  constructor(private sidebarService: SidebarService) {}

  ngOnInit() {
    this.sidebarService.setFooterTemplate(this.templateRef);
    let sidebarData: any = this.sidebarService.getData();
    this.selectedData = sidebarData.selectedData;
    this.handOverLoanData = sidebarData?.printData?.handOverLoanData;
    this.todayCollectLoanData = sidebarData?.printData?.todayCollectLoanData;
    this.todayDeductionChargeData =
      sidebarData?.printData?.todayDeductionChargeData;
    this.newLoanData = sidebarData?.printData?.newLoanData;
  }
}
