import {GetEvents, PostEvent, RopeEvent, UpdateEvent} from "../api/events";
import {Calendar} from "primereact/calendar";
import {InputText} from "primereact/inputtext";
import {InputTextarea} from "primereact/inputtextarea";
import {Button} from "primereact/button";
import {useRef} from "react";
import {parseNumber} from "../pages/AdminEvents";
import {Toast} from "primereact/toast";
import {Checkbox} from "primereact/checkbox";
import {Dropdown} from "primereact/dropdown";

const addDays = (date: Date, days: number) => {
  let newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
}

export const EventSettings = ({event, setEvent, onSave, possible_workshops}: {event: RopeEvent, setEvent: (event: RopeEvent) => void, onSave: () => void, possible_workshops: string[]}) => {
  const toast = useRef<Toast>(null);

  return (
  <div className='flex flex-col items-center'>
    <div>
      <Toast ref={toast}/>

      <div className='flex items-center gap-2 m-2 my-4 flex-wrap'>
        <label className='font-bold'>Datum:</label>
        <Calendar showTime value={event.date} onChange={(e) => {
          if (e.value == undefined) {
            return
          }
          setEvent({...event, date: e.value})
        }}/>
      </div>

      <div className='flex items-center gap-2 m-2 my-4 flex-wrap'>
        <label className='font-bold'>Deadline:</label>
        <Calendar showTime value={event.register_deadline} onChange={(e) => {
          if (e.value == undefined) {
            return
          }
          setEvent({...event, register_deadline: e.value})
        }}/>

        <div className='flex gap-2 flex-wrap'>
          <Button label={"1 Tag vor Event"} onClick={() => {
            setEvent({...event, register_deadline: addDays(event.date, -1)})
          }}/>
          <Button label={"3 Tage vor Event"} onClick={() => {
            setEvent({...event, register_deadline: addDays(event.date, -3)})
          }}/>
        </div>
      </div>

      <div className='flex items-center gap-2 m-2 my-4 flex-wrap'>
        <label className='font-bold'>Sichtbar:</label>
        <Checkbox checked={event.visible} onChange={(e) => {
          setEvent({...event, visible: e.target.checked!})
        }}/>

        <div className='flex gap-2 flex-wrap items-center'>
          <label>ab:</label>

          <Calendar showTime value={event.visible_date} onChange={(e) => {
            if (e.value == undefined) {
              return
            }
            setEvent({...event, visible_date: e.value})
          }}/>
        </div>

        <div className='flex gap-2 flex-wrap items-center'>
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
      </div>

      <div className='flex items-center gap-2 m-2 my-4 flex-wrap'>
        <label className='font-bold'>Archviert:</label>
        <Checkbox checked={event.archive} onChange={(e) => {
          setEvent({...event, archive: e.target.checked!})
        }}/>

        <div className='flex gap-2 flex-wrap items-center'>
          <label>ab:</label>
          <Calendar showTime value={event.archive_date} onChange={(e) => {
            if (e.value == undefined) {
              return
            }
            setEvent({...event, archive_date: e.value})
          }}/>
        </div>

        <Button label={"Ein Tag nach Event"} onClick={() => {
          setEvent({...event, archive_date: addDays(event.date, 1)})
        }}/>
      </div>

      <div className='flex items-center gap-2 m-2 flex-wrap'>
        <label className='font-bold'>Slots:</label>
        <InputText
          type="text"
          value={event.slots.toString()}
          onChange={(e) => {
            setEvent({...event, slots: parseNumber(e.target.value)})
          }}
          className='w-20'
        />
        <label className='font-bold'>New:</label>
        <InputText
          type="text"
          value={event.new_slots.toString()}
          onChange={(e) => {
            setEvent({...event, new_slots: parseNumber(e.target.value)})
          }}
          className='w-20'
        />
      </div>

      <div className='flex items-center gap-2 m-2 flex-wrap'>
        <label className='font-bold'>Workshop:</label>
        <Dropdown
          value={event.workshop_file}
          onChange={(e) => setEvent({...event, workshop_file: e.value})}
          options={possible_workshops}
          placeholder="Wähle ein Workshop Text"
          scrollHeight="full"
        />
      </div>

      <label className='font-bold'>Custom Workshop Text:</label>
      <InputTextarea
        autoResize
        value={event.custom_workshop}
        onChange={(e) => {
          setEvent({...event, custom_workshop: e.target.value})
        }} rows={10} className='w-full'/>

      <div className='flex flex-row-reverse mt-2 flex-wrap'>
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