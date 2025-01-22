import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import {
  expenseTypes,
  incomeTypes,
} from "src/app/shared/data/expensesIncomeTypeData";
import { CommonForm } from "src/app/shared/services/app-common-form";
import { AppMessageService } from "src/app/shared/services/app-message.service";
import { HelperService } from "src/app/shared/services/helper.service";

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
  incomeTypeArr: any[] = incomeTypes;
  expenseTypeArr: any[] = expenseTypes;
  constructor(
    private formBuilder: FormBuilder,
    private helperService: HelperService,
    private messageService: AppMessageService
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.expensesCols = [
      { field: "expenseType", header: "Expense Type" },
      { field: "amount", header: "Amount" },
    ];

    this.incomeCols = [
      { field: "incomeType", header: "Income Type" },
      { field: "amount", header: "Amount" },
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

  addNewExpenseIncome(type: number) {
    // 1 = expense, 2 = income
    let validateParam =
      type == 1 ? "expenseType,expenseAmount" : "incomeAmount,incomeAmount";

    if (this.FV.validateControllers(validateParam)) {
      return;
    }

    if (type == 1) {
      let expenseType = this.FV.getValue("expenseType");
      let expenseAmount = this.FV.getValue("expenseAmount");

      let selectedExpenseType = this.expenseTypeArr.find(
        (x) => x.id == expenseType
      );

      this.expensesRecodes.push({
        _id: this.helperService.generateUniqueId(this.expensesRecodes),
        expenseTypeId: expenseType,
        expenseType: selectedExpenseType.name,
        amount: expenseAmount,
      });
    } else {
      let incomeType = this.FV.getValue("incomeType");
      let incomeAmount = this.FV.getValue("incomeAmount");

      let selectedIncomeType = this.incomeTypeArr.find(
        (x) => x.id == incomeType
      );

      this.incomeRecodes.push({
        _id: this.helperService.generateUniqueId(this.incomeRecodes),
        incomeTypeId: incomeType,
        incomeType: selectedIncomeType.name,
        amount: incomeAmount,
      });
    }

    this.clearExpenseIncomeData(type);
    this.recalculateTotalAmounts();
  }

  clearExpenseIncomeData(type: number) {
    // 1 = expense, 2 = income
    if (type == 1) {
      this.FV.clearValues("expenseType,expenseAmount");
      this.FV.setValue("expenseAmount", 0);
    } else {
      this.FV.clearValues("incomeType,incomeAmount");
      this.FV.setValue("incomeAmount", 0);
    }
  }

  deleteExpenseIncomeDetail(rowData: any, type: number) {
    // 1 = expense, 2 = income

    let confirmationConfig = {
      message: `Are you sure you want to delete this ${
        type == 1 ? "expense" : "income"
      }?`,
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
    };

    this.messageService.ConfirmPopUp(
      confirmationConfig,
      (isConfirm: boolean) => {
        if (isConfirm) {
          if (type == 1) {
            let index = this.expensesRecodes.findIndex(
              (x) => x._id == rowData._id
            );
            this.expensesRecodes.splice(index, 1);
          } else {
            let index = this.incomeRecodes.findIndex(
              (x) => x._id == rowData._id
            );
            this.incomeRecodes.splice(index, 1);
          }

          this.recalculateTotalAmounts();
        }
      }
    );
  }

  recalculateTotalAmounts() {
    this.totalExpenses = 0;
    this.totalIncome = 0;

    this.expensesRecodes.forEach((element) => {
      this.totalExpenses += element.amount;
    });

    this.incomeRecodes.forEach((element) => {
      this.totalIncome += element.amount;
    });
  }
}
