import { Injectable } from "@angular/core";
import { ResourceService } from "../resource.service";
import { DataAccessService } from "../data-access.service";

@Injectable({
  providedIn: "root",
})
export class UserService {
  constructor(
    private dataAccess: DataAccessService,
    private resource: ResourceService
  ) {}

  checkUserDataExist(role: number, userId: string, email: string, nic: string) {
    return this.dataAccess
      .GET(
        this.resource.user.validateUser +
          `?role=${role}&id=${userId}&email=${email}&nic=${nic}`
      )
      .pipe((response) => {
        return response;
      });
  }

  saveUser(body: any) {
    return this.dataAccess
      .POST(this.resource.user.saveUser, body)
      .pipe((response) => {
        return response;
      });
  }

  getAllUsers() {
    return this.dataAccess
      .GET(this.resource.user.getAllUsers)
      .pipe((response) => {
        return response;
      });
  }

  getUserById(userId: string) {
    return this.dataAccess
      .GET(this.resource.user.getUserById + `/${userId}`)
      .pipe((response) => {
        return response;
      });
  }

  blockUserById(userId: string) {
    return this.dataAccess
      .PUT(this.resource.user.blockUser + `/${userId}`, null)
      .pipe((response) => {
        return response;
      });
  }

  unblockUserById(userId: string) {
    return this.dataAccess
      .PUT(this.resource.user.unblockUser + `/${userId}`, null)
      .pipe((response) => {
        return response;
      });
  }

  updateUserDetails(userId: string, body: any) {
    return this.dataAccess
      .PUT(this.resource.user.updateUser + `/${userId}`, body)
      .pipe((response) => {
        return response;
      });
  }

  deleteUserByUserId(userId: string) {
    return this.dataAccess
      .DELETE(this.resource.user.deleteUser + `/${userId}`)
      .pipe((response) => {
        return response;
      });
  }

  GetUserProfile() {
    return this.dataAccess
      .GET(this.resource.user.userProfile)
      .pipe((response) => {
        return response;
      });
  }
}
