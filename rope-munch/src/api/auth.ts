import Cookies from 'universal-cookie';
import {ErrorMessage, PostAPI, ResponseToClass} from "./api";

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

      const cookies = new Cookies();
      cookies.set('myCat', 'Pacman', { path: '/' });
      console.log(cookies.get('myCat')); // Pacman

      OnLoggedIn(id);
    }, () => {
      console.log("Login error");
    });
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