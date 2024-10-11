import {
  PostAPI,
  PrintPossibleError,
  PrintPossibleErrorOrParseData,
} from "./api.ts";

export enum UserPermission {
  Admin,
  Verified,
  CheckAttended
}

export const HasPermission = (
  userId: number,
  permission: UserPermission,
  set: (val: boolean) => void,
) => {
  PostAPI<number>("/permissions/" + userId + "/has", permission, (response) => {
    PrintPossibleErrorOrParseData(response, set);
  });
}

export const SetPermission = (
  userId: number,
  permission: UserPermission,
  val: boolean,
  done?: () => void,
) => {
  if (val) {
    PostAPI<UserPermission>("/permissions/" + userId + "/add", permission, (response) => {
      PrintPossibleError(response, () => {});
      done && done();
    });
  } else {
    PostAPI<UserPermission>("/permissions/" + userId + "/remove", permission, (response) => {
      PrintPossibleError(response, () => {});
      done && done();
    });
  }
}
