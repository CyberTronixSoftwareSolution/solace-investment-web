import { Component, OnInit } from "@angular/core";
import { CommonForm } from "../../services/app-common-form";
import { Router } from "@angular/router";
import { FormBuilder, Validators } from "@angular/forms";
import { TransactionHandlerService } from "../../services/transaction-handler.service";
import { MasterDataService } from "../../services/master-data.service";
import { AppMessageService } from "../../services/app-message.service";
import { AppComponent } from "src/app/app.component";
import { SidebarService } from "../../services/sidebar.service";
import { ClientIpHandleService } from "../../services/client-ip-handle.service";
import { PopupService } from "../../services/popup.service";

@Component({
  selector: "app-sign-in",
  templateUrl: "./sign-in.component.html",
  styleUrls: ["./sign-in.component.css"],
})
export class SignInComponent implements OnInit {
  FV = new CommonForm();
  systemInformation: any;
  passwordType: string = "password";

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private transactionService: TransactionHandlerService,
    private masterDataService: MasterDataService,
    private messageService: AppMessageService,
    private clientIpHandle: ClientIpHandleService,
    private sidebarService: SidebarService,
    private appComponent: AppComponent,
    private popupService: PopupService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.sidebarService.closeSidebar();
    this.appComponent.sidebarVisible = false;
    this.popupService.closeOpenDialogs();
    this.masterDataService.clearLoginData();
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      email: ["", Validators.required],
      password: ["", Validators.required],
    });
  }

  handleSubmit() {
    if (this.FV.formGroup.invalid) {
      this.FV.showErrors();
      return;
    }
  }

  onLogin() {
    if (this.FV.formGroup.invalid) {
      this.FV.showErrors();
      return;
    }

    let email = this.FV.getValue("email");
    let password = this.FV.getValue("password");

    let request = {
      email: email,
      password: password,
    };

    // this.router.navigate(["/dashboard"]);

    this.transactionService.userLogin(request).subscribe((response) => {
      if (response.IsSuccessful) {
        debugger;
        this.messageService.showSuccessAlert(response.Message);
        this.masterDataService.setUserData(response.Result);
        this.router.navigate(["/dashboard"]);
      } else {
        this.messageService.showErrorAlert(response.Message);
      }
    });
  }
}
