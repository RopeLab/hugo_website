import {GetEvents, PostEvent, RopeEvent, UpdateEvent} from "../api/events";
import {Calendar} from "primereact/calendar";
import {InputText} from "primereact/inputtext";
import {InputTextarea} from "primereact/inputtextarea";
import {Button} from "primereact/button";
import React, {useRef, useState} from "react";
import {parseNumber} from "../pages/AdminEvents";
import {Toast} from "primereact/toast";
import {Checkbox} from "primereact/checkbox";

const addDays = (date: Date, days: number) => {
  let newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
}

export const EventSettings = ({event, setEvent, onSave}: {event: RopeEvent, setEvent: (event: RopeEvent) => void, onSave: () => void}) => {
  const toast = useRef<Toast>(null);

  return (
  <div className='flex flex-column align-items-center'>
    <div>
      <Toast ref={toast}/>

      <div className='flex align-items-center gap-2 m-2'>
        <label>Datum:</label>
        <Calendar showTime value={event.date} onChange={(e) => {
          if (e.value == undefined) {
            return
          }
          setEvent({...event, date: e.value})
        }}/>
      </div>

      <div className='flex align-items-center gap-2 m-2'>
        <label>Deadline:</label>
        <Calendar showTime value={event.register_deadline} onChange={(e) => {
          if (e.value == undefined) {
            return
          }
          setEvent({...event, register_deadline: e.value})
        }}/>
        <Button label={"1 Tag vor Event"} onClick={() => {
          setEvent({...event, register_deadline: addDays(event.date, -1)})
        }}/>
        <Button label={"3 Tage vor Event"} onClick={() => {
          setEvent({...event, register_deadline: addDays(event.date, -3)})
        }}/>
      </div>

      <div className='flex align-items-center gap-2 m-2'>
        <label>Sichtbar:</label>
        <Checkbox checked={event.visible} onChange={(e) => {
          setEvent({...event, visible: e.target.checked!})
        }}/>

        <label>ab:</label>

        <Calendar showTime value={event.visible_date} onChange={(e) => {
          if (e.value == undefined) {
            return
          }
          setEvent({...event, visible_date: e.value})
        }}/>
        <Button label={"2 Wochen vor Event"} onClick={() => {
          setEvent({...event, visible_date: addDays(event.date, -14)})
        }}/>
        <Button label={"1 Tag nach letztem Event"} onClick={() => {
          GetEvents((events) => {

            let last_event_date: Date | undefined = undefined;
            events.forEach((test_event) => {
              if (!last_event_date || (last_event_date < event.date && last_event_date < test_event.date)) {
                last_event_date = test_event.date;
              }
            })

            if (last_event_date) {
              setEvent({...event, visible_date: addDays(last_event_date, 1)})
            } else {
              toast.current!.show({severity: "error", summary: "Kein voheriges Event!"});
            }
          });
        }}/>
      </div>

      <div className='flex align-items-center gap-2 m-2'>
        <label>Archviert:</label>
        <Checkbox checked={event.archive} onChange={(e) => {
          setEvent({...event, archive: e.target.checked!})
        }}/>

        <label>ab:</label>
        <Calendar showTime value={event.archive_date} onChange={(e) => {
          if (e.value == undefined) {
            return
          }
          setEvent({...event, archive_date: e.value})
        }}/>
        <Button label={"Ein Tag nach Event"} onClick={() => {
          setEvent({...event, archive_date: addDays(event.date, 1)})
        }}/>


      </div>

      <div className='flex align-items-center gap-2 m-2'>
        <label>Slots:</label>
        <InputText
          type="text"
          value={event.slots.toString()}
          onChange={(e) => {
            setEvent({...event, slots: parseNumber(e.target.value)})
          }}
          className='w-1'
        />
      </div>

      <InputTextarea
        autoResize
        value={event.description}
        onChange={(e) => {
          setEvent({...event, description: e.target.value})
        }} rows={10} cols={100}/>

      <div className='flex flex-row-reverse mt-2'>
        <Button onClick={() => {
          if (!event.id) {
            PostEvent(event, onSave);
          } else {
            UpdateEvent(event, onSave);
          }
        }}>Speichern</Button>
      </div>
    </div>
  </div>)

}