import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AppModule } from "src/app/shared/enums/app-module.enum";
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
  constructor(
    private router: Router,
    private masterDataService: MasterDataService
  ) {}

  ngOnInit() {
    this.moduleIds = this.masterDataService.MenuList;

    let module = this.router.url.split("/")[1];

    this.DynamicItems = [
      {
        menuId: 1,
        label: "Dashboard",
        icon: "pi pi-home",
        routerLink: "/dashboard",
        isVisible: this.checkUserAuthorizedToAccess([AppModule.Dashboard]),
      },
      {
        menuId: 2,
        label: "User",
        icon: "pi pi-user",
        routerLink: "/user",
        isVisible: this.checkUserAuthorizedToAccess([AppModule.UserManagement]),
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
      if (element.label.toLowerCase().replace(/\s+/g, "-") == routeModule) {
        this.activeTab = element.menuId;
      }
    });
  }
}
