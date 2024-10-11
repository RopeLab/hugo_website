import {useEffect, useRef, useState} from "react";
import {Dropdown} from 'primereact/dropdown';
import {Toast} from 'primereact/toast';
import {DataScroller} from 'primereact/datascroller';
import {Button} from 'primereact/button';
import {Dialog} from 'primereact/dialog'
import {Image} from 'primereact/image';
import Markdown from 'react-markdown'
import {GetGermanDate, GetGermanDateTime, GetGermanTime} from "../api/events";
import {
  ChangeGuestsOfEvent,
  EventUser,
  EventUserLists,
  EventUserState,
  GetEventUser,
  GetEventUsers, GetEventUsersAdmin, GetEventUsersCheckAttention,
  RegisterToEvent,
  UnRegisterFromEvent
} from "../api/event_users";
import {
  EventUserGuests,
  EventUserName,
  EventUserOpen,
  EventUserRole,
  EventUserStateView,
  FetlifeLink
} from "../components/EventUserViews";
import {Page} from "../entry_points";
import AdminMenue from "../components/AdminMenue.tsx";
import {Logout} from "../components/Logout.tsx";
import {
  GetEventDates,
  GetPrivateEvent,
  GetPublicEvent,
  PrivateRopeEvent,
  PublicRopeEvent,
  RopeEventDate
} from "../api/event_public.ts";
import Loading from "../components/Loading";
import {GetRoleFromPercent} from "../api/data";
import {HasPermission, UserPermission} from "../api/permissions.ts";
import {Checkbox} from "primereact/checkbox";


