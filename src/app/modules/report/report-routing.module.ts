import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DefaultLayoutComponent } from "src/app/layout/default-layout/default-layout.component";
import { RepaymentReportComponent } from "./repayment-report/repayment-report.component";
import { DeductionChargesReportComponent } from "./deduction-charges-report/deduction-charges-report.component";

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
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportRoutingModule {}
