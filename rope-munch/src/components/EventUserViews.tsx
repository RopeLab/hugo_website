import {Tag} from 'primereact/tag';
import {ProgressBar} from "primereact/progressbar";
import {EventUser, EventUserState} from "../api/event_users";
import React from "react";


export const EventUserStateView = ({user}: {user: EventUser}) => {
  return (
    <>
      { user.state === EventUserState.Registered && <Tag value="Registriert" severity="success" />}
      { user.state === EventUserState.Waiting && <Tag value="Warteliste" severity="warning" />}
    </>
  );
};


export const EventUserName = ({user, bold}: {user: EventUser, bold: boolean}) => {
    const name = user.name ? user.name : "Anonym";
    return (
      <>
          {bold ?
            <label className='m-3 font-bold'>{name}</label> :
            <label className='m-3'>{name}</label>
          }
      </>
    );
};

export const EventUserGuests = ({user}: {user: EventUser}) => {
  return (<>
    {user.guests > 0 ?
      <Tag value={"+" + user.guests} className='h-2 w-2 mx-1 my-2'/>:
      <div className='mx-1 my-2 h-2 w-2'/>
    }
  </>);
};

export const EventUserOpen = ({user}: {user: EventUser}) => {
  return (<>
    {user.open ?
      <Tag icon="pi pi-user-plus" severity="info" className='h-2 w-2 mx-1 my-2'/> :
      <div className='mx-1 my-2 h-2 w-2'/>
    }
  </>);
};

export const EventUserRole = ({user}: {user: EventUser}) => {
  return (<>
    <ProgressBar
      className="w-full bg-indigo-300"
      style={{ height: '12px' }}
      displayValueTemplate={() => ""}
      value={user.role_factor}
    />
  </>);
};





