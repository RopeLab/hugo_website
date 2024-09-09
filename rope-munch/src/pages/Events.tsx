import React, {RefObject, useEffect, useRef, useState} from "react";
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { DataScroller } from 'primereact/datascroller';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog'
import {GetEvents, RopeEvent} from "../api/events";
import {EventUser, GetEventUsers, RegisterToEvent} from "../api/event_users";
import {
  EventUserGuests,
  EventUserName,
  EventUserOpen,
  EventUserRole,
  EventUserState
} from "../components/EventUserViews";

export const Events = ({user_id, registerToEvent}: {user_id: number | undefined, registerToEvent: (event_id: number) => void}) => {

  const toast = useRef<Toast>(null);

  const [events, setEvents] = useState<RopeEvent[]>([]);
  const [currentEvent, setCurrentEvents] = useState<RopeEvent | undefined>(undefined);

  useEffect(() => {
    GetEvents(setEvents)
  }, [])


  return <div className='flex flex-column align-items-center'>
    <Toast ref={toast}/>

    <div>
      <div className='flex align-items-center mt-4 mb-2'>


        <label className='font-bold text-xl mx-2 text-200'>Datum: </label>
        <Dropdown
          value={currentEvent}
          onChange={(e) => setCurrentEvents(e.value)}
          options={events}
          optionLabel="date"
          placeholder="Wähle ein Event"
          scrollHeight="full"
          className="max-w-12rem sm:w-full"/>


        {currentEvent && <Register event_id={currentEvent.id!} user_id={user_id} toast={toast} registerToEvent={registerToEvent}/>}

      </div>

      {currentEvent && user_id &&
          <MemberList event={currentEvent} self_user_id={user_id}/>

      }


    </div>
  </div>
}

const MemberList = ({event, self_user_id}: { event: RopeEvent, self_user_id: number }) => {
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
    {registerCount} / {event.slots} angemeldet --- {waitCount === 1 && waitCount + " wartet --- "}
    {waitCount > 1 && waitCount + " warten --- "}
    Offen mit neuen Personen zu fesseln: {openCount} / {registerCount}
  </label>

  return (
    <div className='border-round bg-white'>
      <DataScroller
        value={users}
        itemTemplate={Template}
        rows={100}
        buffer={0.4}
        header={eventInfo}
        className="mx-2"/>
    </div>)
}


const Register = (
  {toast, user_id, event_id, registerToEvent}:
    {
      toast: RefObject<Toast>,
      user_id: number | undefined,
      event_id: number,
      registerToEvent: (event_id: number) => void
    }) => {
  const [show_register_popup, setRegisterPopup] = useState<boolean>(false);

  const onRegisterButton = () => {
    if (!user_id) {
      registerToEvent(event_id);
      return
    }
    setRegisterPopup(true)
  }

  const onRegister = (guest_amount: number) => {
    setRegisterPopup(false)

    if (guest_amount > 2) {
      toast.current!.show({ severity: 'error', summary: 'Error', detail: 'Maximal zwei weitere Personen erlaubt.', life: 3000 });
    }
    else if (guest_amount < 0) {
      toast.current!.show({ severity: 'error', summary: 'Error', detail: 'Negative Personenmenge nicht erlaubt.', life: 3000 });
    }
    else {
      RegisterToEvent(event_id, user_id!, guest_amount)
    }
  }

  return (<>
    <Button
      onClick={onRegisterButton}
      className='w-max bg-indigo-300 border-indigo-300 text-xl'> Teilnehmen</Button>
    <Dialog
      header="Anmelden:"
      visible={show_register_popup}
      onHide={() => {
        setRegisterPopup(false)
      }}>
      <div className='flex flex-column mx-2 max-w-30rem'>
        <label className="mt-2 font-bold">Wen möchtest du anmelden?</label>
        <div className="flex my-2">
          <Button onClick={() => onRegister(0)} className='mx-2'><label className="mr-4">Mich</label></Button>
          <Button onClick={() => onRegister(1)} className='mx-2'>Mich + 1 weitere</Button>
          <Button onClick={() => onRegister(2)} className='mx-2'>Mich + 2 weitere</Button>
        </div>

        <label>Begleiter brauchen sich nicht selbst anmelden.</label>

        <label className="font-bold mt-4">Info:</label>
        <label>Anmeldungen sind verpflichtend!</label>
        <label>Wenn du nicht kommen kannst melde dich bitte wieder über diese Webseite ab.</label>
        <label>
          Bei mehrfachem Nichterscheinen ohne Abmeldung werden wir andere Anmeldungen grundsätzlich bevorzugen.
        </label>
      </div>
    </Dialog>
  </>)
}