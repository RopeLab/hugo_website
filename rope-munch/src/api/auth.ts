import Cookies from 'universal-cookie';
import {ErrorMessage, GetAPI, PostAPI, PostAPIWithoutContent, ResponseToClass} from "./api";

class Credentials {
  "email": string
  "password": string
}

export const PostLogin = (email: string, password: string, OnLoggedIn: (id: number) => void) => {
  PostAPI<Credentials>("/login", {
    "email": email,
    "password": password,
  }, (r) => {
    ResponseToClass(r, (id: number) => {
      console.log("Logged in: " + id);

      OnLoggedIn(id);
    }, () => {
      console.log("Login error");
    });
  });
}

export const PostLogout = (OnLoggedOut: () => void) => {
  PostAPIWithoutContent("/logout",(r) => {
    console.log("Logged out");
    OnLoggedOut();
  });
}

export const PostSignUp = (
  email: string,
  password: string,
  OnSignedUp: (id: number) => void,
  OnEmailUsed: () => void,
  OnErr: () => void
) => {
  PostAPI<Credentials>("/signup", {
    "email": email,
    "password": password,
  }, (response) => {
    if (!response.ok) {
      ResponseToClass(response, (message: ErrorMessage) => {
        if (message.message == "EmailUsed") {
          OnEmailUsed();
        } else {
          OnErr();
        }
      }, () => {
        console.log("No error message!!! This should never happen");
      });
    } else {
      console.log("Signed up");
      PostLogin(email, password, OnSignedUp);
    }
  });
}

export const GetEmail = (
    userId: number,
    setEmail: (email: string) => void,
) => {
  GetAPI("/user/" + userId + "/email", (response) => {
    if (!response.ok) {
      ResponseToClass(response, (message: ErrorMessage) => {
        console.log("Get email error: " + message.message);
      }, () => {
        console.log("No error message!!! This should never happen");
      });
    } else {
      ResponseToClass(response, setEmail, () => {
        console.log("Email did not match!!! This should never happen");
      });
    }
  });
}