export const Events = ({user_id, register_to_event, setRegisterToEvent, setPage, onLoggedOut}: {
  user_id: number | undefined,
  register_to_event: number | undefined
  setRegisterToEvent: (event_id: number | undefined) => void,
  setPage: (page: Page) => void,
  onLoggedOut: () => void
}) => {
  const [event_dates, setEventDates] = useState<RopeEventDate[]>([]);

  useEffect(() => {
    GetEventDates(setEventDates);
  }, []);

  const [event_date, setEventDate] = useState<RopeEventDate | undefined>(undefined);

  useEffect(() => {
    let new_event;

    if (register_to_event) {
      new_event = event_dates.find((test_event) => {
        return event_date != null && test_event.id === register_to_event
      })
    }

    if (new_event == null) {
      new_event = event_dates.find((test_event) => {
        return event_date != null && test_event.id === event_date.id
      })
    }

    if (new_event == null) {
      new_event = event_dates[0]

      // Find the next event
      event_dates.forEach(event => {
        if (new_event!.date > event.date && event.date.getUTCDate() >= Date.now()) {
          new_event = event
        }
      })
    }

    setEventDate(new_event)
  }, [event_dates])

  const [event_user, setEventUser] = useState<EventUser | undefined | "not_registered">(undefined)
  const [verified, setVerified] = useState<boolean | undefined>(undefined);
  const [admin, setAdmin] = useState<boolean | undefined>(undefined);
  const [check_attended, setCheckAttention] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    if (!user_id) {
      return
    }

    HasPermission(user_id, UserPermission.Verified, setVerified);
    HasPermission(user_id, UserPermission.Admin, setAdmin);
    HasPermission(user_id, UserPermission.CheckAttended, setCheckAttention);
  }, [user_id])

  const [public_event_data, setPublicEventData] = useState<PublicRopeEvent | undefined>(undefined)
  const [private_event_data, setPrivateEventData] = useState<PrivateRopeEvent | undefined>(undefined)

  const [admin_mode, setAdminMode] = useState<boolean>(false);
  const [check_attended_mode, setCheckAttendedMode] = useState<boolean>(false);

  const [users, setUsers] = useState<EventUserLists | undefined>(undefined);
  const [attended_users, setAttentionUsers] = useState<EventUser[]>([]);

  useEffect(() => {
    if (!admin) {
      return
    }

    setAdminMode(true);
  }, [admin])

  const reloadEventData = () => {
    if (!event_date) {
      setPublicEventData(undefined);
      setPrivateEventData(undefined);
      setUsers(undefined);
      setAttentionUsers([]);
      setEventUser(undefined);
      return
    }

    if (!user_id) {
      GetPublicEvent(event_date.id, setPublicEventData);
      setPrivateEventData(undefined);
      setUsers(undefined);
      setAttentionUsers([]);
      setEventUser(undefined);
      return;
    }

    if (verified == undefined || admin == undefined || check_attended == undefined) {
      return;
    }

    if (!verified) {
      GetPublicEvent(event_date.id, setPublicEventData);
      setPrivateEventData(undefined);
      setUsers(undefined);
      setAttentionUsers([]);
      GetEventUser(event_date.id, user_id, setEventUser);

      return;
    }

    setPublicEventData(undefined);
    GetPrivateEvent(event_date.id, setPrivateEventData);

    if (admin_mode) {
      GetEventUsersAdmin(event_date.id, setUsers);
      setAttentionUsers([]);
    } else if (check_attended_mode) {
      setUsers(undefined);
      GetEventUsersCheckAttention(event_date.id, setAttentionUsers);
    } else {
      GetEventUsers(event_date.id, setUsers);
      setAttentionUsers([]);
    }

    GetEventUser(event_date.id, user_id, setEventUser);
  }
  useEffect(reloadEventData, [event_date, user_id, verified, admin_mode, check_attended_mode])

  useEffect(() => {
    if (!event_user || event_user == "not_registered") {
      return
    }

    setRegisterToEvent(undefined)
  }, [event_user])



  return <div className='flex flex-col gap-2 w-full'>
    {user_id && <div className="flex flex-wrap justify-end gap-2">
      <AdminMenue user_id={user_id} setPage={setPage}/>
      <Logout OnLogout={onLoggedOut}/>
    </div>}

    <div className='flex items-center gap-2 w-full flex-wrap md:flex-nowrap'>
      <label className='font-bold text-xl'>Datum: </label>
      <Dropdown
        value={event_date}
        valueTemplate={(e) => e && GetGermanDate(e.date)}
        itemTemplate={(e) => e && GetGermanDate(e.date)}
        onChange={(e) => setEventDate(e.value)}
        options={event_dates}
        optionLabel="date"
        placeholder="Wähle ein Event"
        scrollHeight="full"
      />
      <div className='grow'/>

      {event_date && <>
        {event_user || !user_id ? <>
          {event_user == "not_registered" || !user_id ? <>
            <Register
            event_id={event_date.id!}
            user_id={user_id}
            register_to_event={register_to_event}
            setRegisterToEvent={setRegisterToEvent}
            setPage={setPage}
            OnRegister={reloadEventData}/>
            </> : <>
          {private_event_data ? <div className='flex justify-items-center flex-wrap md:flex-nowrap gap-2'>
            <Unregister event_id={event_date.id!} user_id={user_id!} OnUnRegister={reloadEventData}/>
            <ChangeGuests event_id={event_date.id!} event_user={event_user!} free_slots={private_event_data.slots - private_event_data.register_count}
                                                  OnChange={reloadEventData}/>
            </div>:
            <Loading/>}
          </>}
        </> : <>
          <Loading/>
        </>}
      </>}
    </div>

    {private_event_data ? <>
      <Header event_date={event_date!}/>
      <Mode
        admin={admin}
        admin_mode={admin_mode}
        setAdminMode={setAdminMode}
        check_attended={check_attended}
        check_attended_mode={check_attended_mode}
        setCheckAttendedMode={setCheckAttendedMode} />

      {check_attended_mode ? <>
          {attended_users ?
            <UserListCheckAttention users={attended_users} logged_in_event={private_event_data} self_user_id={user_id!}/> :
            <Loading/>
          }
        </>:
        <>
          {users ?
            <UserList users={users} logged_in_event={private_event_data} self_user_id={user_id!}/> :
            <Loading/>
          }
        </>}
      <EventText logged_in_event={private_event_data}/>
    </> : <>
      {public_event_data ? <>
        <PublicEventText event_date={event_date!} public_event={public_event_data}/>
      </> : <>
        <Loading/>
      </>}
    </>}
</div>
}

