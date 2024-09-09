import {ErrorMessage, GetAPI, PostAPI, PostAPIWithoutContent, ResponseToClass} from "./api";
import {UserData} from "./user_data";

type EventUserState = "Registered" | "Waiting" | "Rejected" | "New" | "WaitingNew";

export class EventUser {
  "user_id": number;
  "slot": number;
  "state": EventUserState;
  "guests": number;
  "name": string;
  "role_factor": number;
  "open": boolean;
}

export class RegisterUser {
  "user_id": number;
  "guests": number;
}

export const GetEventUsers = (
  event_id: number,
  setEventUsers: (users: EventUser[]) => void,
) => {
  GetAPI("/event/" + event_id + "/users", (response) => {
    if (!response.ok) {
      ResponseToClass(response, (message: ErrorMessage) => {
        console.log("Get event users error: " + message.message);
      }, () => {
        console.log("No error message!!! This should never happen");
      });
    } else {
      ResponseToClass(response, setEventUsers, () => {
        console.log("Events Users did not match!!! This should never happen");
      });
    }
  });
}

export const RegisterToEvent = (
  event_id: number,
  user_id: number,
  guests: number,
) => {
  PostAPI<RegisterUser>("/event/" + event_id + "/register", {"user_id": user_id, "guests": guests}, (response) => {
    if (!response.ok) {
      ResponseToClass(response, (message: ErrorMessage) => {
        console.log("Register event error: " + message.message);
      }, () => {
        console.log("No error message!!! This should never happen");
      });
    }
  });
}