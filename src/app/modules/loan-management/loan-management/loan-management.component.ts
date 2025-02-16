import { SidebarService } from "src/app/shared/services/sidebar.service";
import { Component, OnInit } from "@angular/core";
import { AddLoanFormComponent } from "./add-loan-form/add-loan-form.component";
import { MenuItem } from "primeng/api";
import { AppComponent } from "src/app/app.component";
import { LoanFlowServiceService } from "./add-loan-form/loan-flow-service.service";
import { LoanService } from "src/app/shared/services/api-services/loan.service";

@Component({
  selector: "app-loan-management",
  templateUrl: "./loan-management.component.html",
  styleUrls: ["./loan-management.component.css"],
})
export class LoanManagementComponent implements OnInit {
  constructor(
    private sidebarService: SidebarService,
    private appComponent: AppComponent,
    private loanFlowService: LoanFlowServiceService,
    private loanService: LoanService
  ) {}

  ngOnInit() {
    this.sidebarService.sidebarEvent.subscribe((response) => {
      if (response) {
        this.getAllLoans();
      }

      this.sidebarService.removeComponent();
      this.appComponent.sidebarVisible = false;
      this.loanFlowService.resetData();
    });
  }

  getAllLoans() {}

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
