// @ts-ignore
import React, {useState, useRef} from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import {Dialog} from "primereact/dialog";
import {PostLogin} from "../api/auth";


const Login = ({OnLoggedIn}: {OnLoggedIn: (userId: number) => void}) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showRest, setShowRest] = useState<boolean>(false);

  const toast = useRef<Toast>(null);

  /*
  let fromEventId = undefined;
  if (state != null && state.fromEventId != undefined) {
    fromEventId = state.fromEventId;
  }
   */

  const onLogin = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    PostLogin(email, password, OnLoggedIn);
  }

  const errorPopup = (text: string) => {
    toast.current!.show({ severity: 'error', summary: 'Fehler', detail: text, life: 3000 });
  }

  const onRest = () => {
    setShowRest(false)
  }

  return(
    <div className='w-full flex justify-content-center text-200'>
      <Toast ref={toast} />

      <div className='flex flex-column'>
        <div className='field grid mt-4'>
          <label htmlFor="email-address" className='col-fixed'>
            Email
          </label>
          <InputText
            id="email-address"
            name="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='w-full m-2'
          />
        </div>

        <div className='field grid'>
          <label htmlFor="password" className='col-fixed'>
            Passwort
          </label>
          <InputText
            id="password"
            name="password"
            type="password"
            placeholder="Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='w-full m-2'
          />
        </div>

        <div className='align-self-end'>
          <Button onClick={onLogin}>Anmelden</Button>
        </div>

        <div className='flex mt-4 justify-content-between'>
          <Button text onClick={() => setShowRest(true)} className="text-white">Passwort vergessen</Button>
        </div>

        <Dialog header="Passwort zurück setzen" visible={showRest} onHide={() => setShowRest(false)}>
          <div className="flex flex-column">
            <InputText
              id="email-address"
              name="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="m-2"
            />
            <Button onClick={onRest} className="align-self-end m-2">Anfrage senden</Button>
          </div>
        </Dialog>
      </div>
    </div>
  )
}

export default Login