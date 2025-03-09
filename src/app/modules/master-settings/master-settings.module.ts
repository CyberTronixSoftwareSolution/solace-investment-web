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

import { MasterSettingsRoutingModule } from "./master-settings-routing.module";
import { ProductManagementComponent } from "./product-management/product-management.component";
import { StepsModule } from "primeng/steps";
import { ToastModule } from "primeng/toast";
import { AddProductFormComponent } from "./product-management/add-product-form/add-product-form.component";
import { SharedModule } from "src/app/shared.module";

@NgModule({
  declarations: [ProductManagementComponent, AddProductFormComponent],
  imports: [
    CommonModule,
    MasterSettingsRoutingModule,
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
    SharedModule,
  ],
})
export class MasterSettingsModule {}
