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

  constructor(
    private formBuilder: FormBuilder,
    private addUserControlFlowService: AddUserControlFlowService,
    private datePipe: DatePipe,
    private popUpService: PopupService
  ) {
    this.createForm();
  }

  ngOnInit() {
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
      email: ["", Validators.required],
      specialNote: ["", [Validators.maxLength(500)]],

      // Address
      addressType: ["", Validators.required],
      line1: ["", Validators.required],
      line2: ["", Validators.required],
      line3: ["", Validators.required],
    });
  }

  removeImage(uploadType: number) {
    switch (uploadType) {
      case WellKnownUploadType.ProfileImage:
        this.uploadProfileImage = null;
        this.profileImageUrl = null;
        this.selectedProfileImage = null;
        // let userDetails = {
        //   ...this.userDetail,
        //   profileImageUrl: "",
        // };
        // this.addUserControlFlowService.setUserDetail(userDetails);
        break;
      case WellKnownUploadType.NICImage:
        this.uploadNicImage = null;
        this.nicImageUrl = null;
        this.selectedNicImage = null;
        // let userDetailsNIC = {
        //   ...this.userDetail,
        //   nicImageUrl: "",
        // };
        // this.addUserControlFlowService.setUserDetail(userDetailsNIC);
        break;

      case WellKnownUploadType.DrivingLicense:
        this.uploadDrivingLicenseImage = null;
        this.drivingLicenseImageUrl = null;
        this.selectedDrivingLicenseImage = null;
        // let userDetailsDL = {
        //   ...this.userDetail,
        //   drivingLicenseUrl: "",
        // };

        // this.addUserControlFlowService.setUserDetail(userDetailsDL);
        break;
      case WellKnownUploadType.BusinessRegistration:
        this.uploadBusinessRegistrationImage = null;
        this.businessRegistrationImageUrl = null;
        this.selectedBusinessRegistrationImage = null;
        // let userDetailsSLTDA = {
        //   ...this.userDetail,
        //   sltdaCertificateUrl: "",
        // };
        // this.addUserControlFlowService.setUserDetail(userDetailsSLTDA);
        break;
    }

    // this.addUserControlFlowService.setUploadImage(uploadType, null, "");
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

          // this.addUserControlFlowService.setUploadImage(
          //   uploadType,
          //   res.file,
          //   res.imageUrl
          // );
        }
      });
  }

  validateAndShowNicDetails() {
    let nicNumber = this.FV.getValue("nicNumber").trim();

    if (
      nicNumber.length === 10 &&
      (nicNumber.charAt(9) === "V" || nicNumber.charAt(9) === "X") &&
      !isNaN(Number(...nicNumber.slice(0, 9)))
    ) {
      debugger;
      let year = Number(nicNumber.slice(0, 2));
      let days = Number(nicNumber.slice(2, 5));

      year = year > 0 && year < 22 ? 2000 + year : 1900 + year;

      let gender = days > 500 ? 2 : 1;
      if (days > 500) {
        days -= 500;
      }

      let dob = this.getBirthDate(year, days);
      let age = this.calculateAge(dob);

      this.FV.setValue("dateOfBirth", new Date(dob));
      this.FV.setValue("age", age);
      this.FV.setValue("gender", gender);
    } else if (nicNumber.length === 12 && !isNaN(Number(nicNumber))) {
      let year = Number(nicNumber.slice(0, 4));
      let days = Number(nicNumber.slice(4, 7));

      let gender = days > 500 ? 2 : 1;
      if (days > 500) {
        days -= 500;
      }

      let dob = this.getBirthDate(year, days);
      let age = this.calculateAge(dob);

      this.FV.setValue("dateOfBirth", new Date(dob));
      this.FV.setValue("age", age);
      this.FV.setValue("gender", gender);
    }
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
}
