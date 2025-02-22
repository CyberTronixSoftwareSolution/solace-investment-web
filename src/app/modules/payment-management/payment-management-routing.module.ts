import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ReceiptBulkComponent } from "./receipt-bulk/receipt-bulk.component";
import { DefaultLayoutComponent } from "src/app/layout/default-layout/default-layout.component";
import { ReceiptsComponent } from "./receipts/receipts.component";

const routes: Routes = [
  {
    path: "",
    component: DefaultLayoutComponent,
    children: [
      {
        path: "receipt-bulk",
        component: ReceiptBulkComponent,
      },
      {
        path: "receipts",
        component: ReceiptsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentManagementRoutingModule {}
