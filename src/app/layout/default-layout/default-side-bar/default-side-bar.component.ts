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
  isMainMenuId: number = -1;
  constructor(
    private router: Router,
    private masterDataService: MasterDataService,
    private messageService: AppMessageService
  ) {}

  ngOnInit() {
    this.moduleIds = this.masterDataService.MenuList;
    this.logInUser = this.masterDataService.User;
    let role = this.masterDataService.Role;

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
        icon: "pi pi-users",
        routerLink: "/user",
        isVisible: this.checkUserAuthorizedToAccess([AppModule.UserManagement]),
        isSumMenu: false,
      },

      {
        menuId: 5,
        label: "Loan Management",
        icon: "pi pi-money-bill",
        routerLink: "/loan-management",
        isVisible: true,
        isSumMenu: false,
      },
      {
        menuId: 15,
        label: "Night Audit",
        icon: "pi pi-briefcase",
        routerLink: "/report",
        isVisible: true,
        isSumMenu: false,
      },
      {
        menuId: 11,
        label: "Payment Management",
        icon: "pi pi-wallet",
        isVisible: true,
        isSumMenu: true,
        subMenu: [
          {
            menuId: 14,
            label: "Receipts Bulk",
            icon: "pi pi-tags",
            routerLink: "/payment-management/receipt-bulk",
            isVisible: true,
            isSumMenu: false,
          },
          {
            menuId: 16,
            label: "Receipts",
            icon: "pi pi-tag",
            routerLink: "/payment-management/receipts",
            isVisible: true,
            isSumMenu: false,
          },
        ],
      },

      {
        menuId: 13,
        label: "Reports",
        icon: "pi pi-file-o",
        routerLink: "/report",
        isVisible: this.checkUserAuthorizedToAccess([
          AppModule.ReportManagement,
        ]),
        isSumMenu: true,
        subMenu: [
          {
            menuId: 17,
            label: "Repayment Report",
            icon: "pi pi-file",
            routerLink: "/report/repayment-report",
            isVisible: this.checkUserAuthorizedToAccess([
              AppModule.RepaymentReport,
            ]),
            isSumMenu: false,
          },
          {
            menuId: 18,
            label: "Deduction Charges Report",
            icon: "pi pi-file",
            routerLink: "/report/deduction-charges-report",
            isVisible: this.checkUserAuthorizedToAccess([
              AppModule.DeductionChargeReport,
            ]),
            isSumMenu: false,
          },
          {
            menuId: 19,
            label: "Investment Report",
            icon: "pi pi-file",
            routerLink: "/report/investment-report",
            isVisible: this.checkUserAuthorizedToAccess([
              AppModule.InvestmentReport,
            ]),
            isSumMenu: false,
          },
          {
            menuId: 20,
            label: "Daily Manager Report",
            icon: "pi pi-file",
            routerLink: "/report/daily-manager-report",
            isVisible: this.checkUserAuthorizedToAccess([
              AppModule.DailyManagerReport,
            ]),
            isSumMenu: false,
          },
        ],
      },
      {
        menuId: 3,
        label: "System Configuration",
        icon: "pi pi-cog",
        isVisible: this.checkUserAuthorizedToAccess([
          AppModule.SystemConfiguration,
        ]),
        isSumMenu: true,
        subMenu: [
          {
            menuId: 4,
            label: "Product Management",
            icon: "pi pi-sitemap",
            routerLink: "/master-settings/product-management",
            isVisible: this.checkUserAuthorizedToAccess([
              AppModule.ProductManagement,
            ]),
            isSumMenu: false,
          },
        ],
      },
    ];

    debugger;
    this.checkUserAuthorizedToAccess([AppModule.DeductionChargeReport]);
    this.checkUserAuthorizedToAccess([AppModule.DailyManagerReport]),
      this.ModuleActivate(this.router.url);
  }

  checkUserAuthorizedToAccess(moduleIds: number[]): boolean {
    debugger;
    let flag: boolean = false;

    moduleIds.forEach((element) => {
      if (this.moduleIds.includes(element)) {
        flag = true;
      }
    });
    return flag;
  }

  moveToRouter(routerLink: string) {
    this.ModuleActivate(routerLink);
    this.router.navigate([routerLink]);
  }

  ModuleActivate(routeModule: any) {
    this.activeTab = -1;
    this.isMainMenuId = -1;
    debugger;
    this.DynamicItems.forEach((element: any) => {
      if (element?.subMenu?.length > 0) {
        element.subMenu.forEach((subElement: any) => {
          if (subElement?.routerLink.toLowerCase() == routeModule) {
            this.isMainMenuId = element.menuId;
            this.activeTab = subElement.menuId;
          }
        });
      } else {
        if (element?.routerLink.toLowerCase() == routeModule) {
          this.activeTab = element.menuId;
        }
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
