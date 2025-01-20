import { ActionReducerMap } from "@ngrx/store";
import { notificationReducer } from "./reducer/notification.reducer";
import { AppState } from "./app.state";

export const reducers: ActionReducerMap<AppState> = {
  notifications: notificationReducer,
};
