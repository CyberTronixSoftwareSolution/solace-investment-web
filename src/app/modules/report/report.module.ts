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
import { StepsModule } from "primeng/steps";
import { ToastModule } from "primeng/toast";
import { NgxPrintModule } from "ngx-print";

import { ReportRoutingModule } from "./report-routing.module";
import { RepaymentReportComponent } from "./repayment-report/repayment-report.component";
import { DeductionChargesReportComponent } from "./deduction-charges-report/deduction-charges-report.component";
import { RepaymentTemplateComponent } from "./repayment-report/repayment-template/repayment-template.component";
import { InvestmentReportComponent } from "./investment-report/investment-report.component";
import { InvestmentReportTemplateComponent } from "./investment-report/investment-report-template/investment-report-template.component";

@NgModule({
  declarations: [
    RepaymentReportComponent,
    DeductionChargesReportComponent,
    RepaymentTemplateComponent,
    InvestmentReportComponent,
    InvestmentReportTemplateComponent,
  ],
  imports: [
    CommonModule,
    ReportRoutingModule,
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
    NgxPrintModule,
  ],
})
export class ReportModule {}
