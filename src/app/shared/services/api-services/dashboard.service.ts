import { Injectable } from "@angular/core";
import { ResourceService } from "../resource.service";
import { DataAccessService } from "../data-access.service";

@Injectable({
  providedIn: "root",
})
export class DashboardService {
  constructor(
    private dataAccess: DataAccessService,
    private resource: ResourceService
  ) {}

  GetDashboardStatistic() {
    return this.dataAccess
      .GET(this.resource.dashboard.getStatistic)
      .pipe((response) => {
        return response;
      });
  }

  GetCollectionSummary() {
    return this.dataAccess
      .GET(this.resource.dashboard.getCollectionSummary)
      .pipe((response) => {
        return response;
      });
  }
}
