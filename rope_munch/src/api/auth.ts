import {
  ErrorMessage,
  GetAPI, GetAPIAndParse,
  PostAPI,
  PostAPIWithoutContent,
  ResponseToClass
} from "./api";

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
  PostAPIWithoutContent("/logout",(_) => {
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

export const GetUserId = (
  setUserId: (id: number) => void,
  onErr: () => void
) => {
  GetAPI("/user/id", (response) => {
    if (!response.ok) {
      onErr();
    } else {
      ResponseToClass(response, setUserId, () => {
        console.log("UserId did not match!!! This should never happen");
      });
    }
  });
}

export const GetEmail = (
    userId: number,
    setEmail: (email: string) => void,
) => {
  GetAPIAndParse("/user/" + userId + "/email", setEmail);
}