const Mode = (
  {admin, admin_mode, setAdminMode, check_attended, check_attended_mode, setCheckAttendedMode}:
    {
      admin: boolean | undefined,
      admin_mode: boolean,
      setAdminMode: (b: boolean) => void,
      check_attended: boolean | undefined,
      check_attended_mode: boolean,
      setCheckAttendedMode: (b: boolean) => void
    }
    ) => {
  return <div className="flex items-center">
    {admin && <>
      <label className="m-2">Admin:</label>

      <Checkbox
        onChange={e => {
          setAdminMode(e.checked!);
          setCheckAttendedMode(false);
        }}
        checked={admin_mode}/>
    </>}

    {check_attended && <>
      <label className="m-2">Anwesenheit:</label>

      <Checkbox
        onChange={e => {
          setAdminMode(false);
          setCheckAttendedMode(e.checked!);
        }}
        checked={check_attended_mode}/>
    </>}

  </div>
}

const UserListTemplate = (
  {user, self_user_id, selected_user, setSelctedUser}:
    {
      user: EventUser,
      self_user_id: number,
      selected_user: EventUser | undefined,
      setSelctedUser: (user: EventUser | undefined) => void
    }
) => {
  if (selected_user == user) {
    // aufgeklappt
    return (<div className='flex flex-col text-lg mb-2'>
      <div className='text-2xl flex items-center gap-2 flex-wrap-reverse justify-end'>
        <EventUserStateView user={user}/>
        <EventUserName user={user} bold={false}/>
        <div className='grow'></div>
        <Button icon="pi pi-times" className="m-2" onClick={() => {
          setSelctedUser(undefined);
        }}/></div>

      {user.fetlife_name && user.fetlife_name != "" && <div className="flex">
        <FetlifeLink fetlife_name={user.fetlife_name}/>
      </div>}

      {(user.state == EventUserState.Waiting || user.state == EventUserState.WaitingNew) && <>
        {user.state == EventUserState.WaitingNew && <label>Neulings-Wartelistenplatz Nr. {user.new_slot + 1}</label>}
        <label className="mb-4">Wartelistenplatz Nr. {user.slot + 1}</label>
      </>}

      {user.role_factor && <div className='flex items-center gap-2 mb-2'>
        <div className="w-24"><EventUserRole user={user}/></div>
        <label>{GetRoleFromPercent(user.role_factor).name}</label>
      </div>}

      {user.guests && user.guests != 0 && <div className='flex items-center gap-2'>
        <EventUserGuests user={user}/>
        <label>Bringt {user.guests} Personen mit.</label>
      </div>}

      {user.open && <div className='flex items-center gap-2'>
        <EventUserOpen user={user}/>
        <label>Hat Interesse mit neuen Personen zu fesseln.</label>
      </div>}
    </div>)
  }


  return (<div className='flex justify-center items-center flex-wrap' onClick={() => setSelctedUser(user)}>
    <EventUserStateView user={user}/>
    <EventUserName user={user} bold={user.user_id == self_user_id}/>
    <div className='grow'></div>
    <div className='flex items-center'>
      <EventUserGuests user={user}/>
      <EventUserOpen user={user}/>
      <div className="w-24"><EventUserRole user={user}/></div>
    </div>
  </div>)
}

