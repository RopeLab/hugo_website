import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';
import { PrimeReactProvider } from 'primereact/api';
import Tailwind from 'primereact/passthrough/tailwind';

import '../output.css'
import {Account} from "../pages/Account.tsx";
import {GetUserId} from "../api/auth.ts";
import Login from "../pages/Login.tsx";

const App = ({}) => {
  const [user_id, setUserId] = useState<number | undefined | "not_logged_in">();
  useEffect(() => {
    GetUserId(setUserId, () => setUserId("not_logged_in"))
  }, [])

  return <>
    {user_id ?
      <> {user_id != "not_logged_in" ?
        <Account
          userId={user_id}
          onSave={() => {}}
          onLogout={() => setUserId("not_logged_in")}
        /> :
        <Login OnLoggedIn={setUserId}/>
      } </>:
      <label>Loading</label>
    }
  </>
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <PrimeReactProvider value={{ unstyled: true, pt: Tailwind }}>
      <App/>
    </PrimeReactProvider>
  </React.StrictMode>
);


