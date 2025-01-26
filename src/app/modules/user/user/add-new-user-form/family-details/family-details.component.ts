import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { relationTypes } from "src/app/shared/data/commonData";
import { CommonForm } from "src/app/shared/services/app-common-form";
import { AppMessageService } from "src/app/shared/services/app-message.service";
import { HelperService } from "src/app/shared/services/helper.service";
import { AddUserControlFlowService } from "../add-user-control-flow.service";

@Component({
  selector: "app-family-details",
  templateUrl: "./family-details.component.html",
  styleUrls: ["./family-details.component.css"],
})
export class FamilyDetailsComponent implements OnInit {
  FV = new CommonForm();
  familyRecodes: any[] = [];
  familyCols: any[] = [];
  relationTypesArr: any[] = relationTypes;
  userDetail: any;
  isSpouseReq: boolean = false;
  isView: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private helperService: HelperService,
    private messageService: AppMessageService,
    private addUserControlFlowService: AddUserControlFlowService
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.familyCols = [
      { field: "relationship", header: "Relationship" },
      { field: "fullName", header: "Full Name" },
      { field: "nic", header: "NIC" },
    ];

    this.userDetail = this.addUserControlFlowService.getUserDetail();
    this.isView = this.addUserControlFlowService.getIsView();
    this.setValue();
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      // spouseDetails
      SFullName: [""],
      SNic: [""],
      SOccupation: [""],
      SIncome: [""],

      // familyInfos
      FiRelationship: ["", [Validators.required]],
      FiFullName: ["", [Validators.required]],
      FiNic: [
        "",
        [
          Validators.required,
          Validators.pattern(
            /^(([5,6,7,8,9]{1})([0-9]{1})([0,1,2,3,5,6,7,8]{1})([0-9]{6})([v|V|x|X]))|(([1,2]{1})([0,9]{1})([0-9]{2})([0,1,2,3,5,6,7,8]{1})([0-9]{7}))/gm
          ),
        ],
      ],
    });
  }

  setValue() {
    this.familyRecodes = this.userDetail?.familyInfos || [];

    if (this.userDetail?.spouseDetails) {
      this.FV.setValue("SFullName", this.userDetail?.spouseDetails?.fullName);
      this.FV.setValue("SNic", this.userDetail?.spouseDetails?.nic);
      this.FV.setValue(
        "SOccupation",
        this.userDetail?.spouseDetails?.occupation
      );
      this.FV.setValue("SIncome", this.userDetail?.spouseDetails?.income || 0);
    }

    if (this.isView) {
      this.FV.disableFormControlls();
    }
  }

  addNewFamilyRecord() {
    let validateParam = "FiRelationship,FiFullName,FiNic";

    if (this.FV.validateControllers(validateParam)) {
      return;
    }

    let relationship = this.FV.getValue("FiRelationship");
    let fullName = this.FV.getValue("FiFullName");
    let nic = this.FV.getValue("FiNic");

    let selectedRelation = this.relationTypesArr.find(
      (x) => x.id === relationship
    );

    this.familyRecodes.push({
      _id: this.helperService.generateUniqueId(this.familyRecodes),
      relationshipId: relationship,
      relationship: selectedRelation.name,
      fullName: fullName,
      nic: nic,
    });

    this.clearFamilyData();
  }

  ngAfterViewChecked(): void {
    this.validateSpouseData();
  }

  validateSpouseData() {
    let occupation = this.FV.getValue("SOccupation");
    let nic = this.FV.getValue("SNic");
    let fullName = this.FV.getValue("SFullName");

    if (occupation || nic || fullName) {
      this.isSpouseReq = true;
      this.FV.formGroup.get("SFullName").setValidators([Validators.required]);
      this.FV.formGroup
        .get("SNic")
        .setValidators([
          Validators.required,
          Validators.pattern(
            /^(([5,6,7,8,9]{1})([0-9]{1})([0,1,2,3,5,6,7,8]{1})([0-9]{6})([v|V|x|X]))|(([1,2]{1})([0,9]{1})([0-9]{2})([0,1,2,3,5,6,7,8]{1})([0-9]{7}))/gm
          ),
        ]);
      this.FV.formGroup.get("SOccupation").setValidators([Validators.required]);

      this.FV.formGroup.get("SFullName").updateValueAndValidity();
      this.FV.formGroup.get("SNic").updateValueAndValidity();
      this.FV.formGroup.get("SOccupation").updateValueAndValidity();
    } else {
      this.FV.formGroup.get("SFullName").clearValidators();
      this.FV.formGroup.get("SNic").clearValidators();
      this.FV.formGroup.get("SOccupation").clearValidators();

      this.FV.formGroup.get("SFullName").updateValueAndValidity();
      this.FV.formGroup.get("SNic").updateValueAndValidity();
      this.FV.formGroup.get("SOccupation").updateValueAndValidity();

      this.isSpouseReq = false;
    }
  }

  clearFamilyData() {
    this.FV.clearValues("FiRelationship,FiFullName,FiNic");
  }

  deleteFamilyDetail(rowData: any) {
    let confirmationConfig = {
      message: `Are you sure you want to delete this family detail?`,
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
    };

    this.messageService.ConfirmPopUp(
      confirmationConfig,
      (isConfirm: boolean) => {
        if (isConfirm) {
          this.familyRecodes = this.familyRecodes.filter(
            (x) => x._id !== rowData._id
          );
        }
      }
    );
  }
}
