import {GetAPIAndParse} from "./api.ts";

export class RopeEventDate {
  "id": number;
  "date": Date;
}

export class RopeEventDateFromAPI {
  "id": number;
  "date": string;
}

export class PublicRopeEvent {
  "slots": number;
  "register_count": number;
  "wait_count": number;
  "description": string
}

export class LoggedInRopeEvent {
  "slots": number;
  "register_count": number;
  "wait_count": number;
  "open_count": number;
  "description": string
}

const parseEventDate = (event: RopeEventDateFromAPI) => {
  const parsedEvent: RopeEventDate = {
    ...event,
    date: new Date(event.date),
  }

  return parsedEvent;
}

export const GetEventDates = (
  setEventDates: (event: RopeEventDate[]) => void,
) => {
  GetAPIAndParse("/event/dates",(datas: RopeEventDateFromAPI[]) => {
    setEventDates(datas.map(parseEventDate));
  });
}

export const GetPublicEvent = (
  id: number,
  setEvent: (event: PublicRopeEvent) => void,
) => {
  GetAPIAndParse("/event/" + id + "/public_data", setEvent)
}

export const GetLoggedInEvent = (
  id: number,
  setEvent: (event: LoggedInRopeEvent) => void,
) => {
  GetAPIAndParse("/event/" + id + "/logged_in_data", setEvent)
}

