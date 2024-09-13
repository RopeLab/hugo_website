import {ErrorMessage, GetAPI, PostAPI, ResponseToClass} from "./api";

export enum EventUserState {
  Registered,
  Waiting,
  Rejected,
  New,
  WaitingNew,
}

export class EventUser {
  "user_id": number;
  "slot": number;
  "state": EventUserState;
  "guests": number;
  "name": string;
  "role_factor": number;
  "open": boolean;
}

export class UserIdAndGuests {
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
  onDone: () => void,
) => {
  PostAPI<UserIdAndGuests>("/event/" + event_id + "/register", {"user_id": user_id, "guests": guests}, (response) => {
    if (!response.ok) {
      ResponseToClass(response, (message: ErrorMessage) => {
        console.log("Register event error: " + message.message);
      }, () => {
        console.log("No error message!!! This should never happen");
      });
    }

    onDone();
  });
}

export const UnRegisterFromEvent = (
  event_id: number,
  user_id: number,
  onDone: () => void,
) => {
  PostAPI<number>("/event/" + event_id + "/unregister", user_id, (response) => {
    if (!response.ok) {
      ResponseToClass(response, (message: ErrorMessage) => {
        console.log("Register event error: " + message.message);
      }, () => {
        console.log("No error message!!! This should never happen");
      });
    }

    onDone();
  });
}

export const ChangeGuestsOfEvent = (
  event_id: number,
  user_id: number,
  guests: number,
  onDone: () => void,
) => {
  PostAPI<UserIdAndGuests>("/event/" + event_id + "/change_guests", {"user_id": user_id, "guests": guests}, (response) => {
    if (!response.ok) {
      ResponseToClass(response, (message: ErrorMessage) => {
        console.log("Register event error: " + message.message);
      }, () => {
        console.log("No error message!!! This should never happen");
      });
    }

    onDone();
  });
}