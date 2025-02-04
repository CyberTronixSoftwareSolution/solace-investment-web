import { PopupService } from "./../../../shared/services/popup.service";
import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ProductService } from "src/app/shared/services/api-services/product.service";
import { AppMessageService } from "src/app/shared/services/app-message.service";
import { ExcelService } from "src/app/shared/services/excel.service";
import { MasterDataService } from "src/app/shared/services/master-data.service";
import { AddProductFormComponent } from "./add-product-form/add-product-form.component";

@Component({
  selector: "app-product-management",
  templateUrl: "./product-management.component.html",
  styleUrls: ["./product-management.component.css"],
})
export class ProductManagementComponent implements OnInit {
  recodes: any[] = [];
  cols: any[] = [];
  constructor(
    private productService: ProductService,
    private messageService: AppMessageService,
    private excelService: ExcelService,
    private datePipe: DatePipe,
    private masterDateService: MasterDataService,
    private popupService: PopupService
  ) {}

  ngOnInit() {
    this.cols = [
      { field: "productCode", header: "Code" },
      { field: "productName", header: "Name" },
      { field: "type", header: "Type" },
      { field: "amount", header: "Amount" },
      { field: "rate", header: "Rate" },
      { field: "rateAmount", header: "Rate Amount" },
      { field: "termsCount", header: "Terms" },
      { field: "status", header: "Status" },
    ];

    this.getAllProducts();
  }

  getAllProducts() {
    this.productService.GetAllProducts(true).subscribe((response) => {
      if (response.IsSuccessful) {
        this.recodes = response.Result;
      }
    });
  }

  onClickAddNew() {
    let data = {
      isAdd: true,
      isEdit: false,
      isView: false,
      productInfo: null,
    };

    this.popupService
      .OpenModel(AddProductFormComponent, {
        header: "ADD PRODUCT",
        width: "50vw",
        data: data,
      })
      .subscribe((res) => {});
  }

  onStatusChange(rowData: any) {
    let confirmationConfig = {
      message: `Are you sure you want to  ${
        rowData?.status == 2 ? "Activate" : "inactivate"
      } this product?`,
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
    };

    this.messageService.ConfirmPopUp(
      confirmationConfig,
      (isConfirm: boolean) => {
        if (isConfirm) {
          this.productService
            .ActiveInactiveProduct(rowData?._id)
            .subscribe((response) => {
              if (response.IsSuccessful) {
                this.messageService.showSuccessAlert(response.Message);
                this.getAllProducts();
              } else {
                this.messageService.showErrorAlert(response.Message);
              }
            });
        }
      }
    );
  }

  onDelete(rowData: any) {
    let confirmationConfig = {
      message: `Are you sure you want to delete this product?`,
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
    };

    this.messageService.ConfirmPopUp(
      confirmationConfig,
      (isConfirm: boolean) => {
        if (isConfirm) {
          this.productService
            .DeleteProduct(rowData?._id)
            .subscribe((response) => {
              if (response.IsSuccessful) {
                this.messageService.showSuccessAlert(response.Message);
                this.getAllProducts();
              } else {
                this.messageService.showErrorAlert(response.Message);
              }
            });
        }
      }
    );
  }

  onEdit(rowData: any) {}

  exportToExcel() {
    let cols = [
      { field: "productCode", header: "Code" },
      { field: "productName", header: "Name" },
      { field: "type", header: "Type" },
      { field: "amount", header: "Amount" },
      { field: "maxAmount", header: "Max Amount" },
      { field: "minAmount", header: "Min Amount" },
      { field: "rate", header: "Rate" },
      { field: "rateAmount", header: "Rate Amount" },
      { field: "termsCount", header: "Terms" },
      { field: "isOpenDeductionCharges", header: "Is Open Deduction Charges" },
      { field: "statusName", header: "Status" },
      { field: "createdBy", header: "Created By" },
      { field: "updatedBy", header: "Updated By" },
    ];

    let data = this.recodes.map((item) => {
      return {
        productCode: item?.productCode,
        productName: item?.productName,
        type: item?.type,
        amount: item?.amount,
        maxAmount: item?.maxAmount,
        minAmount: item?.minAmount,
        rate: item?.isPercentage ? item?.rate + "%" : item?.rate,
        rateAmount: item?.rateAmount,
        termsCount: item?.termsCount,
        isOpenDeductionCharges: item?.isOpenDeductionCharges,
        statusName: item?.statusName,
        createdBy:
          item?.createdUser +
          " " +
          this.datePipe.transform(item?.createdAt, "dd-MM-yyyy hh:mm a"),
        updatedBy:
          item?.updatedUser +
          " " +
          this.datePipe.transform(item?.updatedAt, "dd-MM-yyyy hh:mm a"),
      };
    });

    this.excelService.GenerateExcelFileWithCustomHeader(cols, data, "Products");
  }
}
