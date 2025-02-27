import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, Validators } from "@angular/forms";
import { firstValueFrom, forkJoin } from "rxjs";
import { ProductService } from "src/app/shared/services/api-services/product.service";
import { ReportService } from "src/app/shared/services/api-services/report.service";
import { UserService } from "src/app/shared/services/api-services/user.service";
import { CommonForm } from "src/app/shared/services/app-common-form";
import { AppMessageService } from "src/app/shared/services/app-message.service";
import { SidebarService } from "src/app/shared/services/sidebar.service";

@Component({
  selector: "app-deduction-charges-report",
  templateUrl: "./deduction-charges-report.component.html",
  styleUrls: ["./deduction-charges-report.component.css"],
})
export class DeductionChargesReportComponent implements OnInit {
  FV = new CommonForm();
  productArr: any[] = [];
  recoveryOfficerSuggestionsArr: any[] = [];
  searchTypeArr: any[] = [
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
  reduceFromLoanArr: any[] = [
    {
      id: 1,
      name: "Yes",
    },

    {
      id: 2,
      name: "No",
    },
  ];

  cols: any[] = [];
  recodes: any[] = [];

  totalReceivedAmount: number = 0;
  totalReceivableAmount: number = 0;
  totalDeductionChargeAmount: number = 0;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private sidebarService: SidebarService,
    private messageService: AppMessageService,
    private productService: ProductService,
    private userService: UserService,
    private reportService: ReportService,
    private datePipe: DatePipe
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.cols = [
      { field: "loanNumber", header: "Loan No" },
      { field: "product", header: "Product" },
      { field: "deductionChargeName", header: "Deduction Charge Name" },
      { field: "deductionChargeReduced", header: "Deduction Charge Reduced" },
      { field: "deductionChargeAmount", header: "Deduction Charge Amount" },
      { field: "receivedAmount", header: "Received Amount" },
      { field: "receivableAmount", header: "Receivable Amount" },
    ];

    let days15BeforeToday = new Date();
    days15BeforeToday.setDate(days15BeforeToday.getDate() - 15);

    this.FV.setValue("startDate", days15BeforeToday);
    this.FV.setValue("endDate", new Date());
    this.loadInitialData();
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      product: [""],
      recoveryOfficer: [""],
      startDate: ["", [Validators.required]],
      endDate: ["", [Validators.required]],
      deductionChargeReduced: [""],
      searchCode: ["", [Validators.required]],
      searchType: [""],
    });
  }

  async loadInitialData() {
    try {
      const [productResult] = await firstValueFrom(
        forkJoin([this.productService.GetAllProducts(false)])
      );

      if (productResult.IsSuccessful) {
        this.productArr = productResult.Result;
      }
    } catch (error) {
      this.messageService.showErrorAlert(error?.message || error);
    }
  }

  onSearch() {
    // if (this.FV.formGroup.invalid) {
    //   this.FV.showErrors();
    //   return;
    // }
    let validationParam = "startDate,endDate";

    let searchType = this.FV.getValue("searchType");
    if (searchType > 0) {
      validationParam += ",searchCode";
    }

    if (this.FV.validateControllers(validationParam)) {
      return;
    }

    let data = this.FV.formGroup.value;

    const request = {
      startDate: this.datePipe.transform(data?.startDate, "yyyy-MM-dd"),
      endDate: this.datePipe.transform(data?.endDate, "yyyy-MM-dd"),
      product: data?.product?._id || "",
      recoveryOfficer: data?.recoveryOfficer?._id || "",
      searchType: searchType || 0,
      searchCode: data?.searchCode || "",
      isDeductionChargesReducedFromLoan: data?.deductionChargeReduced || 0,
    };

    this.recodes = [];
    this.reportService
      .GetDeductionChargeReportData(request)
      .subscribe((response) => {
        if (response.IsSuccessful) {
          this.recodes = response.Result;

          this.totalReceivedAmount = this.recodes.reduce(
            (total, recode) => total + recode.receivedAmount,
            0
          );

          this.totalDeductionChargeAmount = this.recodes.reduce(
            (total, recode) => total + recode.deductionChargeAmount,
            0
          );

          this.totalReceivableAmount = this.recodes.reduce(
            (total, recode) => total + recode.receivableAmount,
            0
          );
        } else {
          this.messageService.showErrorAlert(response.Message);
        }
      });
  }

  onClear() {
    this.FV.clearValues(
      "product,recoveryOfficer,deductionChargeReduced,searchCode,searchType"
    );
    let days15BeforeToday = new Date();
    days15BeforeToday.setDate(days15BeforeToday.getDate() - 15);

    this.FV.setValue("startDate", days15BeforeToday);
    this.FV.setValue("endDate", new Date());

    this.totalDeductionChargeAmount = 0;
    this.totalReceivedAmount = 0;
    this.totalReceivableAmount = 0;
    this.recodes = [];
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

  onStartDateSelect() {
    let startDate = this.FV.getValue("startDate");

    if (startDate > this.FV.getValue("endDate")) {
      this.FV.setValue("endDate", startDate);
    }
  }
}
