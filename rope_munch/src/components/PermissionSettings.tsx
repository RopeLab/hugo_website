import {useEffect, useState} from "react";
import {HasPermission, SetPermission, UserPermission} from "../api/permissions.ts";
import {Checkbox} from "primereact/checkbox";
import Loading from "./Loading.tsx";

export const PermissionSettings = ({user_id}: {user_id: number}) => {
  const [admin, setAdmin] = useState<boolean | undefined>(undefined);
  const [verified, setVerified] = useState<boolean | undefined>(undefined);
  const [check_attended, setCheckAttended] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    HasPermission(user_id, UserPermission.Admin, setAdmin);
    HasPermission(user_id, UserPermission.Verified, setVerified);
    HasPermission(user_id, UserPermission.Admin, setCheckAttended);
  }, []);


  return (<>
    <div className="flex items-center justify-between sm:justify-start mr-6">
      <label className="sm:w-64 m-2">Admin:</label>

      {admin != undefined ?
        <Checkbox
          onChange={e => {
            SetPermission(user_id, UserPermission.Admin, e.checked!);
            setAdmin(e.checked!);
          }}
          checked={admin!}/> :
        <Loading/>}
    </div>

    <div className="flex items-center justify-between sm:justify-start mr-6">
      <label className="sm:w-64 m-2">Verifiziert:</label>

      {verified != undefined ?
        <Checkbox
          onChange={e => {
            SetPermission(user_id, UserPermission.Verified, e.checked!);
            setVerified(e.checked!);
          }}
          checked={verified!}/> :
        <Loading/>}
    </div>

    <div className="flex items-center justify-between sm:justify-start mr-6">
      <label className="sm:w-64 m-2">Admin:</label>

      {check_attended != undefined ?
        <Checkbox
          onChange={e => {
            SetPermission(user_id, UserPermission.CheckAttended, e.checked!);
            setCheckAttended(e.checked!);
          }}
          checked={check_attended!}/> :
        <Loading/>}
    </div>
  </>)

}