const UserList = ({users, logged_in_event, self_user_id}: {
  users: EventUserLists,
  logged_in_event: PrivateRopeEvent,
  self_user_id: number
}) => {
  const [selected_user, setSelctedUser] = useState<EventUser | undefined>(undefined);

  const registerInfo = <label>
    {logged_in_event.register_count} / {logged_in_event.slots} angemeldet ---
    Offen mit neuen Personen zu fesseln: {logged_in_event.open_count} / {logged_in_event.register_count}
  </label>

  const newInfo = <label>
    {logged_in_event.new_count} / {logged_in_event.new_slots} Neulingsplätze vergeben
  </label>

  const waitInfo = <label>
    {logged_in_event.wait_count === 1 && logged_in_event.wait_count + " Person wartet"}
    {logged_in_event.wait_count > 1 && logged_in_event.wait_count + " Personen warten"}
  </label>

  return (<div className='border-round bg-white'>
    <DataScroller
      value={users.registered}
      itemTemplate={(u: EventUser) => <UserListTemplate
        user={u}
        self_user_id={self_user_id}
        selected_user={selected_user}
        setSelctedUser={setSelctedUser}/>}
      rows={20}
      buffer={0.4}
      header={registerInfo}/>

    {logged_in_event.new_slots > 0 && <DataScroller
      value={users.new}
      itemTemplate={(u: EventUser) => <UserListTemplate
        user={u}
        self_user_id={self_user_id}
        selected_user={selected_user}
        setSelctedUser={setSelctedUser}/>}
      rows={20}
      buffer={0.4}
      header={newInfo}/>}

    {logged_in_event.wait_count > 0 && <DataScroller
      value={users.waiting}
      itemTemplate={(u: EventUser) => <UserListTemplate
        user={u}
        self_user_id={self_user_id}
        selected_user={selected_user}
        setSelctedUser={setSelctedUser}/>}
      rows={20}
      buffer={0.4}
      header={waitInfo}/>}
  </div>)
}

const UserListCheckAttention = ({users, logged_in_event, self_user_id}: {
  users: EventUser[],
  logged_in_event: PrivateRopeEvent,
  self_user_id: number
}) => {
  const [selected_user, setSelctedUser] = useState<EventUser | undefined>(undefined);

  const info = <label>
    {logged_in_event.register_count} / {logged_in_event.slots} {"angemeldet --- "}
    {logged_in_event.new_count} / {logged_in_event.new_slots} neu
    {logged_in_event.wait_count === 1 && " --- " + logged_in_event.wait_count + " wartet"}
    {logged_in_event.wait_count > 1 && " --- " + logged_in_event.wait_count + "warten"}
  </label>

  return (<div className='border-round bg-white'>
    <DataScroller
      value={users}
      itemTemplate={(u: EventUser) => <UserListTemplate
        user={u}
        self_user_id={self_user_id}
        selected_user={selected_user}
        setSelctedUser={setSelctedUser}/>}
      rows={20}
      buffer={0.4}
      header={info}/>
  </div>)
}

