import React, {useState} from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import {Account, AccountPage} from "./pages/Account";
import AdminUsers from "./pages/AdminUsers";
import AdminEvents from "./pages/AdminEvents";
import {Events} from "./pages/Events";
import {PostLogout} from "./api/auth";

export enum Page {
  Events,
  Login,
  Signup,
  Account,
  AdminUsers,
  AdminEvents,

}

const App = ({}) => {
  const [page, setPage] = useState<Page>(Page.Events);
  const [user_id, setUserId] = useState<number| undefined>();
  const [register_to_event_id, setRegisterToEventId] = useState<number| undefined>();

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
    case Page.Account: content = <AccountPage userId={user_id!} back={() => setPage(Page.Events)}/>
      break
    case Page.AdminUsers: content = <AdminUsers back={() => {setPage(Page.Events)}}/>
      break
    case Page.AdminEvents: content = <AdminEvents back={() => {setPage(Page.Events)}}/>
      break
  }

  return <div className='w-full' style={{
    backgroundImage: "url('background.jpg')",
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "repeat",
    minHeight: "100vh",
  }}>
    {content}
  </div>
}

export default App;
