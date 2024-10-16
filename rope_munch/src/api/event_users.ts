import {ErrorMessage, GetAPI, PostAPI, PostAPIWithoutContent, ResponseToClass} from "./api";

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
  "new_slot": number;
  "state": EventUserState;
  "guests": number;
  "name": string | undefined;
  "fetlife_name": string | undefined;
  "role_factor": number | undefined;
  "open": boolean | undefined;
  "attended": boolean | undefined;
}

export const GetEventUser = (
  event_id: number,
  user_id: number,
  setEventUser: (user: EventUser | "not_registered") => void,
) => {
  GetAPI("/event/" + event_id + "/users/" + user_id, (response: Response) => {
    if (!response.ok) {
      setEventUser("not_registered")
    } else {
      ResponseToClass(response, setEventUser, () => {
        console.log("Classes did not match!!! This should never happen");
      });
    }
  });
}

export class EventUserLists {
  "registered": EventUser[];
  "new": EventUser[];
  "waiting": EventUser[];
}

export const GetEventUsers = (
  event_id: number,
  setEventUsers: (users: EventUserLists | undefined) => void,
) => {
  GetAPI("/event/" + event_id + "/users", (response: Response) => {
    if (!response.ok) {
      setEventUsers(undefined)
    } else {
      ResponseToClass(response, setEventUsers, () => {
        console.log("Classes did not match!!! This should never happen");
      });
    }
  });
}

export const GetEventUsersAdmin = (
  event_id: number,
  setEventUsers: (users: EventUserLists | undefined) => void,
) => {
  GetAPI("/event/" + event_id + "/users/admin", (response: Response) => {
    if (!response.ok) {
      setEventUsers(undefined)
    } else {
      ResponseToClass(response, setEventUsers, () => {
        console.log("Classes did not match!!! This should never happen");
      });
    }
  });
}

export const GetEventUsersCheckAttention = (
  event_id: number,
  setEventUsers: (users: EventUser[]) => void,
) => {
  GetAPI("/event/" + event_id + "/users/check_attended", (response: Response) => {
    if (!response.ok) {
      setEventUsers([])
    } else {
      ResponseToClass(response, setEventUsers, () => {
        console.log("Classes did not match!!! This should never happen");
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
  PostAPI<number>("/event/" + event_id + "/register/" + user_id, guests, (response) => {
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
  PostAPIWithoutContent("/event/" + event_id + "/unregister/" + user_id, (response) => {
    if (!response.ok) {
      ResponseToClass(response, (message: ErrorMessage) => {
        console.log("Unregister event error: " + message.message);
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
  PostAPI<number>("/event/" + event_id + "/change_guests/" + user_id, guests, (response) => {
    if (!response.ok) {
      ResponseToClass(response, (message: ErrorMessage) => {
        console.log("Change Guests error: " + message.message);
      }, () => {
        console.log("No error message!!! This should never happen");
      });
    }

    onDone();
  });
}

export const SetAttendedForEvent = (
  event_id: number,
  user_id: number,
  attended: boolean,
  onDone: () => void,
) => {
  PostAPI<boolean>("/event/" + event_id + "/attended/" + user_id, attended, (response) => {
    if (!response.ok) {
      ResponseToClass(response, (message: ErrorMessage) => {
        console.log("Set Attended error: " + message.message);
      }, () => {
        console.log("No error message!!! This should never happen");
      });
    }

    onDone();
  });
}