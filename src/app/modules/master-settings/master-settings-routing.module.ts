import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DefaultLayoutComponent } from "src/app/layout/default-layout/default-layout.component";
import { ProductManagementComponent } from "./product-management/product-management.component";

const routes: Routes = [
  {
    path: "",
    component: DefaultLayoutComponent,
    children: [
      {
        path: "product-management",
        component: ProductManagementComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MasterSettingsRoutingModule {}
