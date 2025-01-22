import { firstValueFrom, Subscription } from "rxjs";
import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { SidebarService } from "src/app/shared/services/sidebar.service";
import { NotificationsComponent } from "../../shared/components/notifications/notifications.component";
import { MasterDataService } from "src/app/shared/services/master-data.service";
import { AppModule } from "src/app/shared/enums/app-module.enum";
import { AppMessageService } from "src/app/shared/services/app-message.service";
import { DatePipe } from "@angular/common";
import { PopupService } from "src/app/shared/services/popup.service";
import { ChangePasswordComponent } from "src/app/modules/user/change-password/change-password.component";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/store/app.state";
import {
  addNotification,
  initiallySetState,
  removeNotification,
} from "src/app/store/action/notification.action";
import { selectNotificationCount } from "src/app/store/selector/notification.selector";

@Component({
  selector: "app-default-layout-new",
  templateUrl: "./default-layout-new.component.html",
  styleUrls: ["./default-layout-new.component.scss"],
})
export class DefaultLayoutNewComponent {
  DynamicItems: any[] = [];
  activeTab: number = -1;
  moduleIds: number[] = [];
  workingDate: string = "";
  showWorkingDate: string = "";
  items: any[];
  notificationCount: number = 0;
  private subscriptions: Subscription[] = [];
  constructor(
    private router: Router,
    private sidebarService: SidebarService,
    private masterDataService: MasterDataService,
    private messageService: AppMessageService,
    private datePipe: DatePipe,
    private popupService: PopupService,
    private store: Store<AppState> // private webSocketService: WebSocketService
  ) {}

  ngOnInit(): void {
    this.showWorkingDate = this.datePipe.transform(
      this.workingDate,
      "y - MMMM"
    );
    this.moduleIds = this.masterDataService.MenuList;
    let module = this.router.url.split("/")[1];

    // this.DynamicItems = [
    //   {
    //     menuId: 1,
    //     label: "Dashboard",
    //     icon: "pi pi-home",
    //     routerLink: "/dashboard",
    //     isVisible: this.checkUserAuthorizedToAccess([
    //       AppModule.SuperAdminDashboard,
    //     ]),
    //   },
    //   {
    //     menuId: 2,
    //     label: "User",
    //     icon: "pi pi-user",
    //     routerLink: "/user",
    //     isVisible: this.checkUserAuthorizedToAccess([
    //       AppModule.SuperAdminUserManagement,
    //     ]),
    //   },
    //   {
    //     menuId: 3,
    //     label: "Leave Management",
    //     icon: "pi pi-user",
    //     routerLink: "/leave-management",
    //     isVisible: this.checkUserAuthorizedToAccess([
    //       AppModule.SuperAdminLeaveManagement,
    //       AppModule.AdminLeaveManagement,
    //       AppModule.DriverLeaveManagement,
    //     ]),
    //   },
    //   {
    //     menuId: 4,
    //     label: "Trip Management",
    //     icon: "pi pi-map",
    //     routerLink: "/trip-management",
    //     isVisible: this.checkUserAuthorizedToAccess([
    //       AppModule.AdminTripManagement,
    //       AppModule.SuperAdminTripManagement,
    //     ]),
    //   },
    //   {
    //     menuId: 5,
    //     label: "Vehicle Management",
    //     icon: "pi pi-car",
    //     routerLink: "/vehicle-management",
    //     isVisible: this.checkUserAuthorizedToAccess([
    //       AppModule.SuperAdminVehicleManagement,
    //       AppModule.AdminVehicleManagement,
    //     ]),
    //   },
    //   {
    //     menuId: 6,
    //     label: "Your Trips",
    //     icon: "pi pi-map",
    //     routerLink: "/trip-management",
    //     isVisible: this.checkUserAuthorizedToAccess([
    //       AppModule.DriverTripManagement,
    //     ]),
    //   },
    //   {
    //     menuId: 7,
    //     label: "Month Audit",
    //     icon: "pi pi-briefcase",
    //     // routerLink: "/month-audit",
    //     isVisible: this.checkUserAuthorizedToAccess([
    //       AppModule.SuperAdminMonthAudit,
    //     ]),
    //     command: (event: any) => {
    //       this.openMonthAudit();
    //     },
    //   },
    //   {
    //     menuId: 8,
    //     label: "Vehicle Tracking",
    //     icon: "pi pi-map-marker",
    //     routerLink: "/vehicle-tracking",
    //     isVisible: this.checkUserAuthorizedToAccess([
    //       AppModule.SuperAdminVehicleTracking,
    //     ]),
    //   },
    //   {
    //     menuId: 9,
    //     label: "Reports",
    //     icon: "pi pi-file",
    //     routerLink: "/reports",
    //     isVisible: this.checkUserAuthorizedToAccess([
    //       AppModule.AdminReportManagement,
    //       AppModule.SuperAdminReportManagement,
    //     ]),
    //   },
    // ];

    this.items = [
      {
        label: "Change Password",
        icon: "pi pi-file",
      },
    ];
    this.ModuleActivate(module);

    // ngrx store

    this.store.select(selectNotificationCount).subscribe((count) => {
      this.notificationCount = count;
    });
  }

  ModuleActivate(routeModule: any) {
    this.DynamicItems.forEach((element: any) => {
      if (element.label.toLowerCase().replace(/\s+/g, "-") == routeModule) {
        this.activeTab = element.menuId;
      }
    });
  }

  onClickNotification() {
    let data = {};

    let properties = {
      width: "320px",
      position: "left",
    };

    this.sidebarService.addComponent(
      "Notifications",
      NotificationsComponent,
      properties,
      data
    );
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

  onClickLogout() {
    let confirmationConfig = {
      message: "Are you sure you want to cancel this leave?",
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

  onClickSettings() {
    this.popupService
      .OpenModel(ChangePasswordComponent, {
        header: "CHANGE PASSWORD",
        width: "30vw",
      })
      .subscribe((res) => {});
  }

  openMonthAudit() {
    let today = new Date();
  }

  moveToRouter(routerLink: string) {
    this.router.navigate([routerLink]);
  }

  ngOnDestroy() {
    // Clean up all subscriptions
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
