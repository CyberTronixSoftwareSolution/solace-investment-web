import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, Validators } from "@angular/forms";
import { ProductService } from "src/app/shared/services/api-services/product.service";
import { ReportService } from "src/app/shared/services/api-services/report.service";
import { UserService } from "src/app/shared/services/api-services/user.service";
import { CommonForm } from "src/app/shared/services/app-common-form";
import { AppMessageService } from "src/app/shared/services/app-message.service";
import { SidebarService } from "src/app/shared/services/sidebar.service";
import { DailyManagerReportTemplateComponent } from "./daily-manager-report-template/daily-manager-report-template.component";
import { firstValueFrom } from "rxjs";

@Component({
  selector: "app-daily-manager-report",
  templateUrl: "./daily-manager-report.component.html",
  styleUrls: ["./daily-manager-report.component.css"],
})
export class DailyManagerReportComponent implements OnInit {
  FV = new CommonForm();
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
    this.FV.setValue("selectedDate", new Date());
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      selectedDate: ["", [Validators.required]],
    });
  }

  async onPrint() {
    try {
      if (this.FV.validateControllers("selectedDate")) {
        return;
      }
      let data = {
        printData: null,
        selectedData: null,
      };

      let formData = this.FV.formGroup.value;
      let selectedData = {
        selectedDate: this.datePipe.transform(
          formData?.selectedDate,
          "yyyy-MM-dd"
        ),
      };

      data.selectedData = selectedData;

      const printResult = await firstValueFrom(
        this.reportService.GetDailyManagerReportData(
          this.datePipe.transform(formData?.selectedDate, "yyyy-MM-dd")
        )
      );

      if (printResult.IsSuccessful) {
        data.printData = printResult.Result;
      }

      let properties = {
        width: "80vw",
        position: "right",
        data: data,
      };

      this.sidebarService.addComponent(
        "PRINT DAILY MANAGER REPORT",
        DailyManagerReportTemplateComponent,
        properties,
        data
      );
    } catch (error) {}
  }
}
