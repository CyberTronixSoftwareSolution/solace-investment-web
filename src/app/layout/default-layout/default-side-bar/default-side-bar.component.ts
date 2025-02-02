import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AppModule } from "src/app/shared/enums/app-module.enum";
import { WellKnownUserRole } from "src/app/shared/enums/well-known-user-role.enum";
import { AppMessageService } from "src/app/shared/services/app-message.service";
import { MasterDataService } from "src/app/shared/services/master-data.service";

@Component({
  selector: "app-default-side-bar",
  templateUrl: "./default-side-bar.component.html",
  styleUrls: ["./default-side-bar.component.css"],
})
export class DefaultSideBarComponent implements OnInit {
  DynamicItems: any[] = [];
  activeTab: number = -1;
  moduleIds: number[] = [];
  logInUser: any;
  constructor(
    private router: Router,
    private masterDataService: MasterDataService,
    private messageService: AppMessageService
  ) {}

  ngOnInit() {
    this.moduleIds = this.masterDataService.MenuList;
    this.logInUser = this.masterDataService.User;
    let role = this.masterDataService.Role;
    let module = this.router.url.split("/")[1];

    this.DynamicItems = [
      {
        menuId: 1,
        label: "Dashboard",
        labelForRoute: "Dashboard",
        icon: "pi pi-gauge",
        routerLink: "/dashboard",
        isVisible: this.checkUserAuthorizedToAccess([AppModule.Dashboard]),
        isSumMenu: false,
      },
      {
        menuId: 2,
        label:
          role == WellKnownUserRole.SUPERADMIN
            ? "User Management"
            : "Customer Management",
        labelForRoute: "User",
        icon: "pi pi-users",
        routerLink: "/user",
        isVisible: this.checkUserAuthorizedToAccess([AppModule.UserManagement]),
        isSumMenu: false,
      },

      {
        menuId: 3,
        label: "Loan Management",
        labelForRoute: "Loan",
        icon: "pi pi-money-bill",
        routerLink: "/user",
        isVisible: true,
        isSumMenu: false,
      },
      {
        menuId: 4,
        label: "Payment Management",
        labelForRoute: "Payment",
        icon: "pi pi-wallet",
        routerLink: "/user",
        isVisible: true,
        isSumMenu: false,
      },

      {
        menuId: 5,
        label: "Payroll",
        labelForRoute: "Payroll",
        icon: "pi pi-receipt",
        routerLink: "/user",
        isVisible: true,
        isSumMenu: false,
      },
      {
        menuId: 6,
        label: "Reports",
        labelForRoute: "report",
        icon: "pi pi-file-o",
        routerLink: "/user",
        isVisible: true,
        isSumMenu: false,
      },
      {
        menuId: 7,
        label: "System Configuration",
        labelForRoute: "report",
        icon: "pi pi-cog",
        routerLink: "/user",
        isVisible: true,
        isSumMenu: true,
        subMenu: [
          {
            menuId: 61,
            label: "User Management",
            labelForRoute: "User",
            icon: "pi pi-users",
            routerLink: "/user",
            isVisible: true,
            isSumMenu: false,
          },
          {
            menuId: 62,
            label: "Role Management",
            labelForRoute: "Role",
            icon: "pi pi-users",
            routerLink: "/user",
            isVisible: true,
            isSumMenu: false,
          },
        ],
      },
    ];

    this.ModuleActivate(module);
  }

  checkUserAuthorizedToAccess(moduleIds: number[]): boolean {
    let flag: boolean = false;

    moduleIds.forEach((element) => {
      if (this.moduleIds.includes(element)) {
        flag = true;
      }
    });
    return flag;
  }

  moveToRouter(routerLink: string) {
    debugger;
    this.router.navigate([routerLink]);
  }

  ModuleActivate(routeModule: any) {
    this.DynamicItems.forEach((element: any) => {
      if (
        element.labelForRoute.toLowerCase().replace(/\s+/g, "-") == routeModule
      ) {
        this.activeTab = element.menuId;
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

  onClickProfile() {
    this.router.navigate(["/user/profile"]);
  }
}
