import {UserData} from "../api/user_data";
import {ProgressBar} from "primereact/progressbar";
import {GetActiveLevelFromPercent, GetPassiveLevelFromPercent, GetRoleFromPercent} from "../api/data";
import {Slider} from "primereact/slider";
import {Tag} from "primereact/tag";
import React from "react";
import {InputText} from "primereact/inputtext";
import {InputTextarea} from "primereact/inputtextarea";
import {Checkbox} from "primereact/checkbox";


export const UserNameSetting = ({userData, setUserData, valid, setValid}: {userData: UserData, setUserData: (userData: UserData) => void, valid: boolean, setValid: (valid: boolean) => void} ) => {
  return <InputText
    type="text"
    value={userData.name}
    onChange={(e) => {
      setValid(e.target.value !== "");
      setUserData({...userData, name: e.target.value});
    }}
    required
    placeholder="Name / Nick"
    className='w-full'
    invalid={!valid}
  />
}

export const UserFetlifeSetting = ({userData, setUserData}: {userData: UserData, setUserData: (userData: UserData) => void}) => {
  return <InputText
    type="text"
    value={userData.fetlife_name}
    onChange={(e) => setUserData({...userData, fetlife_name: e.target.value})}
    required
    placeholder="Fetlife Name"
    className='w-full'
  />
}

export const UserQuestionSetting = ({userData, setUserData}: {userData: UserData, setUserData: (userData: UserData) => void}) => {
  return <>
    <div className='mt-4 mb-2 text-lg'>
      Wie hast du vom Rope Lab erfahren?
    </div>
    <InputTextarea
      value={userData.found_us_text}
      onChange={(e) => setUserData({...userData, found_us_text: e.target.value})}
      placeholder="Ich habe euch ..."
      rows={5}
      className='w-full'
    />

    <div className='mt-4 mb-2 text-lg'>
      Wie viel Erfahrung hast du mit Seilen?
    </div>
    <InputTextarea
      value={userData.experience_text}
      onChange={(e) => setUserData({...userData, experience_text: e.target.value})}
      placeholder="Ich habe ..."
      rows={5}
      className='w-full'
    />

    <div className='mt-4 mb-2 text-lg'>
      Wenn du nach dem Event nach Hause gehst, was wünschst du dir getan, geschafft oder gelernt zu haben?
    </div>
    <InputTextarea
      value={userData.goal_text}
      onChange={(e) => setUserData({...userData, goal_text: e.target.value})}
      placeholder="Ich erhoffe mir vom Rope Lab ..."
      rows={5}
      className='w-full'
    />
  </>
}

export const UserRoleSetting = ({userData, setUserData}: {
  userData: UserData,
  setUserData: (userData: UserData) => void
}) => {
  return <Slider
    value={userData.role_factor}
    onChange={(e) => setUserData({...userData, role_factor: e.value as number})}
    className='mx-2'
  />
}

export const UserActiveSetting = ({userData, setUserData}: {
  userData: UserData,
  setUserData: (userData: UserData) => void
}) => {
  return <Slider
      value={userData.active_factor}
      onChange={(e) => setUserData({...userData, active_factor: e.value as number})}
      className='mx-2'
    />
}

export const UserPassiveSetting = ({userData, setUserData}: {
  userData: UserData,
  setUserData: (userData: UserData) => void
}) => {
  return <Slider
    value={userData.passive_factor}
    onChange={(e) => setUserData({...userData, passive_factor: e.value as number})}
    className='mx-2'
  />
}

