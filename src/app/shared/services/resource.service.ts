import { Injectable } from "@angular/core";
import { get } from "jquery";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ResourceService {
  constructor() {}

  private host: string = environment.apiURL + "/api/v1";

  private Auth = this.host + "/auth";
  private Store = this.host + "/store";
  private User = this.host + "/user";
  private Common = this.host + "/common";
  private Product = this.host + "/product";
  private Loan = this.host + "/loan";
  private Report = this.host + "/report";

  auth = {
    login: this.Auth + "/login",
    resetPassword: this.Auth + "/resetPassword",
    changePassword: this.Auth + "/changePassword",
    refreshAuth: this.Auth + "/refreshAuth",
  };

  store = {
    uploadFile: this.Store + "/upload",
    uploadMultipleFiles: this.Store + "/uploadMultiple",
  };

  user = {
    validateUser: this.User + "/validateUser/data",
    saveUser: this.User,
    getAllUsers: this.User,
    getUserById: this.User,
    blockUser: this.User + "/blacklist",
    unblockUser: this.User + "/whitelist",
    updateUser: this.User + "/update",
    deleteUser: this.User + "/delete",
    userProfile: this.User + "/profile",
    searchByParam: this.User + "/searchByParam",
  };

  common = {
    getDataByType: this.Common + "/data",
    getGenders: this.Common + "/gender",
  };

  product = {
    saveProduct: this.Product,
    updateProduct: this.Product + "/update",
    deleteProduct: this.Product + "/delete",
    getAllProducts: this.Product,
    activeInactiveProduct: this.Product + "/activeInactive",
    getProductById: this.Product,
  };

  loan = {
    saveLoan: this.Loan,
    getLoanCode: this.Loan + "/getLoanCode",
    getAllLoans: this.Loan,
    delete: this.Loan + "/delete",
    getLoanDetailsByHeader: this.Loan + "/getLoanDetails",
    getLoanById: this.Loan,
    handOverLoan: this.Loan + "/handOverLoan",
    searchReceiptBulk: this.Loan + "/searchReceiptBulk",
    searchReceipt: this.Loan + "/searchReceipt",
    payLoanInstallment: this.Loan + "/payInstallment",
    printReceipt: this.Loan + "/printReceipt",
    shiftInstallment: this.Loan + "/shiftInstallment",
  };

  report = {
    repaymentReport: this.Report + "/repaymentReport",
    deductionChargeReport: this.Report + "/deductionChargeReport  ",
  };
}
