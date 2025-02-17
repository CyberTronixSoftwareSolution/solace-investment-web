import { SidebarService } from "src/app/shared/services/sidebar.service";
import { Component, OnInit } from "@angular/core";
import { AddLoanFormComponent } from "./add-loan-form/add-loan-form.component";
import { MenuItem } from "primeng/api";
import { AppComponent } from "src/app/app.component";
import { LoanFlowServiceService } from "./add-loan-form/loan-flow-service.service";
import { LoanService } from "src/app/shared/services/api-services/loan.service";
import { CommonForm } from "src/app/shared/services/app-common-form";
import { UntypedFormBuilder } from "@angular/forms";
import { WellKnownLoanStatus } from "src/app/shared/enums/well-known-loan-status.enum";
import { AppMessageService } from "src/app/shared/services/app-message.service";
import { firstValueFrom } from "rxjs";
import { PopupService } from "src/app/shared/services/popup.service";
import { ViewPaymentSummaryComponent } from "./view-payment-summary/view-payment-summary.component";
import { HandOverLoanComponent } from "./hand-over-loan/hand-over-loan.component";
import { DatePipe } from "@angular/common";
import { ExcelService } from "src/app/shared/services/excel.service";

@Component({
  selector: "app-loan-management",
  templateUrl: "./loan-management.component.html",
  styleUrls: ["./loan-management.component.css"],
})
export class LoanManagementComponent implements OnInit {
  cols: any;
  recodes: any;
  status: any[] = [
    {
      label: "All",
      value: -1,
    },
    {
      label: "Pending",
      value: 1,
    },
    {
      label: "Running",
      value: 2,
    },
    {
      label: "Completed",
      value: 3,
    },
  ];
  items: any[] = [];
  filteredItems: any[] = [];
  FV = new CommonForm();
  constructor(
    private sidebarService: SidebarService,
    private appComponent: AppComponent,
    private loanFlowService: LoanFlowServiceService,
    private loanService: LoanService,
    private formBuilder: UntypedFormBuilder,
    private messageService: AppMessageService,
    private popUpService: PopupService,
    private datePipe: DatePipe,
    private excelService: ExcelService
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.cols = [
      { field: "loanCode", header: "Code" },
      { field: "customer", header: "Customer" },
      { field: "recoverOfficer", header: "Recover Officer" },
      { field: "collectionDate", header: "Collection Date" },
      { field: "product", header: "Product" },
      { field: "amount", header: "Amount" },
      { field: "agreedAmount", header: "Agreed Amount" },
      { field: "payedAmount", header: "Payed Amount" },
      { field: "status", header: "Status" },
    ];

    this.getAllLoans();

    this.items = [
      {
        id: 1,
        label: "Hand Over Loan",
        icon: "pi pi-money-bill",
        command: (event: any) => {
          this.handOverLoan(event.item.data);
        },
      },
      {
        id: 2,
        label: "View payment Summary",
        icon: "pi pi-sitemap",
        command: (event: any) => {
          this.paymentSummary(event.item.data);
        },
      },
      {
        id: 3,
        label: "Cancel Loan",
        icon: "pi pi-trash",
        command: (event: any) => {
          this.cancelLoan(event.item.data);
        },
      },
    ];

    this.sidebarService.sidebarEvent.subscribe((response) => {
      if (response) {
        this.getAllLoans();
      }

      this.sidebarService.removeComponent();
      this.appComponent.sidebarVisible = false;
      this.loanFlowService.resetData();
    });
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      status: [-1],
    });
  }

  toggleMenu(menu: any, event: any, rowData: any) {
    this.filteredItems = [];

    this.items.forEach((menuItem: any) => {
      if (
        rowData.status == WellKnownLoanStatus.PENDING &&
        [1, 3].includes(menuItem.id)
      ) {
        this.filteredItems.push(menuItem);
      }

      if ([2].includes(menuItem.id)) {
        this.filteredItems.push(menuItem);
      }
    });

    this.filteredItems.forEach((menuItem) => {
      menuItem.data = rowData;
    });
    menu.toggle(event);
  }

  getAllLoans() {
    let status = this.FV.getValue("status");
    this.loanService.GetAllLoans(status).subscribe((response) => {
      if (response.IsSuccessful) {
        this.recodes = response.Result;
      }
    });
  }

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

  cancelLoan(rowData: any) {
    let confirmationConfig = {
      message: `Are you sure you want to cancel this loan?`,
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
    };

    this.messageService.ConfirmPopUp(
      confirmationConfig,
      (isConfirm: boolean) => {
        if (isConfirm) {
          this.loanService
            .DeleteLoanByHeader(rowData._id)
            .subscribe((response) => {
              if (response.IsSuccessful) {
                this.messageService.showSuccessAlert(response.Message);
                this.getAllLoans();
              } else {
                this.messageService.showErrorAlert(response.Message);
              }
            });
        }
      }
    );
  }

  async paymentSummary(rowData: any) {
    try {
      let data = {
        paymentDetails: [],
        loanData: rowData,
      };

      const paymentDetailsResult = await firstValueFrom(
        this.loanService.GetLoanDetailsByHeader(rowData._id)
      );

      if (paymentDetailsResult.IsSuccessful) {
        data.paymentDetails = paymentDetailsResult.Result;
      }

      this.popUpService.OpenModel(ViewPaymentSummaryComponent, {
        header: "PAYMENT SUMMARY",
        width: "50vw",
        data: data,
      });
    } catch (error: any) {
      this.messageService.showErrorAlert(error?.message || error);
    }
  }

  async handOverLoan(rowData: any) {
    try {
      let data = {
        loanData: rowData,
      };

      const paymentDetailsResult = await firstValueFrom(
        this.loanService.GetLoanById(rowData._id)
      );

      if (paymentDetailsResult.IsSuccessful) {
        data.loanData = paymentDetailsResult.Result;
      }

      this.popUpService
        .OpenModel(HandOverLoanComponent, {
          header: "HAND OVER LOAN",
          width: "40vw",
          data: data,
        })
        .subscribe((res) => {
          if (res) {
            this.getAllLoans();
          }
        });
    } catch (error: any) {
      this.messageService.showErrorAlert(error?.message || error);
    }
  }

  exportToExcel() {
    let reportCols = [
      { field: "loanCode", header: "Code" },
      { field: "customer", header: "Customer" },
      { field: "recoverOfficer", header: "Recover Officer" },
      { field: "collectionDate", header: "Collection Date" },
      { field: "product", header: "Product" },
      { field: "amount", header: "Amount" },
      { field: "agreedAmount", header: "Agreed Amount" },
      { field: "payedAmount", header: "Payed Amount" },
      { field: "statusName", header: "Status" },
      { field: "createdAt", header: "Created Date" },
      { field: "updatedAt", header: "Last Updated Date" },
    ];

    let excelData: any[] = [];
    this.recodes.forEach((item: any) => {
      let obj = {
        loanCode: item.loanCode,
        customer: item.customer,
        recoverOfficer: item.recoverOfficer,
        collectionDate: item.collectionDate,
        product: item.product,
        amount: item.amount,
        agreedAmount: item.agreedAmount,
        payedAmount: item.payedAmount,
        statusName: item.statusName,
        createdAt: this.datePipe.transform(
          item.createdAt,
          "dd/MM/yyyy HH:mm:ss"
        ),
        updatedAt: this.datePipe.transform(
          item.updatedAt,
          "dd/MM/yyyy HH:mm:ss"
        ),
      };

      excelData.push(obj);
    });

    this.excelService.GenerateExcelFileWithCustomHeader(
      reportCols,
      excelData,
      "Loans"
    );
  }
}
