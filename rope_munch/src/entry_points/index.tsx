import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';
import { PrimeReactProvider } from 'primereact/api';
import Tailwind from 'primereact/passthrough/tailwind';
import '../output.css'


import {Events} from "../pages/Events.tsx";
import Login from "../pages/Login.tsx";
import Signup from "../pages/Signup.tsx";
import AdminUsers from "../pages/AdminUsers.tsx";
import AdminEvents from "../pages/AdminEvents.tsx";
import {GetUserId} from "../api/auth.ts";

export enum Page {
  Events,
  Login,
  Signup,
  AdminUsers,
  AdminEvents,
}

const App = ({}) => {
  const [page, setPage] = useState<Page>(Page.Events);
  const [user_id, setUserId] = useState<number| undefined>();
  const [register_to_event_id, setRegisterToEventId] = useState<number| undefined>();

  useEffect(() => {
    GetUserId(setUserId, () => setUserId(undefined))
  }, [])

  let content = <>
    <label>No Content activated!!!</label>
  </>

  switch (page) {
    case Page.Events:
      content = <Events
        user_id={user_id}
        registerToEvent={(event_id) => {
          setRegisterToEventId(event_id);
          setPage(Page.Signup);
        }}
        setPage={setPage}
        onLoggedOut={() => setUserId(undefined)}/>
      break
    case Page.Login: content = <Login
      OnLoggedIn={(id) => {
        setUserId(id);
        setPage(Page.Events);
      }}
    />
      break
    case Page.Signup: content = <Signup
      OnSignUp={(id) => {
        setUserId(id);
        setPage(Page.Events);
      }}
      ShowLogIn={() => setPage(Page.Login)}
    />
      break
    case Page.AdminUsers: content = <AdminUsers back={() => {setPage(Page.Events)}}/>
      break
    case Page.AdminEvents: content = <AdminEvents back={() => {setPage(Page.Events)}}/>
      break
  }

  return <div className='w-full flex flex-col items-center'>
    {content}
  </div>
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <PrimeReactProvider value={{ unstyled: true, pt: Tailwind }}>
      <App />
    </PrimeReactProvider>
  </React.StrictMode>
);


