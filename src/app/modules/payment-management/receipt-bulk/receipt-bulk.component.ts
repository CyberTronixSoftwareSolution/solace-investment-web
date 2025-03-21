import { ProductService } from "./../../../shared/services/api-services/product.service";
import { Component, OnInit } from "@angular/core";
import { PopupService } from "src/app/shared/services/popup.service";
import { PaymentReceiptComponent } from "../payment-receipt/payment-receipt.component";
import { SidebarService } from "src/app/shared/services/sidebar.service";
import { CommonForm } from "src/app/shared/services/app-common-form";
import { UntypedFormBuilder, Validators } from "@angular/forms";
import { AppMessageService } from "src/app/shared/services/app-message.service";
import { firstValueFrom } from "rxjs";
import { LoanService } from "src/app/shared/services/api-services/loan.service";
import { DatePipe } from "@angular/common";
import { MasterDataService } from "src/app/shared/services/master-data.service";
import { WellKnownUserRole } from "src/app/shared/enums/well-known-user-role.enum";
import { UserService } from "src/app/shared/services/api-services/user.service";

@Component({
  selector: "app-receipt-bulk",
  templateUrl: "./receipt-bulk.component.html",
  styleUrls: ["./receipt-bulk.component.css"],
})
export class ReceiptBulkComponent implements OnInit {
  FV = new CommonForm();
  productArr: any[] = [];
  searchTypeArr: any[] = [
    // {
    //   id: -1,
    //   name: "NONE",
    // },
    {
      id: 1,
      name: "CUSTOMER NIC",
    },
    {
      id: 2,
      name: "CUSTOMER CODE",
    },
    {
      id: 3,
      name: "LOAN NO",
    },
  ];

  cols: any[] = [];
  recodes: any[] = [];
  editDataId: string = "";
  recoveryOfficerSuggestionsArr: any[] = [];
  isShowCollector: boolean = false;
  constructor(
    private popUpService: PopupService,
    private sidebarService: SidebarService,
    private formBuilder: UntypedFormBuilder,
    private ProductService: ProductService,
    private messageService: AppMessageService,
    private loanService: LoanService,
    private datePipe: DatePipe,
    private masterDataService: MasterDataService,
    private userService: UserService
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.cols = [
      { field: "customerName", header: "Customer" },
      { field: "loanNo", header: "Loan No" },
      { field: "loanAmount", header: "Loan Amount" },
      { field: "loanBalance", header: "Loan Balance" },
      { field: "deuDate", header: "Due Date" },
      { field: "installment", header: "Installment" },
      { field: "status", header: "Status" },
      { field: "termInstallAmount", header: "Term Install Amount" },
      { field: "paymentAmount", header: "Payment" },
    ];

    this.isShowCollector =
      this.masterDataService.Role == WellKnownUserRole.SUPERADMIN || false;
    this.loadInitialData();

    this.FV.setValue("transactionDate", new Date());
    this.FV.disableField("transactionDate");
  }
  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      transactionDate: [""],
      product: [""],
      searchType: [""],
      searchCode: ["", [Validators.required]],
      recoveryOfficer: [""],

      // for Payament
      payment: ["", [Validators.required]],
    });
  }

  async loadInitialData() {
    try {
      const productResult = await firstValueFrom(
        this.ProductService.GetAllProducts(false)
      );

      if (productResult.IsSuccessful) {
        this.productArr = productResult.Result;
      }
    } catch (error: any) {
      this.messageService.showErrorAlert(error?.message || error);
    }
  }

  async printReceipt(rowData: any) {
    try {
      let data = {
        printData: null,
      };

      const printResult = await firstValueFrom(
        this.loanService.GetPrintReceiptData(rowData.detailId)
      );

      if (printResult.IsSuccessful) {
        data.printData = printResult.Result;
      }

      let properties = {
        width: "40vw",
        position: "right",
        data: data,
      };

      this.sidebarService.addComponent(
        "PRINT RECEIPT",
        PaymentReceiptComponent,
        properties,
        data
      );
    } catch (error) {}
  }

  onSearch() {
    let validateParams = "product,searchType";
    let searchType = this.FV.getValue("searchType") || -1;

    if (searchType != -1) {
      validateParams += ",searchCode";
    }

    if (this.FV.validateControllers(validateParams)) {
      return;
    }

    let searchCode = this.FV.getValue("searchCode");
    let product = this.FV.getTrimValue("product") || "-1";
    let recoverOfficer = this.FV.getValue("recoveryOfficer")._id || "";

    let request = {
      product: product,
      searchType: searchType.toString(),
      searchCode: searchCode,
      recoverOfficer: this.isShowCollector ? recoverOfficer : "",
    };

    this.recodes = [];

    this.loanService.SearchReceiptBulk(request).subscribe((response) => {
      if (response.IsSuccessful) {
        this.recodes = response.Result;
      }
    });
  }

  onClear() {
    this.FV.clearValues("product,searchType,searchCode");

    this.recodes = [];
    // this.onSearch();
  }

  onClickEdit(rowData: any) {
    this.FV.clearValue("payment");
    this.editDataId = rowData.detailId;
  }

  async onHandleUpdate(rowData: any) {
    try {
      let validateParams = "payment";
      if (this.FV.validateControllers(validateParams)) {
        return;
      }

      let payment = this.FV.getValue("payment");

      if (rowData.isLastInstallment) {
        if (payment !== rowData.termInstallAmount) {
          this.messageService.showErrorAlert(
            "This is the last installment. Payment should be equal to Term Install Amount!"
          );
          return;
        }
      }

      let request = {
        payedAmount: payment,
      };

      this.loanService
        .PayLoanInstallment(rowData.detailId, request)
        .subscribe((response) => {
          if (response.IsSuccessful) {
            this.messageService.showSuccessAlert(response.Message);
            this.onSearch();
            this.editDataId = "";
            this.FV.clearValue("payment");

            this.printReceipt(rowData);
          } else {
            this.messageService.showErrorAlert(response.Message);
          }
        });
    } catch (error: any) {
      this.messageService.showErrorAlert(error?.message || error);
    }
  }

  onHandleCancel(rowData: any) {
    this.FV.clearValue("payment");
    this.editDataId = "";
  }

  onClickShift(rowData: any, isUndo: boolean = false) {
    let confirmationConfig = {
      message: `Are you sure you want to ${
        isUndo ? "undo shift" : "shift"
      } this installment to next installment?`,
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
    };

    this.messageService.ConfirmPopUp(
      confirmationConfig,
      (isConfirm: boolean) => {
        if (isConfirm) {
          this.loanService
            .ShiftInstallment(rowData.detailId, isUndo)
            .subscribe((response) => {
              if (response.IsSuccessful) {
                this.messageService.showSuccessAlert(response.Message);
                this.onSearch();
              } else {
                this.messageService.showErrorAlert(response.Message);
              }
            });
        }
      }
    );
  }

  async searchRecoveryOfficer(e: any) {
    let value = e.query;

    try {
      const userResult = await firstValueFrom(
        this.userService.UserSearchByParam("admin", value)
      );

      if (userResult.IsSuccessful) {
        this.recoveryOfficerSuggestionsArr = userResult.Result;
      }
    } catch (error) {
      this.messageService.showErrorAlert(error?.message || error);
    }
  }
}
