import {GetAPIAndParse} from "./api.ts";

export const GetPossibleWorkshops = (
  set: (workshops: string[]) => void,
) => {
  GetAPIAndParse("/possible_workshops", set);
}