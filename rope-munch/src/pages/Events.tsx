import React, {RefObject, useEffect, useRef, useState} from "react";
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { DataScroller } from 'primereact/datascroller';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog'
import {GetEvents, RopeEvent} from "../api/events";
import {ChangeGuestsOfEvent, EventUser, GetEventUsers, RegisterToEvent, UnRegisterFromEvent} from "../api/event_users";
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

  useEffect(() => {
    GetEvents(setEvents);
  }, []);

  const [event, setEvent] = useState<RopeEvent | undefined>(undefined);
  const [users, setUsers] = useState<EventUser[]>([]);
  const reloadEventUsers = () => {
    if (!event) {
      setUsers([]);
      return
    }
    GetEventUsers(event.id!, setUsers)
  }
  useEffect(() => reloadEventUsers(), [event])

  const [register_count, setRegisterCount] = useState<number>(0);
  const [wait_count, setWaitCount] = useState<number>(0);
  const [open_count, setOpenCount] = useState<number>(0);
  const [free_slots, setFreeSlots] = useState<number>(0);
  const [event_user, setEventUser] = useState<EventUser | undefined>(undefined);

  useEffect(() => {

    let register_count = 0;
    let wait_count = 0;
    let open_count = 0;
    setEventUser(undefined);
    users.forEach((user) => {
      if (user.state === "Registered") {
        register_count += 1 + user.guests;
      } else if (user.state === "Waiting") {
        wait_count += 1 + user.guests;
      }

      if (user.open) {
        open_count += 1;
      }

      if (user.user_id === user_id) {
        setEventUser(user);
      }
    });

    setRegisterCount(register_count);
    setWaitCount(wait_count);
    setOpenCount(open_count);
    setFreeSlots(!event ? 0 : event.slots - register_count)

  }, [event, users, user_id])

  return <div className='flex flex-column align-items-center'>
    <Toast ref={toast}/>

    <div>
      <div className='flex align-items-center mt-4 mb-2'>

        <label className='font-bold text-xl mx-2 text-200'>Datum: </label>
        <Dropdown
          value={event}
          onChange={(e) => setEvent(e.value)}
          options={events}
          optionLabel="date"
          placeholder="Wähle ein Event"
          scrollHeight="full"
          className="max-w-12rem sm:w-full"/>

        <div className='flex-grow-1'/>

        {event && <>
          {!event_user && <Register event_id={event.id!} user_id={user_id} toast={toast} registerToEvent={registerToEvent} OnRegister={reloadEventUsers}/>}
          {event_user && <>
              <Unregister event_id={event.id!} user_id={user_id!} OnUnRegister={reloadEventUsers}/>
              <ChangeGuests event_id={event.id!} event_user={event_user} free_slots={free_slots} OnChange={reloadEventUsers}/>
          </>}
        </>}

      </div>

      {event && user_id &&
          <MemberList
              event={event}
              users={users}
              register_count={register_count}
              wait_count={wait_count}
              open_count={open_count}
              self_user_id={user_id}/>
      }
    </div>
  </div>
}

