import React, {useEffect, useState} from "react";
import {GetUserDatas, UserData} from "../api/user_data";
import { Accordion, AccordionTab } from 'primereact/accordion';
import {Button} from "primereact/button";
import {Account} from "./Account";

const AdminUsers = ({back}: {back: () => void}) => {
  const [userDatas, setUserDatas] = useState<UserData[]>([]);

  const loadUsers = () => {
    GetUserDatas(setUserDatas);
  }
  useEffect(() => {
    loadUsers()
  }, []);


  const createTabs = () => {
    return userDatas.map((userData, i) => {

      const header = userData.name + (userData.new ? " - new" : "")
      return (
          <AccordionTab key={userData.user_id} header={header}>
              <Account userId={userData.user_id} onSave={loadUsers}/>
          </AccordionTab>
      );
    });
  };

    return (
        <div className="card">
        <Button label={"Back"} onClick={back}/>
        <Accordion>{createTabs()}</Accordion>
      </div>
  )
}

export default AdminUsers