import { AppMessageService } from "src/app/shared/services/app-message.service";
import { UserService } from "./../../../shared/services/api-services/user.service";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ChangePasswordComponent } from "../change-password/change-password.component";
import { PopupService } from "src/app/shared/services/popup.service";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"],
})
export class ProfileComponent implements OnInit {
  userDetails: any;
  constructor(
    private userService: UserService,
    private messageService: AppMessageService,
    private router: Router,
    private popupService: PopupService
  ) {}

  ngOnInit() {
    this.getUserProfile();
  }

  getUserProfile() {
    this.userService.GetUserProfile().subscribe((response) => {
      if (response.IsSuccessful) {
        this.userDetails = response.Result;
      }
    });
  }

  onClickLogout() {
    let confirmationConfig = {
      message: "Are you sure you want to logout?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
    };

    this.messageService.ConfirmPopUp(
      confirmationConfig,
      (isConfirm: boolean) => {
        if (isConfirm) {
          this.router.navigate(["/login"]);
        }
      }
    );
  }

  onChangePassword() {
    this.popupService
      .OpenModel(ChangePasswordComponent, {
        header: "CHANGE PASSWORD",
        width: "30vw",
      })
      .subscribe((res) => {});
  }
}
