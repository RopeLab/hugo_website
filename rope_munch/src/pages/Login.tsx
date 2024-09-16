import {useState, useRef} from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import {Dialog} from "primereact/dialog";
import {PostLogin} from "../api/auth";


const Login = ({OnLoggedIn, back}: {OnLoggedIn: (userId: number) => void, back: (() => void) | undefined}) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showRest, setShowRest] = useState<boolean>(false);

  const toast = useRef<Toast>(null);

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

  return (
    <div className='flex flex-col gap-2'>
      <Toast ref={toast}/>

      {back && <Button label="Zurück" onClick={back} className="self-end"/>}

      <label htmlFor="email-address" className="self-start">Email</label>

      <InputText
        id="email-address"
        name="email"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className='w-full'
      />

      <label htmlFor="password" className="self-start">Passwort</label>

      <InputText
        id="password"
        name="password"
        type="password"
        placeholder="Passwort"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className='w-full'
      />

      <div className='flex justify-end gap-2 flex-wrap'>
        <Button text onClick={() => setShowRest(true)}>Passwort vergessen</Button>
        <Button onClick={onLogin}>Anmelden</Button>
      </div>

      <Dialog header="Passwort zurück setzen" visible={showRest} onHide={() => setShowRest(false)}>
        <div className="flex flex-col">
          <InputText
            id="email-address"
            name="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="m-2"
          />
          <Button onClick={onRest} className="self-end m-2">Anfrage senden</Button>
        </div>
      </Dialog>
    </div>
  )
}

export default Login