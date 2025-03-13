import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DefaultLayoutComponent } from "src/app/layout/default-layout/default-layout.component";
import { RepaymentReportComponent } from "./repayment-report/repayment-report.component";
import { DeductionChargesReportComponent } from "./deduction-charges-report/deduction-charges-report.component";
import { InvestmentReportComponent } from "./investment-report/investment-report.component";
import { DailyManagerReportComponent } from "./daily-manager-report/daily-manager-report.component";

const routes: Routes = [
  {
    path: "",
    component: DefaultLayoutComponent,
    children: [
      {
        path: "repayment-report",
        component: RepaymentReportComponent,
      },
      {
        path: "deduction-charges-report",
        component: DeductionChargesReportComponent,
      },
      {
        path: "investment-report",
        component: InvestmentReportComponent,
      },
      {
        path: "daily-manager-report",
        component: DailyManagerReportComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportRoutingModule {}
