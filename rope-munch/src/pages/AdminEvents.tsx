import {Button} from "primereact/button";
import {Accordion, AccordionTab} from "primereact/accordion";
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import { InputText } from "primereact/inputtext";
import { InputTextarea } from 'primereact/inputtextarea';
import React, {useEffect, useState} from "react";
import {GetEvents, RopeEvent} from "../api/events";

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
    archive: false,
    archive_date: new Date(Date.now()),
    date: new Date(Date.now()),
    description: "Beschreibung",
    register_deadline: new Date(Date.now()),
    slots: 50,
    visible: false,
    visible_date: new Date(Date.now())
  });


  useEffect(() => {
    GetEvents(setEvents)
  }, [])




  const createTabs = () => {
    return events.map((event, i) => {

      const header = event.date.toLocaleDateString()
      return (
          <AccordionTab key={header} header={header}>

          </AccordionTab>
      );
    });
  };

  return (
    <div className="card">
      <Dialog header="Neues Event" visible={showNewEvent} onHide={() => setShowNewEvent(false)}>
        <div className='flex align-items-center gap-2 m-2'>
          <label>Datum:</label>
          <Calendar showTime value={newEvent.date} onChange={(e) => {
            if (e.value == undefined) {
              //setNewEvent({...newEvent, date: e.value})
              return
            }
            setNewEvent({...newEvent, date: e.value})
          }}/>

          <label>Slots:</label>
          <InputText
            type="text"
            value={newEvent.slots.toString()}
            onChange={(e) => {
              setNewEvent({...newEvent, slots: parseNumber(e.target.value)})
            }}
            className='w-1'
          />
          <div className='flex-grow-1'/>
          <Button onClick={() => {}}>Hinzufügen</Button>
        </div>
        <InputTextarea
          autoResize
          value={newEvent.description}
          onChange={(e) => {
            setNewEvent({...newEvent, description: e.target.value})
          }} rows={10} cols={100} />
      </Dialog>


      <div className="flex">
        <Button label={"Back"} onClick={back} className="m-2"/>
        <div className="flex-grow-1"/>
        <Button label={"New Event"} onClick={() => setShowNewEvent(true)} className="m-2"/>
      </div>


      <Accordion>{createTabs()}</Accordion>
    </div>
  )
}

export default AdminEvents