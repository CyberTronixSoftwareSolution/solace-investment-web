import { HelperService } from "src/app/shared/services/helper.service";
import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { MenuItem } from "primeng/api";
import { SidebarService } from "src/app/shared/services/sidebar.service";
import { AddUserControlFlowService } from "./add-user-control-flow.service";
import { PersonalDetailsComponent } from "./personal-details/personal-details.component";
import { FamilyDetailsComponent } from "./family-details/family-details.component";
import { BankDetailsComponent } from "./bank-details/bank-details.component";
import { ExpensesIncomeDetailsComponent } from "./expenses-income-details/expenses-income-details.component";
import { AppMessageService } from "src/app/shared/services/app-message.service";
import { firstValueFrom } from "rxjs";
import { UserService } from "src/app/shared/services/api-services/user.service";
import { WellKnownUploadType } from "src/app/shared/enums/well-known-upload-type.enum";
import { StoreService } from "src/app/shared/services/api-services/store.service";

@Component({
  selector: "app-add-new-user-form",
  templateUrl: "./add-new-user-form.component.html",
  styleUrls: ["./add-new-user-form.component.css"],
})
export class AddNewUserFormComponent implements OnInit {
  @ViewChild("templateRef", { static: true }) templateRef: TemplateRef<any>;
  @ViewChild(PersonalDetailsComponent)
  private pdc!: PersonalDetailsComponent;

  @ViewChild(FamilyDetailsComponent)
  private fdc!: FamilyDetailsComponent;

  @ViewChild(BankDetailsComponent)
  private bdc!: BankDetailsComponent;

  @ViewChild(ExpensesIncomeDetailsComponent)
  private eidc!: ExpensesIncomeDetailsComponent;

  activeIndex: any = 0;
  items: MenuItem[];
  value: any = { value: 0, label: "Personal" };
  showingIndex: number = 0;
  userDetail: any;
  uploadedImages: any;
  isEdit: boolean = false;
  isView: boolean = false;
  WellKnownUploadType = WellKnownUploadType;
  constructor(
    private sidebarService: SidebarService,
    private addUserControlFlowService: AddUserControlFlowService,
    private messageService: AppMessageService,
    private userService: UserService,
    private helperService: HelperService,
    private storeService: StoreService
  ) {}

  ngOnInit() {
    let sideBarData = this.sidebarService.getData();
    this.sidebarService.setFooterTemplate(this.templateRef);

    if (sideBarData) {
      this.isEdit = sideBarData.isEdit;
      this.isView = sideBarData.isView;

      if (this.isEdit) {
        this.addUserControlFlowService.setStepValue(0, true);
        this.addUserControlFlowService.setStepValue(1, true);
        this.addUserControlFlowService.setStepValue(2, true);
        this.addUserControlFlowService.setStepValue(3, true);
      } else if (this.isView) {
        this.addUserControlFlowService.setStepValue(0, true);
        this.addUserControlFlowService.setStepValue(1, true);
        this.addUserControlFlowService.setStepValue(2, true);
        this.addUserControlFlowService.setStepValue(3, true);
      }
    }

    this.items = [
      {
        value: 0,
        label: "Personal",
      },
      {
        value: 1,
        label: "Bank Details",
      },
      {
        value: 2,
        label: "Family Details",
      },
      {
        value: 3,
        label: "Expenses/Income",
      },
    ];
  }

  handleClick(index: number): void {
    let isStepCompleted = this.addUserControlFlowService.getStepValue(
      index
    ) as boolean;

    // isStepCompleted = true;
    if (isStepCompleted) {
      this.showingIndex = index;
    } else {
      return;
    }
  }

  handleCancel() {
    this.sidebarService.sidebarEvent.emit(false);
  }

