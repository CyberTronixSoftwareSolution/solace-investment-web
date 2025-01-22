import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { CommonForm } from "src/app/shared/services/app-common-form";

@Component({
  selector: "app-expenses-income-details",
  templateUrl: "./expenses-income-details.component.html",
  styleUrls: ["./expenses-income-details.component.css"],
})
export class ExpensesIncomeDetailsComponent implements OnInit {
  FV = new CommonForm();
  expensesRecodes: any[] = [];
  expensesCols: any[] = [];
  incomeRecodes: any[] = [];
  incomeCols: any[] = [];
  totalExpenses: number = 0;
  totalIncome: number = 0;
  constructor(private formBuilder: FormBuilder) {
    this.createForm();
  }

  ngOnInit() {
    this.expensesCols = [
      { field: "expenseType", header: "Expense Type" },
      { field: "amount", header: "Amount" },
    ];

    this.incomeCols = [
      { field: "incomeType", header: "Income Type" },
      { field: "incomeAmount", header: "Amount" },
    ];
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      // expenses
      expenseType: [""],
      expenseAmount: [""],

      // income
      incomeType: [""],
      incomeAmount: [""],
    });
  }
}
