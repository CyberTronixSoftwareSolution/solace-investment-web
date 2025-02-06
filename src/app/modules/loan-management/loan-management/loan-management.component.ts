import { SidebarService } from "src/app/shared/services/sidebar.service";
import { Component, OnInit } from "@angular/core";
import { AddLoanFormComponent } from "./add-loan-form/add-loan-form.component";
import { MenuItem } from "primeng/api";

@Component({
  selector: "app-loan-management",
  templateUrl: "./loan-management.component.html",
  styleUrls: ["./loan-management.component.css"],
})
export class LoanManagementComponent implements OnInit {
  constructor(private sidebarService: SidebarService) {}

  ngOnInit() {}

  onClickAddNew() {
    let data = {
      loanData: null,
      isEdit: false,
    };

    let properties = {
      width: "60vw",
      position: "right",
    };

    this.sidebarService.addComponent(
      `Add New Loan`,
      AddLoanFormComponent,
      properties,
      data
    );
  }
}
