import {Button} from "primereact/button";
import {PostLogout} from "../api/auth.ts";

export const Logout = ({OnLogout}: {OnLogout: () => void}) => {
  return <Button label="Ausloggen" onClick={() => {
    PostLogout(OnLogout)
  }} />
}