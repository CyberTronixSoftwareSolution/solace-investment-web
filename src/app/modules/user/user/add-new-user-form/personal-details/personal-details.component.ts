import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { CommonForm } from "src/app/shared/services/app-common-form";
import { AddUserControlFlowService } from "../add-user-control-flow.service";
import {
  addressTypes,
  civilStatus,
  genders,
  titles,
} from "src/app/shared/data/commonData";
import { userRoles } from "src/app/shared/data/useRoles";
import { WellKnownUploadType } from "src/app/shared/enums/well-known-upload-type.enum";
import { PopupService } from "src/app/shared/services/popup.service";
import { WebcamViewComponent } from "src/app/shared/components/webcam-view/webcam-view.component";
import { HelperService } from "src/app/shared/services/helper.service";
import { AppMessageService } from "src/app/shared/services/app-message.service";
import { MasterDataService } from "src/app/shared/services/master-data.service";
import { WellKnownUserRole } from "src/app/shared/enums/well-known-user-role.enum";

@Component({
  selector: "app-personal-details",
  templateUrl: "./personal-details.component.html",
  styleUrls: ["./personal-details.component.css"],
})
export class PersonalDetailsComponent implements OnInit {
  FV = new CommonForm();
  titleArr: any[] = titles;
  genderArr: any[] = genders;
  civilStatusArr: any[] = civilStatus;
  roleArr: any[] = userRoles;
  addressTypeArr: any[] = addressTypes;
  addressCols: any[] = [];
  addressRecodes: any[] = [];
  userDetail: any;
  isEdit: boolean = false;
  isView: boolean = false;
  userRole: number = 0;

  WellKnownUploadType = WellKnownUploadType;

  nicImageUrl: string | ArrayBuffer | null = null;
  uploadNicImage: any = null;
  selectedNicImage: File = null;

  drivingLicenseImageUrl: string | ArrayBuffer | null = null;
  uploadDrivingLicenseImage: any = null;
  selectedDrivingLicenseImage: File = null;

  businessRegistrationImageUrl: string | ArrayBuffer | null = null;
  uploadBusinessRegistrationImage: any = null;
  selectedBusinessRegistrationImage: File = null;

  profileImageUrl: string | ArrayBuffer | null = null;
  uploadProfileImage: any = null;
  selectedProfileImage: File = null;

  isEmailRequired: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private addUserControlFlowService: AddUserControlFlowService,
    private datePipe: DatePipe,
    private popUpService: PopupService,
    private helper: HelperService,
    private messageService: AppMessageService,
    private masterDataService: MasterDataService
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.userRole = this.masterDataService.Role;
    this.userDetail = this.addUserControlFlowService.getUserDetail();
    this.isEdit = this.addUserControlFlowService.getIsEdit();
    this.isView = this.addUserControlFlowService.getIsView();

    this.FV.clearValue("age");
    this.setData();

    if (this.userRole == WellKnownUserRole.ADMIN) {
      this.roleArr = this.roleArr.filter((x) => x.id === 3);
    }

    this.addressCols = [
      { field: "addressType", header: "Address Type" },
      { field: "line1", header: "Line 1" },
      { field: "line2", header: "Line 2" },
      { field: "line3", header: "Line 3" },
    ];
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      nicNumber: [
        "",
        [
          Validators.required,
          Validators.pattern(
            /^(([5,6,7,8,9]{1})([0-9]{1})([0,1,2,3,5,6,7,8]{1})([0-9]{6})([v|V|x|X]))|(([1,2]{1})([0,9]{1})([0-9]{2})([0,1,2,3,5,6,7,8]{1})([0-9]{7}))/gm
          ),
        ],
      ],
      title: ["", Validators.required],
      fullName: ["", Validators.required],
      initials: ["", Validators.required],
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      dateOfBirth: ["", Validators.required],
      age: ["", Validators.required],
      gender: ["", Validators.required],
      civilStatus: ["", Validators.required],
      occupation: ["", Validators.required],
      role: ["", Validators.required],
      mobileNo1: ["", Validators.required],
      mobileNo2: [""],
      residenceNo: ["", Validators.required],
      email: [""],
      specialNote: ["", [Validators.maxLength(500)]],

