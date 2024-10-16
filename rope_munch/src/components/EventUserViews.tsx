import {Tag} from 'primereact/tag';
import {ProgressBar} from "primereact/progressbar";
import {EventUser, EventUserState} from "../api/event_users";
import { Button } from 'primereact/button';


export const EventUserStateView = ({user}: {user: EventUser}) => {
  return (
    <>
      { user.state === EventUserState.Registered && <Tag value="Registriert" severity="success" />}
      { user.state === EventUserState.Waiting && <Tag value="Warteliste" severity="warning" />}
      { user.state === EventUserState.New && <Tag value="Neulings Slot" severity="success" />}
      { user.state === EventUserState.WaitingNew && <Tag value="Neuling Wartet" severity="warning" />}
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

export const FetlifeLink = ({fetlife_name}: {fetlife_name: string}) => {
  if (fetlife_name == "") {
    return <></>
  }

  const link = 'https://fetlife.com/' + fetlife_name;
  return <Button label={link} link onClick={() =>  window.open(link, '_blank')}/>
}

export const EventUserGuests = ({user}: {user: EventUser}) => {
  return (<>
    {user.guests > 0 ?
      <Tag value={"+" + user.guests} className='hh-8 w-10 mx-1 my-2'/>:
      <div className='mx-1 my-2 h-8 w-10'/>
    }
  </>);
};

export const EventUserOpen = ({user}: {user: EventUser}) => {
  return (<>
    {user.open ?
      <Tag icon="pi pi-user-plus" severity="info" className='h-8 w-10 mx-1 my-2'/> :
      <div className='mx-1 my-2 h-8 w-10'/>
    }
  </>);
};

export const EventUserRole = ({user}: {user: EventUser}) => {
  return (<>
    {user.role_factor ?
    <ProgressBar
      className="mx-1 mr-2"
      displayValueTemplate={() => ""}
      value={user.role_factor}
    /> :
      <></>}
  </>);
};

export const EventUserAttended = ({attended}: {attended: boolean}) => {
  return (<>
    {attended ?
      <Tag severity="success" className='h-8 w-20 mx-1 my-2'>War da</Tag> :
      <div className='mx-1 my-2 h-8 w-20'/>
    }
  </>);
};






