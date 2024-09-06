import {ErrorMessage, GetAPI, PostAPI, ResponseToClass} from "./api";

export class RopeEvent {
  "visible_date": Date;
  "register_deadline": Date;
  "date": Date;
  "archive_date": Date;
  "slots": number;
  "visible": boolean;
  "archive": boolean;
  "description": string;
}


export const PostEvent = (
  event: RopeEvent
) => {
  PostAPI<RopeEvent>("/event", event, (response) => {
    if (!response.ok) {
      ResponseToClass(response, (message: ErrorMessage) => {
        console.log("Post event error: " + message.message);
      }, () => {
        console.log("No error message!!! This should never happen");
      });
    }
  });
}

export const GetEvent = (
  eventId: number,
  setEvent: (event: RopeEvent) => void,
) => {
  GetAPI("/event/" + eventId, (response) => {
    if (!response.ok) {
      ResponseToClass(response, (message: ErrorMessage) => {
        console.log("Get event error: " + message.message);
      }, () => {
        console.log("No error message!!! This should never happen");
      });
    } else {
      ResponseToClass(response, setEvent, () => {
        console.log("Event did not match!!! This should never happen");
      });
    }
  });
}

export const GetEvents = (
    setEvents: (events: RopeEvent[]) => void,
) => {
  GetAPI("/event/all", (response) => {
    if (!response.ok) {
      ResponseToClass(response, (message: ErrorMessage) => {
        console.log("Get event error: " + message.message);
      }, () => {
        console.log("No error message!!! This should never happen");
      });
    } else {
      ResponseToClass(response, setEvents, () => {
        console.log("Events did not match!!! This should never happen");
      });
    }
  });
}