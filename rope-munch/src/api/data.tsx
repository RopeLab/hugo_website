
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


const GetRoleId = (role: Role) => {
  for (let i in roles){
    if (roles[i] === role){
      return i;
    }
  }
}


class ActiveLevel {
  constructor(
    public severity: "success" | "info" | "danger" | "warning",
    public name: string,
    public from: number,
    public id: number,
    public to: number,
  ) {}
}

const activeLevels: ActiveLevel[] = [
  { name: 'Ich fessele seit vielen Jahren und verfeiner meine Technik.', severity: "success",  id: 0, from: 100, to: 90 },
  { name: 'Ich übe Transitions und dynamische Suspensions.',             severity: "success",  id: 1, from: 90,  to: 80 },
  { name: 'Ich bin sicher im Floorwork und übe Susepensions.',           severity: "success",  id: 2, from: 80,  to: 70 },
  { name: 'Ich habe schonmal jemanden Suspended.',                       severity: "success",  id: 3, from: 70,  to: 55 },
  { name: 'Ich kann einen TK.',                                          severity: "warning",  id: 4, from: 55,  to: 45 },
  { name: 'Ich kann einen Hogtie.',                                      severity: "warning",  id: 5, from: 45,  to: 30 },
  { name: 'Ich kann einen Single-Collum-Tie.',                           severity: "warning",  id: 6, from: 30,  to: 20 },
  { name: 'Ich habe mal fesseln ausprobiert.',                           severity: "danger",   id: 7, from: 20,  to: 10 },
  { name: 'Ich habe noch nie ein Seil in der Hand gehabt.',              severity: "danger",   id: 8, from: 10,  to: -1 },
];

export const GetActiveLevelFromPercent = (aktivePercent: number) => {
  for (let i in activeLevels){
    if (activeLevels[i].from >= aktivePercent && activeLevels[i].to < aktivePercent){
      return activeLevels[i];
    }
  }
  return activeLevels[8];
}


class PassiveLevel {
  constructor(
    public severity: "success" | "info" | "danger" | "warning",
    public name: string,
    public from: number,
    public id: number,
    public to: number,
  ) {}
}

const passiveLevels: PassiveLevel[] = [
  { name: 'Ich habe war schon in allen möglichen Fesselungen / Styles.',                severity: "success", id: 0, from: 100, to: 90 },
  { name: 'Ich mache komplexe Suspensions und Transitions.',                              severity: "success", id: 1, from: 90,  to: 75 },
  { name: 'Ich wurde schonmal suspended.',                                                severity: "success", id: 2, from: 75,  to: 60 },
  { name: 'Ich habe schon einige Fessel-Sessions gemacht.',                               severity: "warning", id: 3, from: 60,  to: 45 },
  { name: 'Ich war schonmal in einer Ganz-Körper-Fesselung.',                             severity: "warning", id: 4, from: 45,  to: 30 },
  { name: 'Ich habe fesseln schon ausprobiert.',                                          severity: "danger",  id: 5, from: 30,  to: 15 },
  { name: 'Ich wurde noch nie gefesslt.',                                                 severity: "danger",  id: 6, from: 15,  to: -1 },
];

export const GetPassiveLevelFromPercent = (passivePercent: number) => {
  for (let i in passiveLevels){
    if (passiveLevels[i].from >= passivePercent && passiveLevels[i].to < passivePercent){
      return passiveLevels[i];
    }
  }
  return passiveLevels[6];
}