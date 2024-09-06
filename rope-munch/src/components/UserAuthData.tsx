import React, {useEffect, useState} from "react";
import {GetEmail} from "../api/auth";


export const UserEmail = ({user_id}: {user_id: number}) => {
    const [email, setEmail] = useState<string | undefined>()

    useEffect(() => {
        GetEmail(user_id, setEmail);
    }, []);

    if (!email) {
        return <label>Loading Email ...</label>
    }

    return <label>{email}</label>
}