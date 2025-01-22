import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { CommonForm } from "src/app/shared/services/app-common-form";

@Component({
  selector: "app-family-details",
  templateUrl: "./family-details.component.html",
  styleUrls: ["./family-details.component.css"],
})
export class FamilyDetailsComponent implements OnInit {
  FV = new CommonForm();
  familyRecodes: any[] = [];
  familyCols: any[] = [];
  constructor(private formBuilder: FormBuilder) {
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
}
