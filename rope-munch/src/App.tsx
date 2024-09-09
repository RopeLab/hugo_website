import React, {useState} from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import {Account} from "./pages/Account";
import AdminUsers from "./pages/AdminUsers";
import AdminEvents from "./pages/AdminEvents";
import {Events} from "./pages/Events";

enum Page {
  Events,
  Login,
  Signup,
  Account,
  AdminUsers,
  AdminEvents,

}

const App = ({}) => {
  const [page, setPage] = useState<Page>(Page.Signup);
  const [userId, setUserId] = useState<number| undefined>()

  let content = <>
    <label>No Content activated!!!</label>
  </>

  switch (page) {
    case Page.Events:
      content = <Events userId={userId}/>
      break
    case Page.Login: content = <Login
      OnLoggedIn={(id) => {
        setUserId(id);
        setPage(Page.Events)
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
    case Page.Account: content = <Account userId={userId!} onSave={() => {}}/>
      break
    case Page.AdminUsers: content = <AdminUsers back={() => {setPage(Page.Account)}}/>
      break
    case Page.AdminEvents: content = <AdminEvents back={() => {setPage(Page.Account)}}/>
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
