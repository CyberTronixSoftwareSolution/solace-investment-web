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
  selectedProduct: any = null;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private datePipe: DatePipe,
    private popUpService: PopupService,
    private helper: HelperService,
    private messageService: AppMessageService,
    private masterDataService: MasterDataService,
    private productService: ProductService
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.loadInitData();
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
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

  onProductChange(e: any) {
    let selectedValue = e.value;

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
    });
  }
}
