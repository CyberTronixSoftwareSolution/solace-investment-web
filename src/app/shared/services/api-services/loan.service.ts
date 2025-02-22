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

  GetAllLoans(status: number) {
    return this.dataAccess
      .GET(this.resource.loan.getAllLoans + `?status=${status}`)
      .pipe((response) => {
        return response;
      });
  }

  DeleteLoanByHeader(id: string) {
    return this.dataAccess
      .DELETE(this.resource.loan.delete + `/${id}`)
      .pipe((response) => {
        return response;
      });
  }

  GetLoanDetailsByHeader(headerId: string) {
    return this.dataAccess
      .GET(this.resource.loan.getLoanDetailsByHeader + `/${headerId}`)
      .pipe((response) => {
        return response;
      });
  }

  GetLoanById(id: string) {
    return this.dataAccess
      .GET(this.resource.loan.getLoanById + `/${id}`)
      .pipe((response) => {
        return response;
      });
  }

  HandOverLoan(id: string, body: any) {
    return this.dataAccess
      .PUT(this.resource.loan.handOverLoan + `/${id}`, body)
      .pipe((response) => {
        return response;
      });
  }

  SearchReceiptBulk(body: any) {
    return this.dataAccess
      .POST(this.resource.loan.searchReceiptBulk, body)
      .pipe((response) => {
        return response;
      });
  }

  SearchReceipts(body: any) {
    return this.dataAccess
      .POST(this.resource.loan.searchReceipt, body)
      .pipe((response) => {
        return response;
      });
  }
  PayLoanInstallment(loanDetailId: string, body: any) {
    return this.dataAccess
      .PUT(this.resource.loan.payLoanInstallment + `/${loanDetailId}`, body)
      .pipe((response) => {
        return response;
      });
  }

  GetPrintReceiptData(loanDetailId: string) {
    return this.dataAccess
      .GET(this.resource.loan.printReceipt + `/${loanDetailId}`)
      .pipe((response) => {
        return response;
      });
  }
}
