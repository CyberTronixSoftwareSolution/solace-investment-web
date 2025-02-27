import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, Validators } from "@angular/forms";
import { CommonForm } from "src/app/shared/services/app-common-form";
import { SidebarService } from "src/app/shared/services/sidebar.service";
import { RepaymentTemplateComponent } from "./repayment-template/repayment-template.component";
import { AppMessageService } from "src/app/shared/services/app-message.service";
import { firstValueFrom, forkJoin } from "rxjs";
import { ProductService } from "src/app/shared/services/api-services/product.service";
import { UserService } from "src/app/shared/services/api-services/user.service";
import { ReportService } from "src/app/shared/services/api-services/report.service";

@Component({
  selector: "app-repayment-report",
  templateUrl: "./repayment-report.component.html",
  styleUrls: ["./repayment-report.component.css"],
})
export class RepaymentReportComponent implements OnInit {
  FV = new CommonForm();
  productArr: any[] = [];
  recoveryOfficerSuggestionsArr: any[] = [];
  collectionDatesArr: any[] = [];
  selectedValues: any = {
    fromDate: null,
    product: null,
    recoveryOfficer: null,
    collectionDate: null,
  };

  cols: any[] = [];
  recodes: any[] = [];
  constructor(
    private formBuilder: UntypedFormBuilder,
    private sidebarService: SidebarService,
    private messageService: AppMessageService,
    private productService: ProductService,
    private userService: UserService,
    private reportService: ReportService
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.cols = [
      { field: "loanNo", header: "Loan No" },
      { field: "customerName", header: "Customer" },
      { field: "mobileNo", header: "Contact No" },
      { field: "loanAmount", header: "Loan Amount" },
      { field: "installment", header: "Loan Rental" },
      { field: "balance", header: "Outstanding Amount" },
      { field: "arrears", header: "Arrears Amount" },
    ];

    this.collectionDatesArr = [
      { name: "Monday", value: "Monday" },
      { name: "Tuesday", value: "Tuesday" },
      { name: "Wednesday", value: "Wednesday" },
      { name: "Thursday", value: "Thursday" },
      { name: "Friday", value: "Friday" },
      { name: "Saturday", value: "Saturday" },
      { name: "Sunday", value: "Sunday" },
    ];

    this.FV.setValue("startDate", new Date());

    this.loadInitialData();
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      product: [""],
      recoveryOfficer: [""],
      startDate: ["", [Validators.required]],
      collectionDate: [""],
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
    if (this.FV.formGroup.invalid) {
      this.FV.showErrors();
      return;
    }

    let data = this.FV.formGroup.value;

    this.selectedValues = {
      fromDate: data.startDate,
      product: data.product,
      recoveryOfficer: data.recoveryOfficer,
      collectionDate: data.collectionDate,
    };

    let request = {
      product: data?.product?._id || "",
      recoveryOfficer: data?.recoveryOfficer?._id || "",
      collectionDate: data?.collectionDate?.value || "",
    };

    this.recodes = [];
    this.reportService.GetRepaymentReportData(request).subscribe((response) => {
      if (response.IsSuccessful) {
        this.recodes = response.Result;
      } else {
        this.messageService.showErrorAlert(response.Message);
      }
    });
  }

  onClear() {
    this.FV.clearValues("product,recoveryOfficer,collectionDate");
    this.FV.setValue("startDate", new Date());
    this.recodes = [];
    this.selectedValues = {
      fromDate: null,
      product: null,
      recoveryOfficer: null,
      collectionDate: null,
    };
  }

  async onPrint() {
    try {
      let passData = {
        printData: null,
        searchData: this.selectedValues,
      };

      let data = this.FV.formGroup.value;

      this.selectedValues = {
        fromDate: data.startDate,
        product: data.product,
        recoveryOfficer: data.recoveryOfficer,
        collectionDate: data.collectionDate,
      };

      let request = {
        product: data?.product?._id || "",
        recoveryOfficer: data?.recoveryOfficer?._id || "",
        collectionDate: data?.collectionDate?.value || "",
      };

      const printResult = await firstValueFrom(
        this.reportService.GetRepaymentReportData(request)
      );

      if (printResult.IsSuccessful) {
        data.printData = printResult.Result;
        data.searchData = this.selectedValues;
      }

      if (data.printData.length == 0) {
        this.messageService.showErrorAlert("No data to print");
        return;
      }

      let properties = {
        width: "80vw",
        position: "right",
        data: data,
      };

      this.sidebarService.addComponent(
        "PRINT REPAYMENT",
        RepaymentTemplateComponent,
        properties,
        data
      );
    } catch (error) {}
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
