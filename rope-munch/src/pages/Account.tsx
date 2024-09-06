import React, {useEffect, useRef, useState} from "react";
import {GetUserData, PostUserData, UserData} from "../api/user_data";
import {
  RoleOverview,
  UserFetlifeSetting,
  UserNameSetting,
  UserOpenSetting,
  UserQuestionSetting, UserRoleSetting,
  UserShowSetting
} from "../components/UserDataSettings";
import {Button} from "primereact/button";
import {Toast} from "primereact/toast";
import {UserEmail} from "../components/UserAuthData";


export const Account = ({userId, onSave}: {userId: number, onSave: () => void}) => {
  const [userData, setUserData] = useState<UserData | undefined>(undefined);
  const [nameValid, setNameValid] = useState<boolean>(true);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    GetUserData(userId, setUserData);

  }, [userId]);


  const on_save = () => {
    if (!nameValid) {
      errorPopup("Der Name / Nick darf nicht leer sein.");
      return;
    }

    PostUserData(userData!);
    onSave();
  }

  const errorPopup = (text: string) => {
    toast.current!.show({severity: 'error', summary: 'Error', detail: text, life: 3000});
  }

  if (!userData) {
    return <label>Loading</label>
  }

  return (
    <div className='flex justify-content-center'>
      <div style={{maxWidth: "70rem"}} className='flex flex-column m-2 w-full surface-0 border-round'>
        <Toast ref={toast}/>
        <div className="flex flex-column align-content-center text-l gap-2 mx-2">

          <div className='mt-6 text-3xl flex justify-content-center'>
            Nutzer Daten
          </div>

          <div className='mt-4 mb-2 text-lg'>
            <label className="mr-2">E-Mail:</label>
            <UserEmail user_id={userId}/>
          </div>


          <div className='mt-4 mb-2 text-lg'>
            Name
          </div>
          <UserNameSetting userData={userData} setUserData={setUserData} valid={nameValid} setValid={setNameValid}/>

          <div className='mt-4 mb-2 text-lg'>
            Fetlife Name
          </div>
          <UserFetlifeSetting userData={userData} setUserData={setUserData}/>


          <div className='mt-6 mb-2 text-xl'>
            Rolle & Erfahrung
          </div>
          <RoleOverview userData={userData}/>

          <div className='mt-6 mb-2 text-lg'>
            Rolle
          </div>
          <UserRoleSetting userData={userData} setUserData={setUserData}/>

          <UserOpenSetting userData={userData} setUserData={setUserData}/>
          <UserShowSetting userData={userData} setUserData={setUserData}/>
          <UserQuestionSetting userData={userData} setUserData={setUserData}/>

          <div className="m-2 flex justify-content-end">
            <Button className="text-xl" onClick={on_save}>Speichern</Button>
          </div>
        </div>
      </div>
    </div>)
}