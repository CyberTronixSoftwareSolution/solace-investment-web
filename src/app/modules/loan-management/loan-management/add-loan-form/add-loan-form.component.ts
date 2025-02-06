import { Component, OnInit } from "@angular/core";
import { MenuItem } from "primeng/api";

@Component({
  selector: "app-add-loan-form",
  templateUrl: "./add-loan-form.component.html",
  styleUrls: ["./add-loan-form.component.css"],
})
export class AddLoanFormComponent implements OnInit {
  value: any = { value: 0, label: "Personal" };
  showingIndex: number = 0;

  activeIndex: any = 0;
  items: MenuItem[];
  constructor() {}

  ngOnInit() {
    this.items = [
      {
        value: 0,
        label: "General Details",
      },
      {
        value: 1,
        label: "Other Details",
      },
      {
        value: 2,
        label: "Guarantor Details",
      },
      {
        value: 3,
        label: "Loan Summary",
      },
    ];
  }

  handleClick(index: number): void {
    this.showingIndex = index;
  }
}
