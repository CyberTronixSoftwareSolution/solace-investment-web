import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, Validators } from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { ProductService } from "src/app/shared/services/api-services/product.service";
import { CommonForm } from "src/app/shared/services/app-common-form";
import { AppMessageService } from "src/app/shared/services/app-message.service";
import { HelperService } from "src/app/shared/services/helper.service";
import { MasterDataService } from "src/app/shared/services/master-data.service";

@Component({
  selector: "app-add-product-form",
  templateUrl: "./add-product-form.component.html",
  styleUrls: ["./add-product-form.component.css"],
})
export class AddProductFormComponent implements OnInit {
  FV = new CommonForm();
  isEdit: boolean = false;
  isView: boolean = false;
  isAdd: boolean = false;
  typeArr: any[] = [];
  productInfo: any;

  deductionCharges: any[] = [];
  chargeCols: any[] = [];

  constructor(
    private messageService: AppMessageService,
    private helper: HelperService,
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private datePipe: DatePipe,
    private masterDateService: MasterDataService,
    private productService: ProductService,
    private formBuilder: UntypedFormBuilder
  ) {
    this.createForm();
  }

  ngOnInit() {
    let dialogConfig = this.config.data;
    this.isAdd = dialogConfig.isAdd;
    this.isEdit = dialogConfig.isEdit;
    this.isView = dialogConfig.isView;
    this.productInfo = dialogConfig.productInfo;

    this.typeArr = [
      { label: "DAILY", value: "D" },
      { label: "WEEKLY", value: "W" },
      { label: "MONTHLY", value: "M" },
    ];

    this.chargeCols = [
      { field: "deductionChargeName", header: "Deduction Charge Name" },
      { field: "rate", header: "Rate" },
      { field: "amount", header: "Amount" },
    ];

    if (this.isEdit || this.isView) {
      this.setValue();
    }
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      productName: ["", [Validators.required]],
      productCode: ["", [Validators.required]],
      isPercentage: [true],
      rate: ["", [Validators.required]],
      amount: ["", [Validators.required]],
      maxAmount: ["", [Validators.required]],
      minAmount: ["", [Validators.required]],
      termsCount: ["", [Validators.required, Validators.min(1)]],
      rateAmount: [""],
      type: ["", [Validators.required]],
      isOpenDeductionCharges: [false],

      // for charges
      deductionChargeName: ["", [Validators.required]],
      deductionChargeRate: ["", [Validators.required]],
      deductionChargeIsPercentage: [true],
    });
  }

  setValue() {
    this.FV.setValue("productName", this.productInfo?.productName);
    this.FV.setValue("productCode", this.productInfo?.productCode);
    this.FV.setValue("isPercentage", this.productInfo?.isPercentage);
    this.FV.setValue("rate", this.productInfo?.rate);
    this.FV.setValue("amount", this.productInfo?.amount);
    this.FV.setValue("maxAmount", this.productInfo?.maxAmount);
    this.FV.setValue("minAmount", this.productInfo?.minAmount);
    this.FV.setValue("termsCount", this.productInfo?.termsCount);
    this.FV.setValue("rateAmount", this.productInfo?.rateAmount);
    this.FV.setValue("type", this.productInfo?.type);
    this.FV.setValue(
      "isOpenDeductionCharges",
      this.productInfo?.isOpenDeductionCharges
    );
    if (!this.productInfo?.isOpenDeductionCharges) {
      this.deductionCharges = this.productInfo?.deductionCharges;
    }

    if (this.isView) {
      this.FV.disableFormControlls();
    }
  }

  ngAfterContentChecked(): void {
    this.recalculateAllAmount();
  }

  recalculateAllAmount() {
    let isPercentage = this.FV.getValue("isPercentage");
    let rate = this.FV.getValue("rate");
    let amount = this.FV.getValue("amount");

    if (isPercentage && rate > 0 && amount > 0) {
      let rateAmount = amount * (rate / 100);
      this.FV.setValue("rateAmount", rateAmount);
    }

    // calculate if deduction charges is open
    let isOpenDeductionCharges = this.FV.getValue("isOpenDeductionCharges");

    if (
      !isOpenDeductionCharges &&
      this.deductionCharges.length > 0 &&
      amount > 0
    ) {
      this.deductionCharges.map((item) => {
        item.amount = item.isPercentage
          ? (amount / 100) * item.rate
          : item.rate;
      });
    }
  }

  clearValuesOfDeductionCharges() {
    this.FV.clearValues(
      "deductionChargeName,deductionChargeRate,deductionChargeIsPercentage"
    );
    this.FV.setValue("deductionChargeIsPercentage", true);
  }

  addDeductionCharge() {
    if (
      this.FV.validateControllers(
        "deductionChargeName,deductionChargeRate,deductionChargeIsPercentage,amount"
      )
    ) {
      return;
    }

    let deductionChargeName = this.FV.getValue("deductionChargeName");
    let deductionChargeRate = this.FV.getValue("deductionChargeRate");
    let deductionChargeIsPercentage = this.FV.getValue(
      "deductionChargeIsPercentage"
    );
    let amount = this.FV.getValue("amount");

    let data = {
      _id: this.helper.generateUniqueId(this.deductionCharges),
      deductionChargeName: deductionChargeName,
      rate: deductionChargeRate,
      isPercentage: deductionChargeIsPercentage,
      amount: deductionChargeIsPercentage
        ? (amount / 100) * deductionChargeRate
        : deductionChargeRate,
    };

    this.deductionCharges.push(data);
    this.clearValuesOfDeductionCharges();
  }

  onDeleteDeductionCharge(rowData: any) {
    let confirmationConfig = {
      message: `Are you sure you want to delete this deduction charge?`,
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
    };

    this.messageService.ConfirmPopUp(
      confirmationConfig,
      (isConfirm: boolean) => {
        if (isConfirm) {
          let index = this.deductionCharges.findIndex(
            (x) => x._id == rowData._id
          );
          this.deductionCharges.splice(index, 1);
        }
      }
    );
  }

  onCancel() {
    this.ref.close(false);
  }

  onSave() {
    debugger;
    let validateParams =
      "productName,productCode,isPercentage,rate,amount,maxAmount,minAmount,termsCount,rateAmount,type";

    if (this.FV.validateControllers(validateParams)) {
      return;
    }

    let formData: any = this.FV.formGroup.value;
    let validationMessage = "";
    if (formData?.amount > formData?.maxAmount) {
      validationMessage = "Max amount should be greater than amount!";
    } else if (formData?.amount < formData?.minAmount) {
      validationMessage = "Min amount should be less than amount!";
    }

    if (validationMessage) {
      this.messageService.showWarnAlert(validationMessage);
      return;
    }

    let deductionCharges: any[] = [];

    if (
      !formData?.isOpenDeductionCharges &&
      this.deductionCharges.length > 0 &&
      formData?.amount > 0
    ) {
      this.deductionCharges.forEach((item) => {
        let data = {
          deductionChargeName: item.deductionChargeName,
          isPercentage: item.isPercentage,
          rate: item.rate,
          amount: item.isPercentage
            ? (formData?.amount / 100) * item.rate
            : item.rate,
        };

        deductionCharges.push(data);
      });
    }

    let request = {
      productName: formData?.productName || "",
      productCode: formData?.productCode || "",
      isPercentage: formData?.isPercentage || false,
      rate: formData?.rate || 0,
      amount: formData?.amount || 0,
      maxAmount: formData?.maxAmount || 0,
      minAmount: formData?.minAmount || 0,
      termsCount: formData?.termsCount || 0,
      type: formData?.type || "",
      isOpenDeductionCharges: formData?.isOpenDeductionCharges || false,
      deductionCharges: deductionCharges,
    };

    if (this.isAdd) {
      this.productService.SaveProduct(request).subscribe((response) => {
        if (response.IsSuccessful) {
          this.messageService.showSuccessAlert(response.Message);
          this.ref.close(true);
        } else {
          this.messageService.showErrorAlert(response.Message);
        }
      });
    }
    if (this.isEdit) {
      this.productService
        .UpdateProduct(request, this.productInfo._id)
        .subscribe((response) => {
          if (response.IsSuccessful) {
            this.messageService.showSuccessAlert(response.Message);
            this.ref.close(true);
          } else {
            this.messageService.showErrorAlert(response.Message);
          }
        });
    }
  }
}
