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
import { InvestmentReportTemplateComponent } from "./investment-report-template/investment-report-template.component";

@Component({
  selector: "app-investment-report",
  templateUrl: "./investment-report.component.html",
  styleUrls: ["./investment-report.component.css"],
})
export class InvestmentReportComponent implements OnInit {
  FV = new CommonForm();
  productArr: any[] = [];
  recoveryOfficerSuggestionsArr: any[] = [];
  searchTypeArr: any[] = [
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

  totalAmount: number = 0;
  totalInvestment: number = 0;

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
      { field: "loanNo", header: "Loan No" },
      { field: "productName", header: "Product" },
      { field: "transactionDate", header: "Trans Date" },
      { field: "loanAmount", header: "Loan Amount" },
      { field: "investment", header: "Investment Amount" },
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
    };

    this.recodes = [];
    this.reportService
      .GetInvestmentReportData(request)
      .subscribe((response) => {
        if (response.IsSuccessful) {
          this.recodes = response.Result;

          this.totalAmount = this.recodes.reduce(
            (total, recode) => total + recode.loanAmount,
            0
          );

          this.totalInvestment = this.recodes.reduce(
            (total, recode) => total + recode.investment,
            0
          );
        } else {
          this.messageService.showErrorAlert(response.Message);
        }
      });
  }

  onClear() {
    this.FV.clearValues("product,recoveryOfficer,searchCode,searchType");
    let days15BeforeToday = new Date();
    days15BeforeToday.setDate(days15BeforeToday.getDate() - 15);

    this.FV.setValue("startDate", days15BeforeToday);
    this.FV.setValue("endDate", new Date());

    this.totalInvestment = 0;
    this.totalInvestment = 0;
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

  onPrint() {
    try {
      debugger;
      let data = {
        printData: this.recodes,
        selectedData: null,
      };

      let formData = this.FV.formGroup.value;
      let selectedData = {
        fromDate: formData?.startDate,
        toDate: formData?.endDate,
        product: formData?.product?.productName || "ALL",
        recoveryOfficer: formData?.recoveryOfficer?.fullName || "ALL",
      };

      data.selectedData = selectedData;

      let properties = {
        width: "80vw",
        position: "right",
        data: data,
      };

      this.sidebarService.addComponent(
        "PRINT INVESTMENT",
        InvestmentReportTemplateComponent,
        properties,
        data
      );
    } catch (error) {}
  }
}
