import { MenuItem } from "primereact/menuitem";
import { Menu } from 'primereact/menu';
import {Button} from "primereact/button";
import  {useRef, useState} from "react";
import {Page} from "../entry_points";


const AdminMenue = ({setPage}: {setPage: (page: Page) => void}) => {

  const [admin, setAdmin] = useState<boolean>(true)

  const menu = useRef(null);
  let items: MenuItem[] = [
    {
      label: 'Users',
      icon: 'pi pi-users',
      command: () => setPage(Page.AdminUsers)
    },
    {
      label: 'Events',
      icon: 'pi pi-calendar',
      command: () => setPage(Page.AdminEvents)
    }
  ];

  return <>
    {admin ?
      <>
        <Menu model={items} popup ref={menu} />
        <Button label={"Admin"} onClick={(e) => {
          // @ts-ignore
          menu.current.toggle(e)
        }} />
      </> :
      <></>}
  </>
}

export default AdminMenue