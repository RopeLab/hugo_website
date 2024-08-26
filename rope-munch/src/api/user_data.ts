import {ErrorMessage, GetAPI, PostAPI, ResponseToClass} from "./api";
import {PostLogin} from "./auth";

export class UserData {
  "user_id": number
  "name": string
  "fetlife_name": string
  "experience_text": string
  "found_us_text": string
  "goal_text": string
  "role_factor": number
  "active_factor": number
  "passive_factor": number
  "open": boolean
  "show_name": boolean
  "show_role": boolean
  "show_experience": boolean
  "show_open": boolean
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
  GetAPI("/user_data/" + userId, (response) => {
    if (!response.ok) {
      ResponseToClass(response, (message: ErrorMessage) => {
        console.log("Post user data error: " + message.message);
      }, () => {
        console.log("No error message!!! This should never happen");
      });
    } else {
      ResponseToClass(response, setUserData, () => {
        console.log("UserData did not match!!! This should never happen");
      });
    }
  });
}