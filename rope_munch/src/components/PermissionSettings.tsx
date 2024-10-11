import {Checkbox} from "primereact/checkbox";
import Loading from "./Loading.tsx";

export const PermissionSettings = ({name, value, set}: {name: string, value: boolean | undefined, set: (b: boolean) => void}) => {
  return (<div className="flex items-center justify-between sm:justify-start mr-6">
    <label className="sm:w-64 m-2">{name}:</label>

    {value != undefined ?
      <Checkbox
        onChange={e => {
          set(e.checked!);
        }}
        checked={value!}/> :
      <Loading/>}
  </div>)

}