const Register = (
  {user_id, event_id, register_to_event, setRegisterToEvent, setPage, OnRegister}:
    {
      user_id: number | undefined,
      event_id: number,
      register_to_event: number | undefined,
      setRegisterToEvent: (event_id: number | undefined) => void,
      setPage: (page: Page) => void
      OnRegister: () => void
    }) => {
  const toast = useRef<Toast>(null);
  const [show_register_popup, setRegisterPopup] = useState<boolean>(
    register_to_event != undefined && user_id != undefined);

  const onRegisterButton = () => {
    if (!user_id) {
      setRegisterToEvent(event_id);
      setPage(Page.Signup);
      return
    }

    setRegisterPopup(true)
  }

  const onRegister = (guest_amount: number) => {
    setRegisterPopup(false)
    setRegisterToEvent(undefined)

    if (guest_amount > 2) {
      toast.current!.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Maximal zwei weitere Personen erlaubt.',
        life: 3000
      });
    } else if (guest_amount < 0) {
      toast.current!.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Negative Personenmenge nicht erlaubt.',
        life: 3000
      });
    } else {
      RegisterToEvent(event_id, user_id!, guest_amount, OnRegister)
    }
  }

  return (<>
    <Toast ref={toast}/>
    <Button
      label="Teilnehmen"
      onClick={onRegisterButton}
      className='w-max text-xl'/>
    <Dialog
      header="Anmelden:"
      visible={show_register_popup}
      onHide={() => {
        setRegisterPopup(false)
        setRegisterToEvent(undefined)
      }}>
      <div className='flex flex-col mx-2'>
        <label className="mt-2 font-bold">Wen möchtest du anmelden?</label>
        <div className="flex my-2 gap-2">
          <Button onClick={() => onRegister(0)}><label className="mr-4">Mich</label></Button>
          <Button onClick={() => onRegister(1)}>Mich + 1 weitere</Button>
          <Button onClick={() => onRegister(2)}>Mich + 2 weitere</Button>
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

const Unregister = ({event_id, user_id, OnUnRegister}: {
  event_id: number,
  user_id: number,
  OnUnRegister: () => void
}) => {
  const [showUnRegisterPopup, setUnRegisterPopup] = useState<boolean>(false);

  const onUnRegisterButton = () => {
    setUnRegisterPopup(true)
  }

  const onUnregister = () => {
    setUnRegisterPopup(false)
    UnRegisterFromEvent(event_id, user_id, OnUnRegister);
  }

  return (<>
    <Button
      label="Abmelden"
      onClick={onUnRegisterButton}
      className='w-max'/>
    <Dialog
      header="Willst du dich wirklich von dem Event abmelden?"
      visible={showUnRegisterPopup}
      onHide={() => {
        setUnRegisterPopup(false)
      }}
    >
      <div className='flex flex-col max-w-30rem'>
        <label>Wenn du dich abmeldest rücken andere Teilnehmer nach.</label>
        <label>
          Bei einem wieder anmelden wirst du ganz unten in der Liste eingetragen
          und landest damit potezell auf der Warteliste.
        </label>

        <div className="flex mt-4">
          <div className="grow"></div>
          <Button onClick={onUnregister}>Abmelden</Button>
        </div>
      </div>
    </Dialog>
  </>)
};

const ChangeGuests = ({event_id, event_user, free_slots, OnChange}: {
  event_id: number,
  event_user: EventUser,
  free_slots: number,
  OnChange: () => void
}) => {
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
    <Button
      label="Begleitung ändern"
      onClick={onChangeGuestButton}
      className='w-max'/>
    <Dialog
      header="Begleitung ändern"
      visible={showChangeGuestPopup}
      onHide={() => {
        setChangeGuestPopup(false)
      }}
    >
      <div className='flex flex-col max-w-30rem'>

        <label className="font-bold">Angemeldet:</label>
        <label>Du + {event_user.guests} weitere Person</label>

        <label className="font-bold mt-3">Begleitung hinzufügen:</label>
        <div className='flex'>
          <Button disabled={can_add_guests < 1 || free_slots < 1} className="m-2"
                  onClick={() => onChangeGuest(1)}>+1</Button>
          <Button disabled={can_add_guests < 2 || free_slots < 2} className="m-2"
                  onClick={() => onChangeGuest(2)}>+2</Button>
        </div>

        {event_user.state === EventUserState.Registered && <>
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
  </>)
}

const Header = ({event_date}: { event_date: RopeEventDate }) => {
  return <div className='flex flex-wrap justify-center md:justify-start gap-2 text-2xl font-bold my-3'>
    <label>Tüdeltreff am </label>
    <label> {GetGermanDateTime(event_date.date)}</label>
  </div>
}

const EventText = ({logged_in_event}: { logged_in_event: PrivateRopeEvent }) => {
  return <div className='border-round bg-primary my-2'>
    <Markdown
      className="py-1"
    >{logged_in_event.description}</Markdown>
  </div>
}

const PublicEventText = ({ event_date, public_event }: { event_date: RopeEventDate, public_event: PublicRopeEvent }) => {
  return <div className='flex flex-col border-round bg-primary my-3'>
    <div className='flex'>
      <div className='flex flex-col my-3 w-12rem min-w-max font-bold items-center'>
        <div className='text-6xl mx-2'>
          <label>{public_event.register_count} / </label>
          <label className='text-4xl'>{public_event.slots}</label>
        </div>
        <div className='text-4xl'>
          {public_event.wait_count == 1 ?
            <label>1 wartet</label> :
            <label>{public_event.wait_count} warten</label>
          }
        </div>
        <label className='text-4xl mt-4'>{GetGermanTime(event_date.date)}</label>
        <label className='text-xl'>{GetGermanDate(event_date.date)}</label>

      </div>
      <div className='grow'/>
      <div className='m-2 max-w-20rem border-round surface-card'>
        <Image
          src="rope_munch/logofull.png"
          alt="Logo"
          width='90%'
          className='p-2'
        />
      </div>
    </div>

    <div>
      <Markdown>{public_event.description}</Markdown>
    </div>
  </div>
}