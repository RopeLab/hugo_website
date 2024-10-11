import {useEffect, useState} from "react";
import {GetUserDatas, UserData} from "../api/user_data";
import { Accordion, AccordionTab } from 'primereact/accordion';
import {Button} from "primereact/button";
import {AdminAccount} from "./Account.tsx";
import {UserActionView} from "../components/UserAction"
import {PermissionSettings} from "../components/PermissionSettings.tsx";

const AdminUsers = ({back}: {back: () => void}) => {
  const [userDatas, setUserDatas] = useState<UserData[]>([]);

  const loadUsers = () => {
    GetUserDatas(setUserDatas);
  }
  useEffect(() => {
    loadUsers()
  }, []);


  const createTabs = () => {
    return userDatas.map((userData) => {

      const header = userData.name + (userData.new ? " - new" : "")
      return (
          <AccordionTab key={userData.user_id} header={header}>
              <AdminAccount userId={userData.user_id} onSave={loadUsers}/>
              <PermissionSettings user_id={userData.user_id} />
              <UserActionView user_id={userData.user_id}/>
          </AccordionTab>
      );
    });
  };

    return (
      <div className="w-full flex flex-col gap-2">
        <Button label="Zurück" onClick={back} className="self-start"/>
        <Accordion>{createTabs()}</Accordion>
      </div>
  )
}

export default AdminUsers