import {ErrorMessage, GetAPIAndParse, PostAPI, ResponseToClass} from "./api";

export class UserData {
  "user_id": number
  "name": string
  "fetlife_name": string
  "experience_text": string
  "found_us_text": string
  "goal_text": string
  "role_factor": number
  "open": boolean
  "show_name": boolean
  "show_role": boolean
  "show_open": boolean
  "show_fetlife": boolean
  "new": boolean
}

export const PostUserData = (
  user_data: UserData
) => {
  PostAPI<UserData>("/user_data", user_data, (response) => {
    if (!response.ok) {
      ResponseToClass(response, (message: ErrorMessage) => {
        console.log("Post user data error: " + message.message);
      }, () => {
        console.log("No error message!!! This should never happen");
      });
    }
  });
}

export const GetUserData = (
  userId: number,
  setUserData: (userData: UserData) => void,
) => {
  GetAPIAndParse("/user_data/" + userId, setUserData);
}

export const GetUserDatas = (
    setUserDatas: (userDatas: UserData[]) => void,
) => {
  GetAPIAndParse("/user_data/all", setUserDatas);
}