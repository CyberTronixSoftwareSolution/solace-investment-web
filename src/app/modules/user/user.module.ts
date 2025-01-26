import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { UserRoutingModule } from "./user-routing.module";
import { ChangePasswordComponent } from "./change-password/change-password.component";

import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from "primeng/button";
import { PasswordModule } from "primeng/password";
import { CheckboxModule } from "primeng/checkbox";
import { SidebarModule } from "primeng/sidebar";
import { TableModule } from "primeng/table";
import { MultiSelectModule } from "primeng/multiselect";
import { TooltipModule } from "primeng/tooltip";
import { SelectButtonModule } from "primeng/selectbutton";
import { DropdownModule } from "primeng/dropdown";
import { CalendarModule } from "primeng/calendar";
import { DividerModule } from "primeng/divider";
import { AccordionModule } from "primeng/accordion";
import { RadioButtonModule } from "primeng/radiobutton";
import { SplitButtonModule } from "primeng/splitbutton";
import { MenuModule } from "primeng/menu";
import { CardModule } from "primeng/card";
import { ChartModule } from "primeng/chart";
import { ChipsModule } from "primeng/chips";
import { AvatarModule } from "primeng/avatar";
import { InputTextareaModule } from "primeng/inputtextarea";
import { OverlayPanelModule } from "primeng/overlaypanel";
import { OrderListModule } from "primeng/orderlist";
import { ToggleButtonModule } from "primeng/togglebutton";
import { InputNumberModule } from "primeng/inputnumber";
import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";
import { ImageModule } from "primeng/image";
import { InputMaskModule } from "primeng/inputmask";
import { TagModule } from "primeng/tag";

import { StepsModule } from "primeng/steps";
import { ToastModule } from "primeng/toast";
import { UserComponent } from "./user/user.component";
import { AddNewUserFormComponent } from "./user/add-new-user-form/add-new-user-form.component";
import { BankDetailsComponent } from "./user/add-new-user-form/bank-details/bank-details.component";
import { ExpensesIncomeDetailsComponent } from "./user/add-new-user-form/expenses-income-details/expenses-income-details.component";
import { FamilyDetailsComponent } from "./user/add-new-user-form/family-details/family-details.component";
import { PersonalDetailsComponent } from "./user/add-new-user-form/personal-details/personal-details.component";
import { ProfileComponent } from "./profile/profile.component";

@NgModule({
  declarations: [
    ChangePasswordComponent,
    UserComponent,
    AddNewUserFormComponent,
    BankDetailsComponent,
    ExpensesIncomeDetailsComponent,
    FamilyDetailsComponent,
    PersonalDetailsComponent,
    ProfileComponent,
  ],
  imports: [
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    CheckboxModule,
    PasswordModule,
    CommonModule,
    UserRoutingModule,
    SidebarModule,
    TableModule,
    MultiSelectModule,
    TooltipModule,
    SelectButtonModule,
    DropdownModule,
    CalendarModule,
    DividerModule,
    AccordionModule,
    RadioButtonModule,
    SplitButtonModule,
    MenuModule,
    ChartModule,
    AvatarModule,
    InputTextareaModule,
    OverlayPanelModule,
    OrderListModule,
    ChipsModule,
    StepsModule,
    ToastModule,
    CardModule,
    ToggleButtonModule,
    InputNumberModule,
    IconFieldModule,
    InputIconModule,
    ImageModule,
    InputMaskModule,
    TagModule,
  ],
})
export class UserModule {}
