import {GetAPIAndParse} from "./api";
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
  GetAPIAndParse("/user_action/" + userId + "/all", setUserActions);
}
