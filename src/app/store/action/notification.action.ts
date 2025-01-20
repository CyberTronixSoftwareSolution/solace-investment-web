import { createAction, props } from "@ngrx/store";

const initiallySetState = createAction(
  "[Notification] Initially Set State",
  props<{ notifications: any[] }>()
);

const addNotification = createAction(
  "[Notification] Add Notification",
  props<{ notification: any }>()
);

const removeNotification = createAction(
  "[Notification] Remove Notification",
  props<{ notification: any }>()
);

export { initiallySetState, addNotification, removeNotification };
