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

export const PostLogin = (email: string, password: string, OnLoggedIn: (id: number) => void, OnErr: (text: string) => void) => {
  PostAPI<Credentials>("/login", {
    "email": email,
    "password": password,
  }, (r) => {
    if (!r.ok) {
      ResponseToClass(r, (message: ErrorMessage) => {
        OnErr(message.message)
      }, () => {
        console.log("Failed to parse error!!! This should never happen");
      });
      return;
    }

    ResponseToClass(r, (id: number) => {
      OnLoggedIn(id);
    }, () => {
      console.log("Failed to parse user id!!! This should never happen");
    });
  });
}

export const PostLogout = (OnLoggedOut: () => void) => {
  PostAPIWithoutContent("/logout",(_) => {
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
      PostLogin(email, password, OnSignedUp, () => {
        console.log("Could not login after signup!!! This should never happen");
      });
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
    set: (val: string) => void,
) => {
  GetAPIAndParse("/user/" + userId + "/email", set);
}

export const PostRemoveUser = (
  user_id: number,
  onDone: () => void,
) => {
  PostAPIWithoutContent("/user/" + user_id + "/remove", (response) => {
    if (!response.ok) {
      ResponseToClass(response, (message: ErrorMessage) => {
        console.log("Remove user error: " + message.message);
      }, () => {
        console.log("No error message!!! This should never happen");
      });
    }

    onDone();
  });
}