  handleSave(index: number, isEdit: boolean = false): void {
    this.userDetail = this.addUserControlFlowService.getUserDetail();

    if (!this.isView) {
      switch (index) {
        case 0:
          this.savePersonalDetails(isEdit);
          break;
        case 1:
          this.saveBankDetails(isEdit);
          break;
        case 2:
          this.saveFamilyDetails(isEdit);
          break;
        case 3:
          this.saveExpenseIncomeDetails();
          break;
        default:
          this.showingIndex = 0 + 1;
      }
    } else {
      this.showingIndex = index + 1;
    }
  }

  async savePersonalDetails(isEdit: boolean = false) {
    let validateParam =
      "nicNumber,title,fullName,initials,firstName,lastName,dateOfBirth,age,gender,civilStatus,occupation,role,mobileNo1,mobileNo2,residenceNo,specialNote";

    if (this.pdc.isEmailRequired) {
      validateParam += ",email";
    }

    if (this.pdc.FV.validateControllers(validateParam)) {
      return;
    }

    if (this.pdc.addressRecodes.length <= 0) {
      this.messageService.showWarnAlert(
        "Please add at least one address to continue!"
      );
      return;
    }

    let imageValidateResult = this.pdc.validateNicOrDrivingLicenseImage();
    if (imageValidateResult) {
      return;
    }

    let formData = this.pdc.FV.formGroup.value;

    const userNameCheckResult = await firstValueFrom(
      this.userService.checkUserDataExist(
        formData.role,
        this.userDetail?._id ?? "",
        formData?.email ?? "",
        formData?.nicNumber ?? ""
      )
    );

    if (userNameCheckResult.IsSuccessful) {
      if (!userNameCheckResult.Result) {
        this.messageService.showErrorAlert(userNameCheckResult.Message);
        return;
      }
    } else {
      this.messageService.showErrorAlert(userNameCheckResult.Message);
      return;
    }

    this.userDetail = {
      ...this.userDetail,
      nicNumber: this.isEdit ? this.userDetail.nicNumber : formData.nicNumber,
      titleId: formData.title.id,
      title: formData.title.name,
      fullName: formData.fullName,
      initial: formData.initials,
      firstName: formData.firstName,
      lastName: formData.lastName,
      dateOfBirth: formData.dateOfBirth,
      age: formData.age,
      genderId: formData.gender.id,
      gender: formData.gender.name,
      civilStatusId: formData.civilStatus.id,
      civilStatus: formData.civilStatus.name,
      occupation: formData.occupation,
      role: this.isEdit ? this.userDetail.role : formData.role,
      mobileNo1:
        this.helperService.formatPhoneNumberToRaw(formData.mobileNo1) || "",
      mobileNo2: formData.mobileNo2
        ? this.helperService.formatPhoneNumberToRaw(formData.mobileNo2)
        : "",
      residenceNo:
        this.helperService.formatPhoneNumberToRaw(formData.residenceNo) || "",
      email: formData.email,
      specialNote: formData.specialNote,
      addresses: this.pdc.addressRecodes,
    };

    if (isEdit) {
      this.updateUSerDetail();
      return;
    }

    this.addUserControlFlowService.setUserDetail(this.userDetail);
    this.addUserControlFlowService.setStepValue(0, true);

    this.showingIndex = 0 + 1;
    try {
    } catch (error) {
      this.messageService.showErrorAlert(error?.message || error);
    }
  }

  saveBankDetails(isEdit: boolean = false) {
    var validateParam = "bankName,branchName,accNumber,accHolderName";

    if (this.bdc.FV.validateControllers(validateParam)) {
      return;
    }

    if (this.bdc.isBankSelected) {
      let formData = this.bdc.FV.formGroup.value;
      this.userDetail = {
        ...this.userDetail,
        bankId: formData.bankName.id,
        bankName: formData.bankName.name,
        branch: formData.branchName,
        accountNumber: formData.accNumber,
        accountHolderName: formData.accHolderName,
      };
    } else {
      this.userDetail = {
        ...this.userDetail,
        bankId: null,
        bankName: "",
        branch: "",
        accountNumber: "",
        accountHolderName: "",
        bankBookUrl: "",
      };

      this.addUserControlFlowService.setUploadImage(
        this.WellKnownUploadType.BankBook,
        null,
        ""
      );
    }

    if (isEdit) {
      this.updateUSerDetail();
      return;
    }

    this.addUserControlFlowService.setUserDetail(this.userDetail);
    this.addUserControlFlowService.setStepValue(1, true);

    this.showingIndex = 1 + 1;
  }

