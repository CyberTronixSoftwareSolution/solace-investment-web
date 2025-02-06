import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

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
import { InputGroupModule } from "primeng/inputgroup";
import { InputGroupAddonModule } from "primeng/inputgroupaddon";
import { AutoCompleteModule } from "primeng/autocomplete";

import { LoanManagementRoutingModule } from "./loan-management-routing.module";
import { LoanManagementComponent } from "./loan-management/loan-management.component";
import { StepsModule } from "primeng/steps";
import { ToastModule } from "primeng/toast";

import { AddLoanFormComponent } from "./loan-management/add-loan-form/add-loan-form.component";
import { GeneralInformationComponent } from "./loan-management/add-loan-form/general-information/general-information.component";
import { LoanSummaryComponent } from "./loan-management/add-loan-form/loan-summary/loan-summary.component";
import { OtherDetailsComponent } from "./loan-management/add-loan-form/other-details/other-details.component";
import { GuarantorDetailsComponent } from "./loan-management/add-loan-form/guarantor-details/guarantor-details.component";
import { LoanScheduleComponent } from "./loan-management/add-loan-form/general-information/loan-schedule/loan-schedule.component";

@NgModule({
  declarations: [
    LoanManagementComponent,
    AddLoanFormComponent,
    GeneralInformationComponent,
    LoanManagementComponent,
    LoanSummaryComponent,
    OtherDetailsComponent,
    GuarantorDetailsComponent,
    LoanScheduleComponent,
  ],
  imports: [
    CommonModule,
    LoanManagementRoutingModule,
    CommonModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    CheckboxModule,
    PasswordModule,
    CommonModule,
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
    InputGroupModule,
    InputGroupAddonModule,
    AutoCompleteModule,
  ],
})
export class LoanManagementModule {}
