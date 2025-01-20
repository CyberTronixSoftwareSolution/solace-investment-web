import { createReducer, on } from "@ngrx/store";
import { AppState } from "../app.state";
import {
  addNotification,
  initiallySetState,
  removeNotification,
} from "../action/notification.action";

const initialNotifications: any[] = [];

export const notificationReducer = createReducer(
  initialNotifications,

  on(initiallySetState, (_, props) => props.notifications),

  on(addNotification, (state, props) => [props.notification, ...state]),

  on(removeNotification, (state, props) =>
    state.filter(
      (x) =>
        x._id !== props.notification._id && x.type !== props.notification.type
    )
  )
);

// export const notificationReducer = createReducer(
//   initialNotifications,

//   on(initiallySetState, (state: AppState, props) => {
//     return {
//       ...state,
//       notifications: props.notifications,
//     };
//   }),

//   on(addNotification, (state: AppState, props) => {
//     return {
//       ...state,
//       notifications: [props.notification, ...state.notifications],
//     };
//   }),

//   on(removeNotification, (state: AppState, props) => {
//     return {
//       ...state,
//       notifications: state.notifications.filter(
//         (x) =>
//           x._id !== props.notification._id && x.type !== props.notification.type
//       ),
//     };
//   })
// );
