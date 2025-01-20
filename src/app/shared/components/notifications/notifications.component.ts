import { Component } from "@angular/core";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/store/app.state";
import { selectNotifications } from "src/app/store/selector/notification.selector";
import { PopupService } from "../../services/popup.service";
import { AppMessageService } from "../../services/app-message.service";

@Component({
  selector: "app-notifications",
  templateUrl: "./notifications.component.html",
  styleUrls: ["./notifications.component.scss"],
})
export class NotificationsComponent {
  notifications: any[] = [];
  // private timerSubscription!: Subscription;

  constructor(
    private store: Store<AppState>,
    private popupService: PopupService,
    private messageService: AppMessageService
  ) {}

  ngOnInit(): void {
    this.store.select(selectNotifications).subscribe((notifications: any) => {
      this.notifications = notifications;
    });
  }
}
