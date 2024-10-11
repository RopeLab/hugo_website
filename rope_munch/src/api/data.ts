
export class Role {
  constructor(
    public severity: "success" | "info" | "danger" | "warning",
    public name: string,
    public from: number,
    public id: number,
    public to: number,
  ) {
  }
}

const roles: Role[] = [
  { name: 'absolut Rope Top',         severity: "success",  id: 0, from: 100, to: 90 },
  { name: 'Rope Top',                 severity: "success",  id: 1, from: 90,  to: 80 },
  { name: 'Eher Rope Top',            severity: "success",  id: 2, from: 80,  to: 70 },
  { name: 'Top leaning Switch',       severity: "info",     id: 3, from: 70,  to: 55 },
  { name: 'Switch',                   severity: "info",     id: 4, from: 55,  to: 45 },
  { name: 'Bottom leaning Switch',    severity: "info",     id: 5, from: 45,  to: 30 },
  { name: 'Eher Rope Bottom',         severity: "danger",   id: 6, from: 30,  to: 20 },
  { name: 'Rope Bottom',              severity: "danger",   id: 7, from: 20,  to: 10 },
  { name: 'absolut Rope Bottom',      severity: "danger",   id: 8, from: 10,  to: -1 },
];

export const GetRoleFromPercent = (rolePercent: number) => {
  for (let i in roles){
    if (roles[i].from >= rolePercent && roles[i].to < rolePercent){
      return roles[i];
    }
  }
  return roles[8];
}