      // Address
      addressType: ["", Validators.required],
      line1: ["", Validators.required],
      line2: ["", Validators.required],
      line3: [""],
    });
  }

  setData() {
    debugger;
    this.FV.setValue("nicNumber", this.userDetail.nicNumber);
    let selectedTitle = this.titleArr.find(
      (x) => x.id == this.userDetail.titleId
    );
    this.FV.setValue("title", selectedTitle);

    let selectedGender = this.genderArr.find(
      (x) => x.id == this.userDetail.genderId
    );
    this.FV.setValue("gender", selectedGender);

    let selectedCivilStatus = this.civilStatusArr.find(
      (x) => x.id == this.userDetail.civilStatusId
    );
    this.FV.setValue("civilStatus", selectedCivilStatus);

    this.addressRecodes = this.userDetail.addresses;

    this.FV.setValue("fullName", this.userDetail.fullName);
    this.FV.setValue("initials", this.userDetail.initial);
    this.FV.setValue("firstName", this.userDetail.firstName);
    this.FV.setValue("lastName", this.userDetail.lastName);
    if (
      this.userDetail.dateOfBirth != null &&
      this.userDetail.dateOfBirth != undefined &&
      this.userDetail.dateOfBirth != ""
    ) {
      this.FV.setValue("dateOfBirth", new Date(this.userDetail.dateOfBirth));
    }
    this.FV.setValue("age", this.userDetail.age);
    this.FV.setValue("occupation", this.userDetail.occupation);
    if (this.userDetail.role) {
      this.FV.setValue("role", this.userDetail.role);
    } else {
      if (this.userRole == WellKnownUserRole.ADMIN) {
        this.FV.setValue("role", this.roleArr[0].id);
      } else {
        this.FV.setValue("role", WellKnownUserRole.CUSTOMER);
      }
    }
    this.onRoleChange();
    this.FV.setValue("mobileNo1", this.userDetail.mobileNo1);
    this.FV.setValue("mobileNo2", this.userDetail.mobileNo2);
    this.FV.setValue("residenceNo", this.userDetail.residenceNo);
    this.FV.setValue("email", this.userDetail.email);
    this.FV.setValue("specialNote", this.userDetail.specialNote);

    // Set images
    if (this.userDetail.profileImageUrl) {
      this.profileImageUrl = this.userDetail.profileImageUrl;
    }

    if (this.userDetail.nicImageUrl) {
      this.nicImageUrl = this.userDetail.nicImageUrl;
    }

    if (this.userDetail.drivingLicenseUrl) {
      this.drivingLicenseImageUrl = this.userDetail.drivingLicenseUrl;
    }

    if (this.userDetail.businessRegistrationUrl) {
      this.businessRegistrationImageUrl =
        this.userDetail.businessRegistrationUrl;
    }

    if (this.isEdit) {
      this.FV.disableField("nicNumber");
      this.FV.disableField("role");
    } else if (this.isView) {
      this.FV.disableFormControlls();
    }
  }

  removeImage(uploadType: number) {
    switch (uploadType) {
      case WellKnownUploadType.ProfileImage:
        this.uploadProfileImage = null;
        this.profileImageUrl = null;
        this.selectedProfileImage = null;
        let userDetails = {
          ...this.userDetail,
          profileImageUrl: "",
        };
        this.addUserControlFlowService.setUserDetail(userDetails);
        break;
      case WellKnownUploadType.NICImage:
        this.uploadNicImage = null;
        this.nicImageUrl = null;
        this.selectedNicImage = null;
        let userDetailsNIC = {
          ...this.userDetail,
          nicImageUrl: "",
        };
        this.addUserControlFlowService.setUserDetail(userDetailsNIC);
        break;

      case WellKnownUploadType.DrivingLicense:
        this.uploadDrivingLicenseImage = null;
        this.drivingLicenseImageUrl = null;
        this.selectedDrivingLicenseImage = null;
        let userDetailsDL = {
          ...this.userDetail,
          drivingLicenseUrl: "",
        };

        this.addUserControlFlowService.setUserDetail(userDetailsDL);
        break;
      case WellKnownUploadType.BusinessRegistration:
        this.uploadBusinessRegistrationImage = null;
        this.businessRegistrationImageUrl = null;
        this.selectedBusinessRegistrationImage = null;
        let userDetailsBusinessRegistration = {
          ...this.userDetail,
          businessRegistrationUrl: "",
        };
        this.addUserControlFlowService.setUserDetail(
          userDetailsBusinessRegistration
        );
        break;
    }

    this.addUserControlFlowService.setUploadImage(uploadType, null, "");
  }

  openUploadDialog(uploadType: number) {
    let header = "Capture ";
    switch (uploadType) {
      case WellKnownUploadType.ProfileImage:
        header += "Profile Image";
        break;
      case WellKnownUploadType.NICImage:
        header += "NIC Image";
        break;
      case WellKnownUploadType.DrivingLicense:
        header += "Driving License";
        break;
      case WellKnownUploadType.BusinessRegistration:
        header += "Business Registration";
        break;
    }

    this.popUpService
      .OpenModel(WebcamViewComponent, {
        header: header,
        width: "35vw",
        height: "35vh",
      })
      .subscribe((res) => {
        if (res?.isSave) {
          debugger;
          switch (uploadType) {
            case WellKnownUploadType.ProfileImage:
              this.uploadProfileImage = res;
              this.profileImageUrl = res.imageUrl;
              this.selectedProfileImage = res.file;
              break;
            case WellKnownUploadType.NICImage:
              this.uploadNicImage = res;
              this.nicImageUrl = res.imageUrl;
              this.selectedNicImage = res.file;
              break;
            case WellKnownUploadType.BusinessRegistration:
              this.uploadBusinessRegistrationImage = res;
              this.businessRegistrationImageUrl = res.imageUrl;
              this.selectedBusinessRegistrationImage = res.file;
              break;
            case WellKnownUploadType.DrivingLicense:
              this.uploadDrivingLicenseImage = res;
              this.drivingLicenseImageUrl = res.imageUrl;
              this.selectedDrivingLicenseImage = res.file;
              break;
          }

          this.addUserControlFlowService.setUploadImage(
            uploadType,
            res.file,
            res.imageUrl
          );
        }
      });
  }

  onRoleChange() {
    let role = this.FV.getValue("role");

    if (
      role == WellKnownUserRole.ADMIN ||
      role == WellKnownUserRole.SUPERADMIN
    ) {
      this.isEmailRequired = true;
      this.FV.clearValue("email");
      this.FV.formGroup.get("email").setValidators([Validators.required]);
    } else {
      this.isEmailRequired = false;
      this.FV.clearValue("email");
      this.FV.formGroup.get("email").clearValidators();
    }

    this.FV.formGroup.get("email").updateValueAndValidity();
  }

  validateAndShowNicDetails() {
    debugger;
    let nicNumber = this.FV.getValue("nicNumber").trim();
    var dayText = 0;
    var year = "";
    var month = "";
    var day = 0;
    var gender = "";

    if (
      (nicNumber.length === 10 &&
        (nicNumber.charAt(9) === "V" || nicNumber.charAt(9) === "X") &&
        !isNaN(Number(...nicNumber.slice(0, 9)))) ||
      (nicNumber.length === 12 && !isNaN(Number(nicNumber)))
    ) {
      if (nicNumber.length == 10) {
        year = "19" + nicNumber.substr(0, 2);
        dayText = parseInt(nicNumber.substr(2, 3));
      } else {
        year = nicNumber.substr(0, 4);
        dayText = parseInt(nicNumber.substr(4, 3));
      }

      if (dayText > 500) {
        gender = "Female";
        dayText = dayText - 500;
      } else {
        gender = "Male";
      }

      //Month
      if (dayText > 335) {
        day = dayText - 335;
        month = "December";
      } else if (dayText > 305) {
        day = dayText - 305;
        month = "November";
      } else if (dayText > 274) {
        day = dayText - 274;
        month = "October";
      } else if (dayText > 244) {
        day = dayText - 244;
        month = "September";
      } else if (dayText > 213) {
        day = dayText - 213;
        month = "Auguest";
      } else if (dayText > 182) {
        day = dayText - 182;
        month = "July";
      } else if (dayText > 152) {
        day = dayText - 152;
        month = "June";
      } else if (dayText > 121) {
        day = dayText - 121;
        month = "May";
      } else if (dayText > 91) {
        day = dayText - 91;
        month = "April";
      } else if (dayText > 60) {
        day = dayText - 60;
        month = "March";
      } else if (dayText < 32) {
        month = "January";
        day = dayText;
      } else if (dayText > 31) {
        day = dayText - 31;
        month = "Febuary";
      }

      this.FV.setValue("dateOfBirth", new Date(year + "-" + month + "-" + day));

      let age = this.calculateAge(year + "-" + month + "-" + day);

      this.FV.setValue("age", age);
      let selectedGender = this.genderArr.find(
        (x) => x.id === (gender == "Female" ? 2 : 1)
      );
      this.FV.setValue("gender", selectedGender);
    }

    // if (
    //   nicNumber.length === 10 &&
    //   (nicNumber.charAt(9) === "V" || nicNumber.charAt(9) === "X") &&
    //   !isNaN(Number(...nicNumber.slice(0, 9)))
    // ) {
    //   debugger;
    //   let year = Number(nicNumber.slice(0, 2));
    //   let days = Number(nicNumber.slice(2, 5));

    //   year = year > 0 && year < 22 ? 2000 + year : 1900 + year;

    //   let gender = days > 500 ? 2 : 1;
    //   if (days > 500) {
    //     days -= 500;
    //   }

    //   let dob = this.getBirthDate(year, days);
    //   let age = this.calculateAge(dob);

    //   this.FV.setValue("dateOfBirth", new Date(dob));
    //   this.FV.setValue("age", age);
    //   this.FV.setValue("gender", gender);
    // } else if (nicNumber.length === 12 && !isNaN(Number(nicNumber))) {
    //   let year = Number(nicNumber.slice(0, 4));
    //   let days = Number(nicNumber.slice(4, 7));

    //   let gender = days > 500 ? 2 : 1;
    //   if (days > 500) {
    //     days -= 500;
    //   }

    //   let dob = this.getBirthDate(year, days);
    //   let age = this.calculateAge(dob);

    //   let selectedGender = this.genderArr.find((x) => x.id === gender);

    //   this.FV.setValue("dateOfBirth", new Date(dob));
    //   this.FV.setValue("age", age);
    //   this.FV.setValue("gender", selectedGender);
    // }
  }

  getBirthDate(year: number, days: number): string {
    let date = new Date(year, 0, days);
    return this.datePipe.transform(date, "yyyy-MM-dd");
  }

  calculateAge(dob: string): number {
    let birthDate = new Date(dob);
    let today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    let monthDiff = today.getMonth() - birthDate.getMonth();
    let dayDiff = today.getDate() - birthDate.getDate();

    // Adjust age if birthday has not occurred this year yet
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    return age;
  }

  // Address functions
  addNewAddress() {
    let validateParam = "addressType,line1,line2,line3";

    if (this.FV.validateControllers(validateParam)) {
      return;
    }

    if (this.addressRecodes.length >= 3) {
      this.messageService.showWarnAlert("You can add only 3 addresses!");
      this.clearAddressData();
      return;
    }

    let addressType = this.FV.getValue("addressType");
    let line1 = this.FV.getValue("line1") ?? "";
    let line2 = this.FV.getValue("line2") ?? "";
    let line3 = this.FV.getValue("line3") ?? "";

    let selectedType = this.addressTypeArr.find((x) => x.id === addressType);

    this.addressRecodes.push({
      _id: this.helper.generateUniqueId(this.addressRecodes),
      addressTypeId: addressType,
      addressType: selectedType.name,
      line1: line1.trim(),
      line2: line2.trim(),
      line3: line3.trim(),
    });

    this.clearAddressData();
  }

  clearAddressData() {
    this.FV.clearValues("addressType,line1,line2,line3");
  }

  deleteAddress(rowData: any) {
    let confirmationConfig = {
      message: `Are you sure you want to delete this address?`,
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
    };

    this.messageService.ConfirmPopUp(
      confirmationConfig,
      (isConfirm: boolean) => {
        if (isConfirm) {
          this.addressRecodes = this.addressRecodes.filter(
            (x) => x._id !== rowData._id
          );
        }
      }
    );
  }

  validateNicOrDrivingLicenseImage() {
    if (!this.profileImageUrl) {
      this.messageService.showWarnAlert(
        "Profile image is required, Please upload profile image!"
      );
      return true;
    }

    if (!this.drivingLicenseImageUrl && !this.nicImageUrl) {
      this.messageService.showWarnAlert(
        "Please upload driving license image or nic image to continue!"
      );
      return true;
    }

    return false;
  }
}
