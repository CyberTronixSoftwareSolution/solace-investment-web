import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { relationTypes } from "src/app/shared/data/commonData";
import { CommonForm } from "src/app/shared/services/app-common-form";
import { AppMessageService } from "src/app/shared/services/app-message.service";
import { HelperService } from "src/app/shared/services/helper.service";

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
  constructor(
    private formBuilder: FormBuilder,
    private helperService: HelperService,
    private messageService: AppMessageService
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.familyCols = [
      { field: "relationship", header: "Relationship" },
      { field: "fullName", header: "Full Name" },
      { field: "nic", header: "NIC" },
    ];
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      // spouseDetails
      SFullName: [""],
      SNic: [
        "",
        [
          Validators.pattern(
            /^(([5,6,7,8,9]{1})([0-9]{1})([0,1,2,3,5,6,7,8]{1})([0-9]{6})([v|V|x|X]))|(([1,2]{1})([0,9]{1})([0-9]{2})([0,1,2,3,5,6,7,8]{1})([0-9]{7}))/gm
          ),
        ],
      ],
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