  saveFamilyDetails(isEdit: boolean = false) {
    let validateParam = "SFullName,SNic,SOccupation,SIncome";

    if (this.fdc.FV.validateControllers(validateParam)) {
      return;
    }

    let formData = this.fdc.FV.formGroup.value;

    if (formData?.SFullName && formData?.SNic && formData.SOccupation) {
      this.userDetail = {
        ...this.userDetail,
        spouseDetails: {
          fullName: formData?.SFullName || "",
          nic: formData?.SNic || "",
          occupation: formData?.SOccupation || "",
          income: formData?.SIncome || 0,
        },
        familyInfos: this.fdc.familyRecodes || [],
      };
    } else {
      this.userDetail = {
        ...this.userDetail,
        spouseDetails: null,
        familyInfos: this.fdc.familyRecodes || [],
      };
    }

    if (isEdit) {
      this.updateUSerDetail();
      return;
    }

    this.addUserControlFlowService.setUserDetail(this.userDetail);
    this.addUserControlFlowService.setStepValue(2, true);

    this.showingIndex = 2 + 1;
  }

  async saveExpenseIncomeDetails() {
    try {
      this.uploadedImages = this.addUserControlFlowService.getUploadImage();

      if (this.eidc.expensesRecodes?.length > 0) {
        this.userDetail = {
          ...this.userDetail,
          expensesDetails: {
            expenses: this.eidc.expensesRecodes,
            totalExpenses: this.eidc.totalIncome,
          },
        };
      } else {
        this.userDetail = {
          ...this.userDetail,
          expensesDetails: null,
        };
      }

      if (this.eidc.incomeRecodes?.length > 0) {
        this.userDetail = {
          ...this.userDetail,
          incomeDetails: {
            incomes: this.eidc.incomeRecodes,
            totalIncome: this.eidc.totalIncome,
          },
        };
      } else {
        this.userDetail = {
          ...this.userDetail,
          incomeDetails: null,
        };
      }
      debugger;

      let nicImageResult = null;
      let drivingLicenseResult = null;
      let businessRegistrationResult = null;
      let profileImageResult = null;
      let bankBookResult = null;

      if (this.uploadedImages.selectedProfileImage) {
        profileImageResult = await firstValueFrom(
          this.storeService.UploadImage(
            this.uploadedImages.selectedProfileImage,
            WellKnownUploadType.ProfileImage
          )
        );
      }

      if (this.uploadedImages.selectedNicImage) {
        nicImageResult = await firstValueFrom(
          this.storeService.UploadImage(
            this.uploadedImages.selectedNicImage,
            WellKnownUploadType.NICImage
          )
        );
      }

      if (this.uploadedImages.selectedDrivingLicenseImage) {
        drivingLicenseResult = await firstValueFrom(
          this.storeService.UploadImage(
            this.uploadedImages.selectedDrivingLicenseImage,
            WellKnownUploadType.DrivingLicense
          )
        );
      }

      if (this.uploadedImages.selectedBusinessRegistrationImage) {
        businessRegistrationResult = await firstValueFrom(
          this.storeService.UploadImage(
            this.uploadedImages.selectedBusinessRegistrationImage,
            WellKnownUploadType.BusinessRegistration
          )
        );
      }

      if (this.uploadedImages.selectedBankBookImage) {
        bankBookResult = await firstValueFrom(
          this.storeService.UploadImage(
            this.uploadedImages.selectedBankBookImage,
            WellKnownUploadType.BankBook
          )
        );
      }

      this.userDetail = {
        ...this.userDetail,
        nicImageUrl: nicImageResult?.Result ?? this.userDetail?.nicImageUrl,
        drivingLicenseUrl:
          drivingLicenseResult?.Result ?? this.userDetail?.drivingLicenseUrl,
        businessRegistrationUrl:
          businessRegistrationResult?.Result ??
          this.userDetail?.businessRegistrationUrl,
        profileImageUrl:
          profileImageResult?.Result ?? this.userDetail?.profileImageUrl,
        bankBookUrl: bankBookResult?.Result ?? this.userDetail?.bankBookUrl,
      };

      if (!this.isEdit) {
        this.userService.saveUser(this.userDetail).subscribe((response) => {
          if (response.IsSuccessful) {
            this.messageService.showSuccessAlert(response.Message);
            this.addUserControlFlowService.resetData();
            this.sidebarService.sidebarEvent.emit(true);
          } else {
            this.messageService.showErrorAlert(response.Message);
          }
        });
      } else {
        this.userService
          .updateUserDetails(this.userDetail._id, this.userDetail)
          .subscribe((result) => {
            if (result.IsSuccessful) {
              this.messageService.showSuccessAlert(result.Message);
              this.addUserControlFlowService.resetData();
              this.sidebarService.sidebarEvent.emit(true);
            } else {
              this.messageService.showErrorAlert(result.Message);
            }
          });
      }
    } catch (error) {
      this.messageService.showWarnAlert(error?.message || error);
    }
  }

