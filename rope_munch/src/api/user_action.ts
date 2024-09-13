import {ErrorMessage, GetAPI, ResponseToClass} from "./api";
export enum EventUserAction {
  Register,
  Unregister,
  GetSlot,
  Rejected,
  ChangeGuests,
}
export class UserAction {
  "user_id": number
  "event_id": string
  "date": Date
  "action": EventUserAction
  "in_waiting": boolean
  "in_new": boolean
  "guests": number
}

export const GetUserActions = (
  userId: number,
  setUserActions: (actions: UserAction[]) => void,
) => {
  GetAPI("/user_action/" + userId + "/all", (response) => {
    if (!response.ok) {
      ResponseToClass(response, (message: ErrorMessage) => {
        console.log("Get user action error: " + message.message);
      }, () => {
        console.log("No error message!!! This should never happen");
      });
    } else {
      ResponseToClass(response, setUserActions, () => {
        console.log("UserAction Array did not match!!! This should never happen");
      });
    }
  });
}
