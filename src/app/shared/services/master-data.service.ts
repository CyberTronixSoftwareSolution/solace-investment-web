import { Injectable } from "@angular/core";
import { HelperService } from "./helper.service";
@Injectable({
  providedIn: "root",
})
export class MasterDataService {
  constructor(private helper: HelperService) {}

  setUserData(loginData: any) {
    this.MenuList = loginData?.moduleIds ?? [];
    this.SessionKey = loginData.token;
    this.ClientId = loginData.user._id;
    this.Role = loginData.role;
    this.TimedOut = "false";
    this.User = loginData.user;
  }

  get TimedOut(): any {
    return localStorage.getItem(AppKeys.TimedOut) ?? "false";
  }

  set TimedOut(value: any) {
    localStorage.setItem(AppKeys.TimedOut, value);
  }

  get SessionKey(): string {
    return localStorage.getItem(AppKeys.SessionKey) ?? "";
  }

  set SessionKey(key: string) {
    localStorage.setItem(AppKeys.SessionKey, key);
  }

  get MenuList(): any {
    let menus = localStorage.getItem(AppKeys.MenuList) ?? "";
    return JSON.parse(menus);
  }

  set MenuList(key: any) {
    localStorage.setItem(AppKeys.MenuList, JSON.stringify(key));
  }

  get CurrentUserName(): any {
    return localStorage.getItem(AppKeys.CurrentUserName) ?? "";
  }

  set CurrentUserName(name: any) {
    localStorage.setItem(AppKeys.CurrentUserName, name);
  }

  get ClientId(): any {
    return localStorage.getItem(AppKeys.ClientId) ?? "";
  }

  set ClientId(id: any) {
    localStorage.setItem(AppKeys.ClientId, id);
  }

  set Role(role: any) {
    localStorage.setItem(AppKeys.Role, role);
  }

  get Role(): any {
    return localStorage.getItem(AppKeys.Role) ?? "";
  }

  set User(user: any) {
    localStorage.setItem(AppKeys.User, JSON.stringify(user));
  }

  get User(): any {
    let user = localStorage.getItem(AppKeys.User) ?? "";
    return JSON.parse(user);
  }

  clearLoginData() {
    localStorage.removeItem(AppKeys.SessionKey);
    localStorage.removeItem(AppKeys.MenuList);
    localStorage.removeItem(AppKeys.CurrentUserName);
    localStorage.removeItem(AppKeys.ClientId);
    localStorage.removeItem(AppKeys.TimedOut);
    localStorage.removeItem(AppKeys.Role);
    localStorage.removeItem(AppKeys.User);
  }
}

export class AppKeys {
  static readonly SessionKey = "SessionKey";
  static readonly MenuList = "MenuList";
  static readonly CurrentUserName = "CurrentUserName";
  static readonly ClientId = "ClientId";
  static readonly TimedOut = "TimedOut";
  static readonly Role = "Role";
  static readonly User = "User";
}
