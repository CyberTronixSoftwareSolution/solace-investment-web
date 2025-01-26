import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { UserComponent } from "./user/user.component";
import { DefaultLayoutComponent } from "src/app/layout/default-layout/default-layout.component";
import { ProfileComponent } from "./profile/profile.component";

const routes: Routes = [
  {
    path: "",
    component: DefaultLayoutComponent,
    children: [
      {
        path: "",
        component: UserComponent,
      },
      {
        path: "profile",
        component: ProfileComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
