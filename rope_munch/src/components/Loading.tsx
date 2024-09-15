
import { ProgressSpinner } from 'primereact/progressspinner';
import {useEffect, useState} from "react";

export default function Loading() {
  const [show, setShow] = useState<boolean>(false)

  useEffect(() => {
    setTimeout(() => {
      setShow(true)
    }, 1000);
  }, [])

  return (
    <div className="flex justify-content-center">
      {show && <ProgressSpinner/>}
    </div>
  );
}