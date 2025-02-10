import { UserService } from "./../../../../../shared/services/api-services/user.service";
import { ProductService } from "src/app/shared/services/api-services/product.service";
import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, UntypedFormBuilder, Validators } from "@angular/forms";
import { CommonForm } from "src/app/shared/services/app-common-form";
import { AppMessageService } from "src/app/shared/services/app-message.service";
import { HelperService } from "src/app/shared/services/helper.service";
import { MasterDataService } from "src/app/shared/services/master-data.service";
import { PopupService } from "src/app/shared/services/popup.service";
import { firstValueFrom, forkJoin } from "rxjs";
import { LoanScheduleComponent } from "./loan-schedule/loan-schedule.component";

@Component({
  selector: "app-general-information",
  templateUrl: "./general-information.component.html",
  styleUrls: ["./general-information.component.css"],
})
export class GeneralInformationComponent implements OnInit {
  FV = new CommonForm();
  productArr: any[] = [];

  selectedBorrower: any = null;
  selectedProduct: any = null;

  borrowerSuggestionsArr: any[] = [];

  constructor(
    private formBuilder: UntypedFormBuilder,
    private datePipe: DatePipe,
    private popUpService: PopupService,
    private helper: HelperService,
    private messageService: AppMessageService,
    private masterDataService: MasterDataService,
    private productService: ProductService,
    private userService: UserService
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.loadInitData();

    // set loan no and transaction date
    this.FV.setValue("loanNo", "Lone001");
    this.FV.setValue("transactionDate", new Date());
    this.FV.disableField("transactionDate");
    this.FV.disableField("loanNo");
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      // loan details
      loanNo: ["", [Validators.required]],
      transactionDate: ["", [Validators.required]],
      reference: ["", [Validators.required]],

      //Borrower details
      borrower: ["", [Validators.required]],
      borrowerCode: ["", [Validators.required]],
      borrowerNic: ["", [Validators.required]],
      borrowerFullName: ["", [Validators.required]],

      // Product details
      productName: ["", [Validators.required]],
      productCode: ["", [Validators.required]],
      rate: ["", [Validators.required]],
      amount: ["", [Validators.required]],
      terms: ["", [Validators.required]],
      disbursementDate: [""],
    });
  }

  async loadInitData() {
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

  async onProductChange(e: any) {
    try {
      let productId = e.value._id;
      let selectedValue = null;

      const productResult = await firstValueFrom(
        this.productService.GetProductById(productId)
      );

      if (productResult.IsSuccessful) {
        selectedValue = productResult.Result;
      }

      if (selectedValue) {
        this.selectedProduct = selectedValue;

        this.FV.setValue("productCode", selectedValue.productCode);
        this.FV.setValue("rate", selectedValue.rate);
        this.FV.setValue("amount", selectedValue.amount);
        this.FV.setValue("terms", selectedValue.termsCount);

        this.FV.formGroup
          .get("amount")
          .setValidators([
            Validators.required,
            Validators.min(selectedValue.minAmount),
            Validators.max(selectedValue.maxAmount),
          ]);
        this.FV.disableField("productCode");

        this.FV.formGroup.get("amount").updateValueAndValidity();
      }
    } catch (error) {
      this.messageService.showErrorAlert(error?.message || error);
    }
  }

  onAmountChange(e: any) {
    let amount = e.value;

    if (amount && this.selectedProduct) {
      let message = "";
      if (amount > this.selectedProduct.maxAmount) {
        message = `Amount should be less than ${this.selectedProduct.maxAmount}`;
      } else if (amount < this.selectedProduct.minAmount) {
        message = `Amount should be greater than ${this.selectedProduct.minAmount}`;
      }

      if (message) {
        this.messageService.showWarnAlert(message);
        this.FV.setValue("amount", this.selectedProduct.amount);
      }
    }
  }

  onClickLoanSchedule() {
    let validateParams =
      "productName,productCode,rate,amount,terms,disbursementDate";

    if (this.FV.validateControllers(validateParams)) {
      return;
    }

    let formData: any = this.FV.formGroup.value;

    let product: any = {
      ...this.selectedProduct,
      rate: formData.rate,
      termsCount: formData.terms,
      amount: formData.amount,
      disbursementDate: formData.disbursementDate,
    };

    let data = {
      product: product,
    };

    this.popUpService.OpenModel(LoanScheduleComponent, {
      data: data,
      width: "50vw",
      header: "LOAN SCHEDULE",
    });
  }

  async searchBorrower(e: any) {
    let value = e.query;

    try {
      const userResult = await firstValueFrom(
        this.userService.UserSearchByParam("customer", value)
      );

      if (userResult.IsSuccessful) {
        this.borrowerSuggestionsArr = userResult.Result;
      }
    } catch (error) {
      this.messageService.showErrorAlert(error?.message || error);
    }
  }

  onBorrowerSelect(e: any) {
    this.selectedBorrower = e.value;

    if (this.selectedBorrower) {
      this.FV.setValue("borrowerCode", this.selectedBorrower.customerCode);
      this.FV.setValue("borrowerNic", this.selectedBorrower.nicNumber);
      this.FV.setValue("borrowerFullName", this.selectedBorrower.fullName);

      this.FV.disableField("borrowerCode");
      this.FV.disableField("borrowerNic");
      this.FV.disableField("borrowerFullName");
    }
  }
}
