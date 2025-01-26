import { Injectable } from "@angular/core";
import { WellKnownUploadType } from "src/app/shared/enums/well-known-upload-type.enum";

@Injectable({
  providedIn: "root",
})
export class AddUserControlFlowService {
  userDetail: any = {
    _id: "",
    nicNumber: "",
    titleId: "",
    title: "",
    fullName: "",
    initial: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    age: "",
    genderId: "",
    gender: "",
    civilStatusId: "",
    civilStatus: "",
    occupation: "",
    mobileNo1: "",
    mobileNo2: "",
    residenceNo: "",
    email: "",
    addresses: [],
    spouseDetails: null,
    familyInfos: [],
    expensesDetails: null,
    incomeDetails: null,
    nicImageUrl: "",
    drivingLicenseUrl: "",
    businessRegistrationUrl: "",
    profileImageUrl: "",
    bankBookUrl: "",
    bankName: "",
    bankId: "",
    branch: "",
    accountNumber: "",
    accountHolderNam: "",
    role: "",
    specialNote: "",
  };

  uploadedImages: any = {
    selectedNicImage: null,
    selectedDrivingLicenseImage: null,
    selectedBusinessRegistrationImage: null,
    selectedProfileImage: null,
    selectedBankBookImage: null,
  };

  isFirstStep: boolean = true;
  isSecondStep: boolean = false;
  isThirdStep: boolean = false;
  isFourthStep: boolean = false;

  isEdit: boolean = false;
  isView: boolean = false;
  constructor() {}

  setUserDetail(userDetail: any) {
    this.userDetail = userDetail;
  }

  getUserDetail() {
    return this.userDetail;
  }

  getUploadImage() {
    return this.uploadedImages;
  }

  setIsEdit(isEdit: boolean) {
    this.isEdit = isEdit;
  }

  getIsEdit() {
    return this.isEdit;
  }

  setIsView(isView: boolean) {
    this.isView = isView;
  }

  getIsView() {
    return this.isView;
  }
  setStepValue(step: number, value: boolean) {
    if (step === 0) {
      this.isFirstStep = value;
    } else if (step === 1) {
      this.isSecondStep = value;
    } else if (step === 2) {
      this.isThirdStep = value;
    } else if (step === 3) {
      this.isFourthStep = value;
    }
  }

  getStepValue(step: number): boolean {
    if (step === 0) {
      return this.isFirstStep;
    } else if (step === 1) {
      return this.isSecondStep;
    } else if (step === 2) {
      return this.isThirdStep;
    } else if (step === 3) {
      return this.isFourthStep;
    } else {
      return false;
    }
  }

  setUploadImage(uploadType: number, file: any, imageUrl: string) {
    switch (uploadType) {
      case WellKnownUploadType.ProfileImage:
        this.uploadedImages.selectedProfileImage = file;
        this.userDetail.profileImageUrl = imageUrl;
        break;
      case WellKnownUploadType.NICImage:
        this.uploadedImages.selectedNicImage = file;
        this.userDetail.nicImageUrl = imageUrl;
        break;
      case WellKnownUploadType.BusinessRegistration:
        this.uploadedImages.selectedBusinessRegistrationImage = file;
        this.userDetail.businessRegistrationUrl = imageUrl;
        break;
      case WellKnownUploadType.DrivingLicense:
        this.uploadedImages.selectedDrivingLicenseImage = file;
        this.userDetail.drivingLicenseUrl = imageUrl;
        break;
      case WellKnownUploadType.BankBook:
        this.uploadedImages.selectedBankBookImage = file;
        this.userDetail.bankBookUrl = imageUrl;
        break;
    }
  }

  resetData() {
    this.userDetail = {
      _id: "",
      nicNumber: "",
      titleId: "",
      title: "",
      fullName: "",
      initial: "",
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      age: "",
      genderId: "",
      gender: "",
      civilStatusId: "",
      civilStatus: "",
      occupation: "",
      mobileNo1: "",
      mobileNo2: "",
      residenceNo: "",
      email: "",
      addresses: [],
      spouseDetails: null,
      familyInfos: [],
      expensesDetails: null,
      incomeDetails: null,
      nicImageUrl: "",
      drivingLicenseUrl: "",
      businessRegistrationUrl: "",
      profileImageUrl: "",
      bankBookUrl: "",
      bankName: "",
      bankId: "",
      branch: "",
      accountNumber: "",
      accountHolderNam: "",
      role: "",
      specialNote: "",
    };

    this.uploadedImages = {
      selectedNicImage: null,
      selectedDrivingLicenseImage: null,
      selectedBusinessRegistrationImage: null,
      selectedProfileImage: null,
      selectedBankBookImage: null,
    };

    this.isFirstStep = false;
    this.isSecondStep = false;
    this.isThirdStep = false;
    this.isFourthStep = false;

    this.isEdit = false;
    this.isView = false;
  }
}
