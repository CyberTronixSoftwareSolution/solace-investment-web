import { Router } from "@angular/router";
import { MasterDataService } from "./../../../shared/services/master-data.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-default-header",
  templateUrl: "./default-header.component.html",
  styleUrls: ["./default-header.component.css"],
})
export class DefaultHeaderComponent implements OnInit {
  logInUser: any;
  constructor(
    private masterDataService: MasterDataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.logInUser = this.masterDataService.User;
  }

  onClickProfile() {
    this.router.navigate(["/user/profile"]);
  }
}
