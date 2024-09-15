import {useEffect, useState} from "react";
import {GetEmail} from "../api/auth";
import Loading from "./Loading.tsx";


export const UserEmail = ({user_id}: {user_id: number}) => {
    const [email, setEmail] = useState<string | undefined>()

    useEffect(() => {
        GetEmail(user_id, setEmail);
    }, []);

    if (!email) {
        return <Loading/>
    }

    return <label>{email}</label>
}