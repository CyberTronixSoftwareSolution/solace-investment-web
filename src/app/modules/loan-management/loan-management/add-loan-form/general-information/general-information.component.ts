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
import { LoanFlowServiceService } from "../loan-flow-service.service";
import { LoanService } from "src/app/shared/services/api-services/loan.service";

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

  loanDetails: any = null;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private datePipe: DatePipe,
    private popUpService: PopupService,
    private helper: HelperService,
    private messageService: AppMessageService,
    private masterDataService: MasterDataService,
    private productService: ProductService,
    private userService: UserService,
    private loanFlowService: LoanFlowServiceService,
    private loanService: LoanService
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.loadInitData();

    // set loan no and transaction date
    this.FV.setValue("transactionDate", new Date());
    this.FV.disableField("transactionDate");
    this.FV.disableField("loanNo");
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      // loan details
      loanNo: ["", [Validators.required]],
      transactionDate: ["", [Validators.required]],
      reference: [""],
      reason: ["", [Validators.required]],

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
      this.loanDetails = this.loanFlowService.getLoanDetails();
      console.log(this.loanDetails);

      const [productResult] = await firstValueFrom(
        forkJoin([this.productService.GetAllProducts(false)])
      );

      if (productResult.IsSuccessful) {
        this.productArr = productResult.Result;
      }

      if (this.loanDetails.loanNo == "" || this.loanDetails.loanNo == null) {
        const loanResult = await firstValueFrom(this.loanService.GetLoanCode());

        if (loanResult.IsSuccessful) {
          this.FV.setValue("loanNo", loanResult.Result);
        }
      }

      this.setValues();
    } catch (error) {
      this.messageService.showErrorAlert(error?.message || error);
    }
  }

  setValues() {
    if (this.loanDetails?.loanNo) {
      this.FV.setValue("loanNo", this.loanDetails.loanNo);
    }

    if (this.loanDetails?.reference) {
      this.FV.setValue("reference", this.loanDetails.reference);
    }

    if (this.loanDetails?.transactionDate) {
      this.FV.setValue("transactionDate", this.loanDetails.transactionDate);
    }

    if (this.loanDetails?.reason) {
      this.FV.setValue("reason", this.loanDetails.reason);
    }

    if (this.loanDetails?.borrowerDetails) {
      this.selectedBorrower = this.loanDetails.borrowerDetails;
      this.FV.setValue("borrower", this.loanDetails.borrowerDetails);
      this.FV.setValue(
        "borrowerCode",
        this.loanDetails.borrowerDetails.customerCode
      );
      this.FV.setValue(
        "borrowerNic",
        this.loanDetails.borrowerDetails.nicNumber
      );
      this.FV.setValue(
        "borrowerFullName",
        this.loanDetails.borrowerDetails.fullName
      );

      this.FV.disableField("borrowerCode");
      this.FV.disableField("borrowerNic");
      this.FV.disableField("borrowerFullName");
    }

    if (this.loanDetails?.productDetails) {
      let selectedProduct = this.productArr.find(
        (x) => x._id === this.loanDetails.productDetails._id
      );

      this.selectedProduct = {
        ...selectedProduct,
        isOpenDeductionCharges:
          this.loanDetails.productDetails.isOpenDeductionCharges,
        deductionCharges: this.loanDetails.productDetails.deductionCharges,
      };

      this.FV.setValue("productName", selectedProduct);
      this.FV.setValue(
        "productCode",
        this.loanDetails.productDetails.productCode
      );
      this.FV.setValue("rate", this.loanDetails.productDetails.rate);
      this.FV.setValue("amount", this.loanDetails.productDetails.amount);
      this.FV.setValue("terms", this.loanDetails.productDetails.termsCount);
      this.FV.setValue(
        "disbursementDate",
        this.loanDetails.productDetails?.disbursementDate
      );

      this.FV.formGroup
        .get("amount")
        .setValidators([
          Validators.required,
          Validators.min(this.loanDetails.productDetails.minAmount),
          Validators.max(this.loanDetails.productDetails.maxAmount),
        ]);

      this.FV.disableField("productCode");

      this.FV.formGroup.get("amount").updateValueAndValidity();
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
