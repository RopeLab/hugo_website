import {useEffect, useRef, useState} from "react";
import {GetUserData, GetUserDatas, PostUserData, UserData} from "../api/user_data";
import { Accordion, AccordionTab } from 'primereact/accordion';
import {Button} from "primereact/button";
import {UserActionView} from "../components/UserAction"
import {PermissionSettings} from "../components/PermissionSettings.tsx";
import {Toast} from "primereact/toast";
import Loading from "../components/Loading.tsx";
import {UserEmail} from "../components/UserAuthData.tsx";
import {
  UserFetlifeSetting,
  UserNameSetting,
  UserNewSetting,
  UserOpenSetting, UserQuestionSetting,
  UserRoleSetting, UserShowSetting
} from "../components/UserDataSettings.tsx";
import {FetlifeLink} from "../components/EventUserViews.tsx";
import {confirmPopup, ConfirmPopup} from "primereact/confirmpopup";
import {PostRemoveUser} from "../api/auth.ts";
import {HasPermission, SetPermission, UserPermission} from "../api/permissions.ts";


const AdminAccount = ({userId, onSave}: { userId: number, onSave: () => void }) => {
  const [userData, setUserData] = useState<UserData | undefined>(undefined);
  const [admin, setAdmin] = useState<boolean | undefined>(undefined);
  const [verified, setVerified] = useState<boolean | undefined>(undefined);
  const [check_attended, setCheckAttended] = useState<boolean | undefined>(undefined);

  const [nameValid, setNameValid] = useState<boolean>(true);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    GetUserData(userId, setUserData);
    HasPermission(userId, UserPermission.Admin, setAdmin);
    HasPermission(userId, UserPermission.Verified, setVerified);
    HasPermission(userId, UserPermission.CheckAttended, setCheckAttended);
  }, [userId]);


  const on_save = () => {
    if (!nameValid) {
      errorPopup("Der Name / Nick darf nicht leer sein.");
      return;
    }

    PostUserData(userData!);
    SetPermission(userId, UserPermission.Admin, admin!);
    SetPermission(userId, UserPermission.Verified, verified!);
    SetPermission(userId, UserPermission.CheckAttended, check_attended!);
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

      <UserNewSetting userData={userData} setUserData={setUserData}/>
      <PermissionSettings name={"Verifiziert"} value={verified} set={setVerified}/>

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

      <div className='mt-6 mb-2 text-xl'>
        Statistik
      </div>
      <UserActionView user_id={userData.user_id}/>

      <div className='mt-6 mb-2 text-xl'>
        Orga Rechte
      </div>
      <PermissionSettings name={"Admin"} value={admin} set={setAdmin}/>
      <PermissionSettings name={"Anwensendheit"} value={check_attended} set={setCheckAttended}/>

      <div className="flex">
        <ConfirmPopup/>
        <Button severity="danger" onClick={(e) => {
          confirmPopup({
            target: e.currentTarget,
            message: 'Willst du wirklich alle Daten zu diesem Nutzer löschen?',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            accept: () => {
              PostRemoveUser(userId, onSave)
            },
          });
        }}>Löschen</Button>

        <div className="grow"/>
        <Button
          label="Speichern"
          className="self-end"
          onClick={on_save}/>
      </div>

    </div>)
}

const AdminUsers = ({back}: { back: () => void }) => {
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