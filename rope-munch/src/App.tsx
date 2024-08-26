import {useState} from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import {Account} from "./pages/Account";

enum Page {
  Main,
  Login,
  Signup,
  Account
}

const App = ({}) => {
  const [page, setPage] = useState<Page>(Page.Signup);
  const [userId, setUserId] = useState<number| undefined>()

  let content = <>
    <label>No Content activated!!!</label>
  </>

  switch (page) {
    case Page.Main:
      break
    case Page.Login: content = <Login
      OnLoggedIn={(id) => {
        setUserId(id);
        setPage(Page.Account)
      }}
    />
      break
    case Page.Signup: content = <Signup
      OnSignUp={(id) => {
        setUserId(id);
        setPage(Page.Main);
      }}
      ShowLogIn={() => setPage(Page.Login)}
    />
      break
    case Page.Account: content = <Account userId={userId}/>
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