export const UserRoleSettingDescriptive = ({userData, setUserData}: {
  userData: UserData,
  setUserData: (userData: UserData) => void
}) => {
  return <>
    <div className='mt-6 mb-2 text-xl'>
      Zu wie viele Prozent siehts du dich als Rope Top? (Deine Rolle)
    </div>
    <div className='mt-2 mb-3'>
      Darstellung:
      <ProgressBar
        className="bg-indigo-300 mt-1 mb-4"
        style={{height: '12px'}}
        displayValueTemplate={() => ""}
        value={userData.role_factor}
      />

      {GetRoleFromPercent(userData.role_factor).name}
    </div>
    <UserRoleSetting userData={userData} setUserData={setUserData} />

    <div className='mt-6 mb-2 text-xl'>
      Wie gut kannst du fesseln?
    </div>
    <div className='mt-2 mb-3'>
      Darstellung:
      <ProgressBar
        className="mt-1 mb-4"
        style={{height: '12px'}}
        displayValueTemplate={() => ""}
        value={userData.active_factor}
      />

      {GetActiveLevelFromPercent(userData.active_factor).name}
    </div>
    <UserActiveSetting userData={userData} setUserData={setUserData} />

    <div className='mt-6 mb-2 text-xl'>
      Wie viel Erfahrung hast du im gefesselt werden?
    </div>
    <div className='mt-2 mb-3'>
      Darstellung:
      <ProgressBar
        className="bg-indigo-300 mt-1 mb-4"
        style={{height: '12px'}}
        color="#dee2e6"
        displayValueTemplate={() => ""}
        value={100 - userData.passive_factor}
      />

      {GetPassiveLevelFromPercent(userData.passive_factor).name}
    </div>
    <UserPassiveSetting userData={userData} setUserData={setUserData} />

    <div className='mt-6 mb-2 text-xl'>
      Zusammen gesetzte Darstellung:
    </div>

    <RoleOverview userData={userData}/>

  </>
}

export const RoleOverview = ({userData}: {userData: UserData}) => {
  return <div className="w-full flex flex-column">
    <label className="my-1">Rolle: {GetRoleFromPercent(userData.role_factor).name}</label>
    <ProgressBar
      className="w-full bg-indigo-300"
      style={{height: '12px'}}
      displayValueTemplate={() => ""}
      value={userData.role_factor}
    />
    <div className="w-full flex mt-1">
      <ProgressBar
        className="flex-grow-1 mr-1"
        style={{height: '7px'}}
        displayValueTemplate={() => ""}
        value={userData.active_factor}
      />
      <ProgressBar
        className="flex-grow-1 bg-indigo-300"
        style={{height: '7px'}}
        color="#dee2e6"
        displayValueTemplate={() => ""}
        value={100 - userData.passive_factor}
      />
    </div>
    <div className="w-full flex mt-1">
      <Tag value={GetActiveLevelFromPercent(userData.active_factor).name}/>
      <div className="flex-grow-1 mx-1"/>
      <Tag value={GetPassiveLevelFromPercent(userData.passive_factor).name} className='bg-indigo-300'/>
    </div>
  </div>
}


export const UserOpenSetting = ({userData, setUserData}: {userData: UserData, setUserData: (userData: UserData) => void}) => {
  return <>
    <div className='mt-6 mb-2 text-xl'>
      Hast Interesse mit neuen Personen zu fesseln?
    </div>
    <div>
      <label className='mr-2 text-xl'>Ja:</label>
      <Checkbox
        onChange={e => {
          setUserData({...userData, open: e.checked!})
          if (!e) {
            setUserData({...userData, show_open: false})
          }
        }}
        checked={userData.open}/>
    </div>
  </>
}

export const UserShowSetting = ({userData, setUserData}: {userData: UserData, setUserData: (userData: UserData) => void}) => {
  return <>
    <div className='my-4 text-xl'>
      Hier kannst du einstellen was andere Teilnehmer sehen können.
    </div>

    <div className="field grid">
      <label className="col-fixed w-10rem">Namen / Nick:</label>
      <Checkbox
        onChange={e => setUserData({...userData, show_name: e.checked!})}
        checked={userData.show_name}
        className='col'/>
    </div>

    <div className="field grid">
      <label className="col-fixed w-10rem">Rolle:</label>
      <Checkbox
        onChange={e => setUserData({...userData, show_role: e.checked!})}
        checked={userData.show_role}
        className='col'/>
    </div>

    <div className="field grid">
      <label className="col-fixed w-10rem">Erfahrung:</label>
      <Checkbox
        onChange={e => setUserData({...userData, show_experience: e.checked!})}
        checked={userData.show_experience}
        className='col'/>
    </div>

    {userData.open ?
      <div className="field grid">
        <label className="col-fixed w-10rem">Mit neuen Personen zu fesseln:</label>
        <Checkbox
          onChange={e => setUserData({...userData, show_open: e.checked!})}
          checked={userData.show_open}
          className='col'/>
      </div> : <></>}
  </>
}