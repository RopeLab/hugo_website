import {ErrorMessage, GetAPIAndParse, PostAPI, ResponseToClass} from "./api";

export class RopeEvent {
  "id": number | undefined;
  "visible_date": Date;
  "register_deadline": Date;
  "date": Date;
  "archive_date": Date;
  "slots": number;
  "new_slots": number;
  "visible": boolean;
  "archive": boolean;
  "custom_workshop": string;
  "workshop_file": string;
}

export class RopeEventFromAPI {
  "id": number | undefined;
  "visible_date": string;
  "register_deadline": string;
  "date": string;
  "archive_date": string;
  "slots": number;
  "new_slots": number;
  "visible": boolean;
  "archive": boolean;
  "custom_workshop": string;
  "workshop_file": string;
}

// Remove the Z when converting date to json
// eslint-disable-next-line no-extend-native
Date.prototype.toJSON = function(){
  return new Date(this.getTime() - (this.getTimezoneOffset() * 60000)).toISOString().slice(0, -1);
};

export const PostEvent = (
  event: RopeEvent,
  onDone?: () => void
) => {
  PostAPI<RopeEvent>("/event", event, (response) => {
    if (!response.ok) {
      ResponseToClass(response, (message: ErrorMessage) => {
        console.log("Post event error: " + message.message);
      }, () => {
        console.log("No error message!!! This should never happen");
      });
    }

    if (onDone) {
      onDone()
    }
  });
}

export const UpdateEvent = (
  event: RopeEvent,
  onDone?: () => void
) => {
  PostAPI<RopeEvent>("/event/" + event.id! , event, (response) => {
    if (!response.ok) {
      ResponseToClass(response, (message: ErrorMessage) => {
        console.log("Post event error: " + message.message);
      }, () => {
        console.log("No error message!!! This should never happen");
      });
    }

    if (onDone) {
      onDone()
    }
  });
}

export const DeleteEvent = (
  event: RopeEvent,
  onDone?: () => void
) => {
  PostAPI<RopeEvent>("/event/" + event.id! + "/delete" , event, (response) => {
    if (!response.ok) {
      ResponseToClass(response, (message: ErrorMessage) => {
        console.log("Post event error: " + message.message);
      }, () => {
        console.log("No error message!!! This should never happen");
      });
    }

    if (onDone) {
      onDone()
    }
  });
}

const parseEvent = (event: RopeEventFromAPI) => {
  const parsedEvent: RopeEvent = {
    ...event,
    date: new Date(event.date),
    visible_date: new Date(event.visible_date),
    archive_date: new Date(event.archive_date),
    register_deadline: new Date(event.register_deadline),
  }

  return parsedEvent;
}

export const GetEvent = (
  eventId: number,
  setEvent: (event: RopeEvent) => void,
) => {
  GetAPIAndParse("/event/" + eventId, (event: RopeEventFromAPI) => {
    setEvent(parseEvent(event))
  });
}

export const GetEvents = (
    setEvents: (events: RopeEvent[]) => void,
) => {
  GetAPIAndParse("/event/all", (events: RopeEventFromAPI[]) => {
    setEvents(events.map(parseEvent));
  });
}

export const GetGermanDateTime = (date: Date) => {
  return date.getDate() + "." + (date.getMonth() + 1) + ".'" + (date.getFullYear() - 2000) + " - " + date.getHours() + ":" + date.getMinutes()
}

export const GetGermanDate = (date: Date) => {
  return date.getDate() + "." + (date.getMonth() + 1) + ".'" + (date.getFullYear() - 2000)
}

export const GetGermanTime = (date: Date) => {
  return date.getHours() + ":" + date.getMinutes()
}