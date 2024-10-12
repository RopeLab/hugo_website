import {Button} from "primereact/button";
import {Accordion, AccordionTab} from "primereact/accordion";
import { Dialog } from 'primereact/dialog';
import {useEffect, useState} from "react";
import {DeleteEvent, GetEvents, GetGermanDateTime, RopeEvent} from "../api/events";
import {EventSettings} from "../components/EventSettings";
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import {GetPossibleWorkshops} from "../api/workshops.ts";

export const parseNumber = (s: string): number => {
  const n = parseInt(s)
  if (n == undefined || isNaN(n)) {
    return 0;
  }

  return n
}

const AdminEvents = ({back}: {back: () => void}) => {
  const [events, setEvents] = useState<RopeEvent[]>([]);
  const [showNewEvent, setShowNewEvent] = useState<boolean>(false);
  const [newEvent, setNewEvent] = useState<RopeEvent>({
    custom_workshop: "",
    workshop_file: "Custom",
    archive: false,
    archive_date: new Date(),
    date: new Date(),
    id: undefined,
    register_deadline: new Date(),
    slots: 45,
    new_slots: 5,
    visible: false,
    visible_date: new Date()
  });
  const [possible_workshops, setPossibleWorkshops] = useState<string[]>([])

  useEffect(() => {
    GetEvents(setEvents);
    GetPossibleWorkshops((d: string[]) => {
      setPossibleWorkshops([...d, "Custom"]);
    });
  }, [])


  const createTabs = () => {
    return events.map((event, i) => {
      const header = GetGermanDateTime(event.date);
      return (
        <AccordionTab key={header} header={header}>
          <div className='flex flex-row-reverse mt-2 flex-wrap'>
            <ConfirmPopup/>
            <Button severity="danger" onClick={(e) => {
              confirmPopup({
                target: e.currentTarget,
                message: 'Willst du dieses Event wirklich löschen?',
                icon: 'pi pi-info-circle',
                acceptClassName: 'p-button-danger',
                accept: () => {
                  DeleteEvent(event, () => {
                    GetEvents(setEvents);
                  });
                },
              });
            }}>Löschen</Button>
          </div>

          <EventSettings event={event} setEvent={(newEvent) => {
            events[i] = newEvent;
            setEvents([...events]);
          }} onSave={back} possible_workshops={possible_workshops}/>
        </AccordionTab>
      );
    });
  };

  return (
    <div className='w-full'>
      <Dialog header="Neues Event" visible={showNewEvent} onHide={() => setShowNewEvent(false)}>
        <EventSettings event={newEvent} setEvent={setNewEvent} onSave={() => {
          setShowNewEvent(false);
          GetEvents(setEvents);
        }} possible_workshops={possible_workshops}/>
      </Dialog>

      <div className="flex gap-2 my-2">
        <Button label="Zurück" onClick={back}/>
        <div className="grow"/>
        <Button label="New Event" onClick={() => setShowNewEvent(true)}/>
      </div>

      <Accordion>{createTabs()}</Accordion>
    </div>
  )
}

export default AdminEvents