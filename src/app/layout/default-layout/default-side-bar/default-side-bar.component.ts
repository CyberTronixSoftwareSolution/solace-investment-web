import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-default-side-bar",
  templateUrl: "./default-side-bar.component.html",
  styleUrls: ["./default-side-bar.component.css"],
})
export class DefaultSideBarComponent implements OnInit {
  DynamicItems: any[] = [];
  activeTab: number = -1;
  constructor(private router: Router) {}

  ngOnInit() {
    let module = this.router.url.split("/")[1];

    this.DynamicItems = [
      {
        menuId: 1,
        label: "Dashboard",
        icon: "pi pi-home",
        routerLink: "/dashboard",
        isVisible: true,
      },
      {
        menuId: 2,
        label: "User",
        icon: "pi pi-user",
        routerLink: "/user",
        isVisible: true,
      },
    ];

    this.ModuleActivate(module);
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
