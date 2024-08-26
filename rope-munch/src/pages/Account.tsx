import React, {useEffect, useRef, useState} from "react";
import {GetUserData, PostUserData, UserData} from "../api/user_data";
import {
  RoleOverview,
  UserActiveSetting,
  UserFetlifeSetting,
  UserNameSetting,
  UserOpenSetting, UserPassiveSetting,
  UserQuestionSetting, UserRoleSetting,
  UserRoleSettingDescriptive,
  UserShowSetting
} from "../components/UserDataSettings";
import {Button} from "primereact/button";
import {Toast} from "primereact/toast";


export const Account = ({userId}: {userId: number | undefined}) => {
  const [userData, setUserData] = useState<UserData | undefined>(undefined);
  const [nameValid, setNameValid] = useState<boolean>(true);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    if (!userId) {
      setUserData(undefined);
      return
    }

    GetUserData(userId, setUserData);

  }, [userId]);


  const onSave = () => {
    if (!nameValid) {
      errorPopup("Der Name / Nick darf nicht leer sein.");
      return;
    }

    PostUserData(userData!)
  }

  const errorPopup = (text: string) => {
    toast.current!.show({severity: 'error', summary: 'Error', detail: text, life: 3000});
  }

  if (!userData) {
    return <><label>Loading</label></>
  }

  return (
    <div className='flex justify-content-center'>
      <div style={{maxWidth: "70rem"}} className='flex flex-column m-2 w-full surface-0 border-round'>
        <Toast ref={toast}/>
        <div className="flex flex-column align-content-center text-l gap-2 mx-2">

          <div className='mt-6 mb-2 text-lg'>
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

          <div className='mt-6 mb-2 text-lg'>
            Aktiv
          </div>
          <UserActiveSetting userData={userData} setUserData={setUserData}/>

          <div className='mt-6 mb-2 text-lg'>
            Passiv
          </div>
          <UserPassiveSetting userData={userData} setUserData={setUserData}/>

          <UserOpenSetting userData={userData} setUserData={setUserData}/>
          <UserShowSetting userData={userData} setUserData={setUserData}/>
          <UserQuestionSetting userData={userData} setUserData={setUserData}/>

          <div className="m-2 flex justify-content-end">
            <Button className="text-xl" onClick={onSave}>Speichern</Button>
          </div>
        </div>
      </div>
    </div>)
}