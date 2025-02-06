import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { DefaultDashboardComponent } from "./layout/default-dashboard/default-dashboard.component";
import { RouteGuardService } from "./shared/services/route-guard.service";
import { DefaultLayoutComponent } from "./layout/default-layout/default-layout.component";
import { SignInComponent } from "./shared/components/sign-in/sign-in.component";

const routes: Routes = [
  { path: "", component: SignInComponent, pathMatch: "full" },
  { path: "login", component: SignInComponent },
  {
    path: "dashboard",
    component: DefaultLayoutComponent,
    children: [
      {
        path: "",
        component: DefaultDashboardComponent,
      },
    ],
  },
  {
    path: "user",
    loadChildren: () =>
      import("./modules/user/user.module").then((m) => m.UserModule),
    // canActivate: [RouteGuardService],
  },
  {
    path: "master-settings",
    loadChildren: () =>
      import("./modules/master-settings/master-settings.module").then(
        (m) => m.MasterSettingsModule
      ),
    // canActivate: [RouteGuardService],
  },
  {
    path: "loan-management",
    loadChildren: () =>
      import("./modules/loan-management/loan-management.module").then(
        (m) => m.LoanManagementModule
      ),
    // canActivate: [RouteGuardService],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  // imports: [
  //     RouterModule.forRoot([
  //         {
  //             path: '', component: AppMainComponent,
  //             // children: [
  //             //     {path: 'blocks', component: BlocksComponent},
  //             // ]
  //         },
  //         {path: '**', redirectTo: '/notfound'},
  //     ], {scrollPositionRestoration: 'enabled'})
  // ],
  // exports: [RouterModule]
})
export class AppRoutingModule {}
