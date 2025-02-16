import { Injectable } from "@angular/core";
import { ResourceService } from "../resource.service";
import { DataAccessService } from "../data-access.service";

@Injectable({
  providedIn: "root",
})
export class LoanService {
  constructor(
    private dataAccess: DataAccessService,
    private resource: ResourceService
  ) {}

  SaveLoan(body: any) {
    return this.dataAccess
      .POST(this.resource.loan.saveLoan, body)
      .pipe((response) => {
        return response;
      });
  }

  GetLoanCode() {
    return this.dataAccess
      .GET(this.resource.loan.getLoanCode)
      .pipe((response) => {
        return response;
      });
  }
}
