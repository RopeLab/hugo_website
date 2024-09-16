import {useEffect, useRef, useState} from "react";
import {GetUserData, PostUserData, UserData} from "../api/user_data";
import {
  RoleOverview,
  UserFetlifeSetting,
  UserNameSetting, UserNewSetting,
  UserOpenSetting,
  UserQuestionSetting, UserRoleSetting,
  UserShowSetting
} from "../components/UserDataSettings";
import {Button} from "primereact/button";
import {Toast} from "primereact/toast";
import {UserEmail} from "../components/UserAuthData";
import {Logout} from "../components/Logout.tsx";
import Loading from "../components/Loading.tsx";
import {FetlifeLink} from "../components/EventUserViews.tsx";


export const Account = ({userId, onSave, onLogout}: { userId: number, onSave: () => void , onLogout: () => void}) => {
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
    return <Loading/>
  }

  return (
    <div className='flex flex-col gap-2 items-stretch w-full text-left'>
      <Toast ref={toast}/>

      <div className="flex justify-end">
        <Logout OnLogout={onLogout}/>
      </div>

      <div className='flex flex-wrap mt-4 mb-2 text-lg'>
        <label className="mr-2">E-Mail:</label>
        <UserEmail user_id={userId}/>
      </div>


      <div className='mt-4 mb-2 text-lg'>
        Name / Nick
      </div>
      <UserNameSetting userData={userData} setUserData={setUserData} valid={nameValid} setValid={setNameValid}/>

      <div className='mt-4 mb-2 text-lg'>
        Fetlife Name
      </div>
      <UserFetlifeSetting userData={userData} setUserData={setUserData}/>

      {userData.fetlife_name != "" && <div className='mt-4 mb-2 text-lg'>
        Teste ob der Link funktioniert
      </div>}
      <FetlifeLink fetlife_name={userData.fetlife_name}/>

      <div className='mt-6 mb-2 text-xl'>
        Rolle
      </div>
      <RoleOverview userData={userData}/>
      <UserRoleSetting userData={userData} setUserData={setUserData}/>

      <UserOpenSetting userData={userData} setUserData={setUserData}/>
      <UserShowSetting userData={userData} setUserData={setUserData}/>
      <UserQuestionSetting userData={userData} setUserData={setUserData}/>

      <Button
        label="Speichern"
        className="self-end"
        onClick={on_save}/>
    </div>)
}

export const AdminAccount = ({userId, onSave}: { userId: number, onSave: () => void }) => {
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
    return <Loading/>
  }

  return (
    <div className='flex flex-col gap-2 items-stretch w-full text-left'>
      <Toast ref={toast}/>

      <div className='flex flex-wrap mt-4 mb-2 text-lg'>
        <label className="mr-2">E-Mail:</label>
        <UserEmail user_id={userId}/>
      </div>

      <UserNewSetting userData={userData} setUserData={setUserData} />

      <div className='mt-4 mb-2 text-lg'>
        Name / Nick
      </div>
      <UserNameSetting userData={userData} setUserData={setUserData} valid={nameValid} setValid={setNameValid}/>

      <div className='mt-4 mb-2 text-lg'>
        Fetlife Name
      </div>
      <UserFetlifeSetting userData={userData} setUserData={setUserData}/>

      {userData.fetlife_name != "" && <div className='mt-4 mb-2 text-lg'>
        Fetlife Link
      </div>}
      <FetlifeLink fetlife_name={userData.fetlife_name}/>

      <div className='mt-6 mb-2 text-xl'>
        Rolle
      </div>
      <UserRoleSetting userData={userData} setUserData={setUserData}/>

      <UserOpenSetting userData={userData} setUserData={setUserData}/>
      <UserShowSetting userData={userData} setUserData={setUserData}/>
      <UserQuestionSetting userData={userData} setUserData={setUserData}/>

      <Button
        label="Speichern"
        className="self-end"
        onClick={on_save}/>
    </div>)
}