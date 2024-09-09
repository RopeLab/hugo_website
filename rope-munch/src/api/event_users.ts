import {ErrorMessage, GetAPI, ResponseToClass} from "./api";

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

export const GetEventUsers = (
  event_id: number,
  setEventUsers: (users: EventUser[]) => void,
) => {
  GetAPI("/event/" + event_id + "/users", (response) => {
    if (!response.ok) {
      ResponseToClass(response, (message: ErrorMessage) => {
        console.log("Get event error: " + message.message);
      }, () => {
        console.log("No error message!!! This should never happen");
      });
    } else {
      ResponseToClass(response, setEventUsers, () => {
        console.log("Events did not match!!! This should never happen");
      });
    }
  });
}