import { AppState } from "src/app/store/app.state";

export const selectNotifications = (state: AppState) => state.notifications;

export const selectNotificationCount = (state: AppState) =>
  state.notifications.length || 0;
