import { MenuItem } from "primereact/menuitem";
import { Menu } from 'primereact/menu';
import {Button} from "primereact/button";
import  {useRef, useState} from "react";
import {PostLogout} from "../api/auth";
import {Page} from "../entry_points";


const Menue = ({setPage, onLoggedOut}: {setPage: (page: Page) => void, onLoggedOut: () => void}) => {

  const [admin, setAdmin] = useState<boolean>(true)

  const menu = useRef(null);
  let items: MenuItem[] = [
    {
      label: 'Profil',
      icon: 'pi pi-user',
      command: () => setPage(Page.Account)
    },
    {
      label: 'Ausloggen',
      icon: 'pi pi-sign-out',
      command: () => PostLogout(onLoggedOut)
    },
  ];

  if (admin) {
    items.push(...[
      {
        label: 'Admin',
        items: [
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
        ]
      },
    ])
  }

  return <div>
    <Menu model={items} popup ref={menu} />
    <Button icon="pi pi-bars" rounded className='m-2' onClick={(e) => {
      // @ts-ignore
      menu.current.toggle(e)
    }} />
  </div>
}

export default Menue