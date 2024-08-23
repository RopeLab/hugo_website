import {useState} from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

enum Page {
  Main,
  Login,
  Signup,
}

const App = ({}) => {
  const [page, SetPage] = useState<Page>(Page.Signup);

  let content = <>
    <label>No Content activated!!!</label>
  </>

  switch (page) {
    case Page.Main:
      break
    case Page.Login: content = <Login
      OnLoggedIn={() => SetPage(Page.Main)}
    />
      break
    case Page.Signup: content = <Signup
      OnSignUp={() => SetPage(Page.Main)
      }
      ShowLogIn={() => SetPage(Page.Login)}
    />
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
