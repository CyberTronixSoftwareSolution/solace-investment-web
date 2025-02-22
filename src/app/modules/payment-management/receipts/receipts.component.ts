import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, Validators } from "@angular/forms";
import { firstValueFrom } from "rxjs";
import { LoanService } from "src/app/shared/services/api-services/loan.service";
import { ProductService } from "src/app/shared/services/api-services/product.service";
import { CommonForm } from "src/app/shared/services/app-common-form";
import { AppMessageService } from "src/app/shared/services/app-message.service";
import { PopupService } from "src/app/shared/services/popup.service";
import { SidebarService } from "src/app/shared/services/sidebar.service";
import { PaymentReceiptComponent } from "../payment-receipt/payment-receipt.component";

@Component({
  selector: "app-receipts",
  templateUrl: "./receipts.component.html",
  styleUrls: ["./receipts.component.css"],
})
export class ReceiptsComponent implements OnInit {
  FV = new CommonForm();
  productArr: any[] = [];
  searchTypeArr: any[] = [
    {
      id: -1,
      name: "None",
    },
    {
      id: 1,
      name: "Customer NIC",
    },
    {
      id: 2,
      name: "Customer Code",
    },
    {
      id: 3,
      name: "Loan No",
    },
  ];
  cols: any[] = [];
  recodes: any[] = [];
  constructor(
    private popUpService: PopupService,
    private sidebarService: SidebarService,
    private formBuilder: UntypedFormBuilder,
    private ProductService: ProductService,
    private messageService: AppMessageService,
    private loanService: LoanService,
    private datePipe: DatePipe
  ) {
    this.createForm();
  }
  ngOnInit() {
    this.cols = [
      { field: "customerName", header: "Customer" },
      { field: "loanNo", header: "Loan No" },
      { field: "loanAmount", header: "Loan Amount" },
      { field: "installment", header: "Installment" },
      { field: "status", header: "Status" },
      { field: "termInstallAmount", header: "Term Install Amount" },
      { field: "paymentDate", header: "Payment Date" },
      { field: "paymentAmount", header: "Payment" },
    ];
    this.loadInitialData();

    this.FV.setValue("startDate", new Date());
    this.FV.setValue("endDate", new Date());
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      startDate: ["", [Validators.required]],
      endDate: ["", [Validators.required]],
      product: ["", [Validators.required]],
      searchType: ["", [Validators.required]],
      searchCode: ["", [Validators.required]],
    });
  }

  async loadInitialData() {
    try {
      const productResult = await firstValueFrom(
        this.ProductService.GetAllProducts(false)
      );

      if (productResult.IsSuccessful) {
        this.productArr = productResult.Result;

        this.productArr.unshift({
          _id: "-1",
          productName: "None",
        });
      }

      this.FV.setValue("product", "-1");
      this.FV.setValue("searchType", -1);
    } catch (error: any) {
      this.messageService.showErrorAlert(error?.message || error);
    }
  }

  onSelectStartDate() {
    let startDate = this.FV.getValue("startDate");
    let endDate = this.FV.getValue("endDate");

    if (startDate > endDate) {
      this.FV.setValue("endDate", startDate);
    }
  }

  onSearch() {
    this.recodes = [];
    let validateParams = "startDate,endDate,product,searchType";
    let searchType = this.FV.getValue("searchType");

    if (searchType != -1) {
      validateParams += ",searchCode";
    }

    if (this.FV.validateControllers(validateParams)) {
      return;
    }

    let startDate = this.FV.getValue("startDate");
    let endDate = this.FV.getValue("endDate");
    let searchCode = this.FV.getValue("searchCode");
    let product = this.FV.getTrimValue("product");

    let request = {
      startDate: this.datePipe.transform(startDate, "yyyy-MM-dd"),
      endDate: this.datePipe.transform(endDate, "yyyy-MM-dd"),
      product: product,
      searchType: searchType.toString(),
      searchCode: searchCode,
    };

    this.loanService.SearchReceipts(request).subscribe((response) => {
      if (response.IsSuccessful) {
        this.recodes = response.Result;
      }
    });
  }

  onClear() {
    this.FV.setValue("startDate", new Date());
    this.FV.setValue("endDate", new Date());
    this.FV.clearValues("product,searchType,searchCode");
    this.FV.setValue("searchType", -1);
    this.FV.setValue("product", "-1");

    this.recodes = [];
    this.onSearch();
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
}