const MemberList = (
  {event, users, register_count, wait_count, open_count, self_user_id}:
    {
      event: RopeEvent,
      users: EventUser[],
      register_count: number,
      wait_count: number,
      open_count: number,
      self_user_id: number
    }) => {


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

  const eventInfo = <label>
    {register_count} / {event.slots} angemeldet --- {wait_count === 1 && wait_count + " wartet --- "}
    {wait_count > 1 && wait_count + " warten --- "}
    Offen mit neuen Personen zu fesseln: {open_count} / {register_count}
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
  {toast, user_id, event_id, registerToEvent, OnRegister}:
    {
      toast: RefObject<Toast>,
      user_id: number | undefined,
      event_id: number,
      registerToEvent: (event_id: number) => void,
      OnRegister: () => void
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
      RegisterToEvent(event_id, user_id!, guest_amount, OnRegister)
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

const Unregister = ({event_id, user_id, OnUnRegister}: {event_id: number, user_id: number, OnUnRegister: () => void}) => {
  const [showUnRegisterPopup, setUnRegisterPopup] = useState<boolean>(false);

  const onUnRegisterButton = () => {
    setUnRegisterPopup(true)
  }

  const onUnregister = () => {
    setUnRegisterPopup(false)
    UnRegisterFromEvent(event_id, user_id, OnUnRegister);
  }

  return (<>
    <Dialog
      header="Willst du dich wirklich von dem Event abmelden?"
      visible={showUnRegisterPopup}
      onHide={() => {
        setUnRegisterPopup(false)
      }}
    >
      <div className='flex flex-column max-w-30rem'>
        <label>Wenn du dich abmeldest rücken andere Teilnehmer nach.</label>
        <label>
          Bei einem wieder anmelden wirst du ganz unten in der Liste eingetragen
          und landest damit potezell auf der Warteliste.
        </label>

        <div className="flex mt-4">
          <div className="flex-grow-1"></div>
          <Button onClick={onUnregister}>Abmelden</Button>
        </div>
      </div>
    </Dialog>

    <Button onClick={onUnRegisterButton} className='bg-indigo-300 border-indigo-300 m-2'>Abmelden</Button>
  </>)
};

const ChangeGuests = ({event_id, event_user, free_slots, OnChange}: {event_id: number, event_user: EventUser, free_slots: number, OnChange: () => void}) => {
  const [showChangeGuestPopup, setChangeGuestPopup] = useState<boolean>(false);

  const onChangeGuestButton = () => {
    setChangeGuestPopup(true)
  }

  const onChangeGuest = (ammount: number) => {
    setChangeGuestPopup(false);
    ChangeGuestsOfEvent(event_id, event_user.user_id, event_user.guests + ammount, OnChange);
  }

  const can_add_guests = 2 - event_user.guests;
  return (<>
    <Dialog
      header="Begleitung ändern"
      visible={showChangeGuestPopup}
      onHide={() => {
        setChangeGuestPopup(false)
      }}
    >
      <div className='flex flex-column max-w-30rem'>

        <label className="font-bold">Angemeldet:</label>
        <label>Du + {event_user.guests} weitere Person</label>

        <label className="font-bold mt-3">Begleitung hinzufügen:</label>
        <div className='flex'>
          <Button disabled={can_add_guests < 1 || free_slots < 1} className="m-2"
                  onClick={() => onChangeGuest(1)}>+1</Button>
          <Button disabled={can_add_guests < 2 || free_slots < 2} className="m-2"
                  onClick={() => onChangeGuest(2)}>+2</Button>
        </div>

        {event_user.state === "Registered" && <>
          {free_slots === 1 && can_add_guests > 1 && <>
              <label className='mt-2 font-bold'>Es ist nur 1 Platz frei</label>
              <label className='mt-2'>Du bist zum Event zugelassen</label>
              <label>aber es ist nur noch 1 Platz frei.</label>
              <label>Daher kannst du nur eine weitere</label>
              <label>Person hinzufügen ohne jemanden</label>
              <label>aus der Liste zu schieben.</label>
          </>}
          {free_slots === 0 && can_add_guests > 0 && <>
          <label className='mt-2 font-bold'>Es ist kein Platz mehr frei</label>
              <label className='mt-2'>Du bist zum Event zugelassen</label>
              <label>aber ist kein Platz mehr frei.</label>
              <label>Daher kannst du keine weitere</label>
              <label>Person hinzufügen ohne jemanden</label>
              <label>aus der Liste zu schieben.</label>
          </>}
        </>}

        <label className="font-bold mt-3">Begleitung abmelden:</label>
        <div className='flex'>
          <Button disabled={event_user.guests < 1} className="m-2" onClick={() => onChangeGuest(-1)}>-1</Button>
          <Button disabled={event_user.guests < 2} className="m-2" onClick={() => onChangeGuest(-2)}>-2</Button>
        </div>
      </div>
    </Dialog>

    <Button onClick={onChangeGuestButton} className='bg-indigo-300 border-indigo-300 m-2'>Begleitung ändern</Button>
  </>)
}