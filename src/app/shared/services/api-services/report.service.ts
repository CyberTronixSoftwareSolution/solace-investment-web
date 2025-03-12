import { Injectable } from "@angular/core";
import { DataAccessService } from "../data-access.service";
import { ResourceService } from "../resource.service";

@Injectable({
  providedIn: "root",
})
export class ReportService {
  constructor(
    private dataAccess: DataAccessService,
    private resource: ResourceService
  ) {}

  GetRepaymentReportData(body: any) {
    return this.dataAccess
      .POST(this.resource.report.repaymentReport, body)
      .pipe((response) => {
        return response;
      });
  }

  GetDeductionChargeReportData(body: any) {
    return this.dataAccess
      .POST(this.resource.report.deductionChargeReport, body)
      .pipe((response) => {
        return response;
      });
  }

  GetInvestmentReportData(body: any) {
    return this.dataAccess
      .POST(this.resource.report.investmentReport, body)
      .pipe((response) => {
        return response;
      });
  }
}
