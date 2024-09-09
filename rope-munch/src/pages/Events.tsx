import React, {useEffect, useRef, useState} from "react";
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { DataScroller } from 'primereact/datascroller';
import {GetEvents, RopeEvent} from "../api/events";
import {EventUser, GetEventUsers} from "../api/event_users";
import {
  EventUserGuests,
  EventUserName,
  EventUserOpen,
  EventUserRole,
  EventUserState
} from "../components/EventUserViews";

export const Events = ({userId}: {userId: number | undefined}) => {

  const toast = useRef<Toast>(null);

  const [events, setEvents] = useState<RopeEvent[]>([]);
  const [currentEvent, setCurrentEvents] = useState<RopeEvent | undefined>(undefined);

  useEffect(() => {
    GetEvents(setEvents)
  }, [])


  return <div className='flex flex-column align-items-center'>
    <Toast ref={toast}/>

    <div>
      <div className='flex align-items-center'>


        <label className='font-bold text-xl mx-2 text-200'>Datum: </label>
        <Dropdown
          value={currentEvent}
          onChange={(e) => setCurrentEvents(e.value)}
          options={events}
          optionLabel="date"
          placeholder="Wähle ein Event"
          scrollHeight="full"
          className="max-w-12rem sm:w-full"/>
      </div>

      {currentEvent && userId &&
        <MemberList event={currentEvent} self_user_id={userId}/>

      }


    </div>
  </div>
}

const MemberList = ({event, self_user_id}: {event: RopeEvent, self_user_id: number}) => {
  const [users, setUsers] = useState<EventUser[]>([]);

  useEffect(() => {
    GetEventUsers(event.id!, setUsers);
  }, [event])

  const Template = (user: EventUser) => {
    return (<div className='flex justify-content-center align-items-center'>
      <EventUserState user={user} />
      <EventUserName user={user} bold={user.user_id == self_user_id}/>
      <div className='flex-grow-1'></div>
      <EventUserGuests user={user} />
      <EventUserOpen user={user} />
      <div className="w-5rem"> <EventUserRole user={user}/> </div>
    </div>)
  }

  let registerCount = users.filter((u) => u.state === "Registered").length;
  let waitCount = users.filter((u) => u.state === "Waiting").length;
  let openCount = users.filter((u) => u.open).length;

  const eventInfo = <label>
    {registerCount} / {event.slots} angemeldet ---
    {waitCount === 1 && waitCount + " wartet --- "}
    {waitCount > 1 && waitCount + " warten --- "}
    Offen mit neuen Personen zu fesseln: {openCount} / {registerCount}
  </label>

  return (<DataScroller
    value={users}
    itemTemplate={Template}
    rows={100}
    buffer={0.4}
    header={eventInfo}
    className="mx-2"/>)
}