  async updateUSerDetail() {
    try {
      this.uploadedImages = this.addUserControlFlowService.getUploadImage();

      let nicImageResult = null;
      let drivingLicenseResult = null;
      let businessRegistrationResult = null;
      let profileImageResult = null;
      let bankBookResult = null;

      if (this.uploadedImages.selectedProfileImage) {
        profileImageResult = await firstValueFrom(
          this.storeService.UploadImage(
            this.uploadedImages.selectedProfileImage,
            WellKnownUploadType.ProfileImage
          )
        );
      }

      if (this.uploadedImages.selectedNicImage) {
        nicImageResult = await firstValueFrom(
          this.storeService.UploadImage(
            this.uploadedImages.selectedNicImage,
            WellKnownUploadType.NICImage
          )
        );
      }

      if (this.uploadedImages.selectedDrivingLicenseImage) {
        drivingLicenseResult = await firstValueFrom(
          this.storeService.UploadImage(
            this.uploadedImages.selectedDrivingLicenseImage,
            WellKnownUploadType.DrivingLicense
          )
        );
      }

      if (this.uploadedImages.selectedBusinessRegistrationImage) {
        businessRegistrationResult = await firstValueFrom(
          this.storeService.UploadImage(
            this.uploadedImages.selectedBusinessRegistrationImage,
            WellKnownUploadType.BusinessRegistration
          )
        );
      }

      if (this.uploadedImages.selectedBankBookImage) {
        bankBookResult = await firstValueFrom(
          this.storeService.UploadImage(
            this.uploadedImages.selectedBankBookImage,
            WellKnownUploadType.BankBook
          )
        );
      }

      this.userDetail = {
        ...this.userDetail,
        nicImageUrl: nicImageResult?.Result ?? this.userDetail?.nicImageUrl,
        drivingLicenseUrl:
          drivingLicenseResult?.Result ?? this.userDetail?.drivingLicenseUrl,
        businessRegistrationUrl:
          businessRegistrationResult?.Result ??
          this.userDetail?.businessRegistrationUrl,
        profileImageUrl:
          profileImageResult?.Result ?? this.userDetail?.profileImageUrl,
        bankBookUrl: bankBookResult?.Result ?? this.userDetail?.bankBookUrl,
      };

      this.userService
        .updateUserDetails(this.userDetail._id, this.userDetail)
        .subscribe((result) => {
          if (result.IsSuccessful) {
            this.messageService.showSuccessAlert(result.Message);
            this.addUserControlFlowService.resetData();
            this.sidebarService.sidebarEvent.emit(true);
          } else {
            this.messageService.showErrorAlert(result.Message);
          }
        });
    } catch (error) {
      this.messageService.showErrorAlert(error?.message || error);
    }
  }
}
