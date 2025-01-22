import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { MenuItem } from "primeng/api";
import { SidebarService } from "src/app/shared/services/sidebar.service";
import { AddUserControlFlowService } from "./add-user-control-flow.service";

@Component({
  selector: "app-add-new-user-form",
  templateUrl: "./add-new-user-form.component.html",
  styleUrls: ["./add-new-user-form.component.css"],
})
export class AddNewUserFormComponent implements OnInit {
  @ViewChild("templateRef", { static: true }) templateRef: TemplateRef<any>;

  items: MenuItem[];
  value: any = { value: 0, label: "Personal" };
  showingIndex: number = 0;

  isEdit: boolean = false;
  constructor(
    private sidebarService: SidebarService,
    private addUserControlFlowService: AddUserControlFlowService
  ) {}

  ngOnInit() {
    let sideBarData = this.sidebarService.getData();
    this.sidebarService.setFooterTemplate(this.templateRef);

    this.items = [
      {
        value: 0,
        label: "Personal",
      },
      {
        value: 1,
        label: "Bank Details",
      },
      {
        value: 2,
        label: "Family Details",
      },
      {
        value: 3,
        label: "Expenses/Income",
      },
    ];
  }

  handleClick(index: number): void {
    let isStepCompleted = this.addUserControlFlowService.getStepValue(
      index
    ) as boolean;

    isStepCompleted = true;
    if (isStepCompleted) {
      this.showingIndex = index;
    } else {
      return;
    }
  }

  handleCancel() {
    this.sidebarService.sidebarEvent.emit(false);
  }
}
