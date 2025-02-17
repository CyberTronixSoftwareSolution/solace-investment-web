import { LoanService } from "./../../../../shared/services/api-services/loan.service";
import { LoanFlowServiceService } from "./loan-flow-service.service";
import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { MenuItem } from "primeng/api";
import { SidebarService } from "src/app/shared/services/sidebar.service";
import { GeneralInformationComponent } from "./general-information/general-information.component";
import { OtherDetailsComponent } from "./other-details/other-details.component";
import { GuarantorDetailsComponent } from "./guarantor-details/guarantor-details.component";
import { LoanSummaryComponent } from "./loan-summary/loan-summary.component";
import { AppMessageService } from "src/app/shared/services/app-message.service";

@Component({
  selector: "app-add-loan-form",
  templateUrl: "./add-loan-form.component.html",
  styleUrls: ["./add-loan-form.component.css"],
})
export class AddLoanFormComponent implements OnInit {
  @ViewChild("templateRef", { static: true }) templateRef: TemplateRef<any>;

  @ViewChild(GeneralInformationComponent)
  private gic!: GeneralInformationComponent;

  @ViewChild(OtherDetailsComponent)
  private odc!: OtherDetailsComponent;

  @ViewChild(GuarantorDetailsComponent)
  private gdc!: GuarantorDetailsComponent;

  @ViewChild(LoanSummaryComponent)
  private lsc!: LoanSummaryComponent;

  value: any = { value: 0, label: "Personal" };
  showingIndex: number = 0;

  activeIndex: any = 0;
  items: MenuItem[];

  loanDetails: any;
  constructor(
    private sidebarService: SidebarService,
    private loanFlowService: LoanFlowServiceService,
    private messageService: AppMessageService,
    private loanService: LoanService
  ) {}

  ngOnInit() {
    this.sidebarService.setFooterTemplate(this.templateRef);
    this.items = [
      {
        value: 0,
        label: "General Details",
      },
      {
        value: 1,
        label: "Other Details",
      },
      {
        value: 2,
        label: "Guarantor Details",
      },
      {
        value: 3,
        label: "Loan Summary",
      },
    ];
  }

  handleClick(index: number): void {
    debugger;
    let isStepCompleted = this.loanFlowService.getStepValue(index) as boolean;

    // isStepCompleted = true;
    if (isStepCompleted) {
      this.showingIndex = index;
    } else {
      return;
    }
    // this.showingIndex = index;
  }

  handleCancel() {}

  handleSave(index: number) {
    this.loanDetails = this.loanFlowService.getLoanDetails();

    switch (index) {
      case 0:
        this.saveGeneralDetails();
        break;
      case 1:
        this.saveOtherDetails();
        break;
      case 2:
        this.saveGuarantorDetails();
        break;
      case 3:
        this.saveLoan();
        break;
      default:
        break;
    }
  }

  saveGeneralDetails() {
    if (this.gic.FV.formGroup.invalid) {
      this.gic.FV.showErrors();
      return;
    }
    debugger;

    let formData = this.gic.FV.formGroup.value;
    let loanNo = this.gic.FV.getValue("loanNo");
    let transactionDate = this.gic.FV.getValue("transactionDate");

    // Set Product details
    let product = {
      ...this.gic.selectedProduct,
      rate: formData.rate || 0,
      termsCount: formData.terms || 0,
      amount: formData.amount || 0,
      disbursementDate: formData.disbursementDate || "",
    };

    this.loanDetails = {
      ...this.loanDetails,
      productDetails: product,
      borrowerDetails: this.gic.selectedBorrower,
      loanNo: loanNo,
      reference: formData.reference,
      transactionDate: transactionDate,
      reason: formData.reason,
    };

    //set updated loan details
    this.loanFlowService.setLoanDetails(this.loanDetails);

    // mark step as completed
    this.loanFlowService.setStepValue(0, true);

    this.showingIndex += 1;
  }

  saveOtherDetails() {
    let validateParam = "recoveryOfficer";

    if (this.loanDetails.productDetails.type != "D") {
      validateParam += ",collectionDate";
    }

    if (this.odc.FV.validateControllers(validateParam)) {
      return;
    }

    let formData = this.odc.FV.formGroup.value;

    this.odc.selectedProduct = {
      ...this.odc.selectedProduct,
      deductionCharges: this.odc.deductionCharges || [],
    };

    this.loanDetails = {
      ...this.loanDetails,
      recoveryOfficer: formData.recoveryOfficer,
      collectionDate: formData.collectionDate,
      isChargesReduceFromLoan: formData.isChargesReduceFromLoan,
      productDetails: this.odc.selectedProduct,
    };

    //set updated loan details
    this.loanFlowService.setLoanDetails(this.loanDetails);

    // mark step as completed
    this.loanFlowService.setStepValue(1, true);

    this.showingIndex += 1;
  }
  ngAfterContentChecked(): void {
    //Called after every check of the component's or directive's content.
    //Add 'implements AfterContentChecked' to the class.
    console.log(this.loanDetails);
  }

  saveGuarantorDetails() {
    if (this.gdc.guarantors.length < 2) {
      this.messageService.showWarnAlert(
        "Please add at least two guarantors to continue!"
      );
      return;
    }
    debugger;

    this.loanDetails = {
      ...this.loanDetails,
      guarantors: this.gdc.guarantors,
    };

    //set updated loan details
    this.loanFlowService.setLoanDetails(this.loanDetails);

    // mark step as completed
    this.loanFlowService.setStepValue(2, true);

    this.showingIndex += 1;
  }

  saveLoan() {
    debugger;
    if (this.loanDetails?.guarantors?.length < 2) {
      this.messageService.showWarnAlert(
        "Please add at least two guarantors to continue!"
      );
      return;
    }

    let guarantors = [];
    this.loanDetails?.guarantors.map((x: any) => {
      guarantors.push({
        guarantor: x._id,
      });
    });

    let request = {
      loanNumber: this.loanDetails?.loanNo,
      transactionDate: this.loanDetails?.transactionDate,
      reference: this.loanDetails?.reference || "",
      borrower: this.loanDetails?.borrowerDetails?._id || "",
      product: this.loanDetails?.productDetails,
      reason: this.loanDetails?.reason,
      recoverOfficer: this.loanDetails?.recoveryOfficer?._id,
      collectionDate: this.loanDetails?.collectionDate,
      isDeductionChargesReducedFromLoan:
        this.loanDetails?.isChargesReduceFromLoan,
      guarantors: guarantors || [],
    };

    this.loanService.SaveLoan(request).subscribe((response) => {
      if (response.IsSuccessful) {
        this.messageService.showSuccessAlert(response.Message);
        this.sidebarService.sidebarEvent.emit(true);
      } else {
        this.messageService.showErrorAlert(response.Message);
      }
    });
  }

  ngOnDestroy(): void {
    this.loanFlowService.resetData();
  }
}
