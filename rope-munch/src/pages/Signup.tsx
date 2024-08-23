// @ts-ignore
import React, { useState, useRef } from 'react';

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Checkbox } from "primereact/checkbox";
import { Slider } from 'primereact/slider';
import { Steps } from 'primereact/steps';
import { Toast } from 'primereact/toast';
import {ProgressBar} from "primereact/progressbar";
import {Tag} from "primereact/tag";
import {GetActiveLevelFromPercent, GetPassiveLevelFromPercent, GetRoleFromPercent} from "../api/data";
import {PostSignUp} from "../api/auth";
import {PostUserData} from "../api/user_data";

const Signup = ({OnSignUp, ShowLogIn}: {OnSignUp: () => void, ShowLogIn: () => void}) => {
  const [step, setStep] = useState(-2)

  const [name, setName] = useState("")
  const [nameValid, setNameValid] = useState(true)

  const [fetname, setFetName] = useState("")

  const [withQuestions, setWithQuestions] = useState(true)
  const [showQuestions, setShowQuestions] = useState(true)
  const [foundUsText, setFoundUsText] = useState("")
  const [experienceText, setExperinceText] = useState("")
  const [goalText, setGoalText] = useState("")

  const [roleFactor, setRoleFactor] = useState(0.5)
  const [activeFactor, setActiveFactor] = useState(0.0)
  const [passiveFactor, setPassiveFactor] = useState(0.0)
  const [open, setOpen] = useState(false)

  const [showName, setShowName] = useState(false)
  const [showRole, setShowRole] = useState(false)
  const [showExperience, setShowExperience] = useState(false)
  const [showOpen, setShowOpen] = useState(false)

  const [email, setEmail] = useState("")
  const [emailValid, setEmailValid] = useState(true)

  const [password, setPassword] = useState("")
  const [passwordValid, setPasswordValid] = useState(true)

  /*
  const navigate = useNavigate();
  const {state} = useLocation();
  let fromEventId = undefined;
  if (state != null && state.fromEventId != undefined) {
    fromEventId = state.fromEventId;
  }
   */

  const toast = useRef<Toast>(null);

  const onSubmit = async () => {

    PostSignUp(email, password, (id) => {

      PostUserData({
        user_id: id,
        name: name,
        fetlife_name: fetname,
        experience_text: experienceText,
        found_us_text: foundUsText,
        goal_text: goalText,
        role_factor: roleFactor,
        active_factor: activeFactor,
        passive_factor: passiveFactor,
        open: open,
        show_name: showName,
        show_role: showRole,
        show_experience: showExperience,
        show_open: showOpen,
      });

      OnSignUp();
    }, () => {
      errorPopup("Es gibt schon einen Account mit dieser Email.")
    }, () => {
      errorPopup("Daten nicht akzeptiert.")
    });

  }

  const checkContent = () => {
    if (step === 0) {
      const nameValid = name !== "";

      if (!nameValid) {
        errorPopup("Der Name / Nick darf nicht leer sein.");
      }

      setNameValid(nameValid)
      return nameValid
    }

    if (step === 3) {
      const emailValid = validateEmail(email)
      const passwordValid = password.length >= 6;

      if (!emailValid) {
        errorPopup("Keine valide Email.");
      }

      if (!passwordValid) {
        errorPopup("Das Passwort ist nicht lang genug.");
      }

      setEmailValid(emailValid)
      setPasswordValid((passwordValid))
      return emailValid && passwordValid
    }

    return true
  }

  const errorPopup = (text: string) => {
    toast.current!.show({ severity: 'error', summary: 'Error', detail: text, life: 3000 });
  }

  const validateEmail = (email: string) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ) != undefined;
  };

  const items = [
    {
      label: 'Verifizieren',
      command: () => {
        if (step > 0 || (step < 0 && checkContent())) {
         setStep(0)
        }
      }
    },
    {
      label: 'Über Dich',
      command: () => {
        if (step > 1 || (step < 1 && checkContent())) {
          setStep(1)
        }
      }
    },
    {
      label: 'Sichtbarkeit',
      command: () => {
        if (step > 2 || (step < 2 && checkContent())) {
          setStep(2)
        }
      }
    },
    {
      label: 'Account',
      command: () => {
        if (step > 3 || step < 3 && checkContent()) {
          setStep(3)
        }
      }
    }
  ];

  return (
    <div>
      <Toast ref={toast} />    
      {step === -2 &&
        <div className="absolute left-0 flex flex-column w-full" style={{minHeight: "85vh"}}>
          <label className={"text-7xl text-center text-200 mt-4"} >Warst du schonmal beim Social Rope Lab?</label>
          <div className={"flex-1 flex justify-content-evenly"}>
            <div className="flex flex-column justify-content-center">
              <Button
                type="submit"
                className="text-5xl"
                onClick={() => { setStep(-1) }}>
                Ja
              </Button>
            </div>
            <div className="flex flex-column justify-content-center">
              <Button
                type="submit"
                className="text-5xl"
                onClick={() => {
                  setWithQuestions(true)
                  setShowQuestions(true)
                  setStep(0)
                }}>
                Nein
              </Button>
            </div>
          </div>
        </div>
      }

      {step === -1 &&
        <div className={"absolute left-0 flex flex-column w-full h-full"}>
          <label className={"text-7xl text-center text-200 mt-4"}>Hast du schon einen Account?</label>
          <div className={"flex-1 flex justify-content-evenly"}>
            <div className="flex flex-column justify-content-center">
              <Button
                type="submit"
                className="text-5xl"
                onClick={ShowLogIn}>
                Ja
              </Button>
            </div>
            <div className="flex flex-column justify-content-center">
              <Button
                type="submit"
                className="text-5xl"
                onClick={() => {
                  setWithQuestions(false)
                  setShowQuestions(false)
                  setStep(0)
                }}>
                Nein
              </Button>
            </div>
          </div>
        </div>
      }

      {step >= 0 &&
        <div className='mx-2 m-10 flex flex-column align-items-center'>
          <div className="border-round surface-0 mt-4 w-full" style={{maxWidth: "40rem"}}>
            <form className="m-2">
              <div className='sticky top-0 surface-0 border-round'>
                <Steps
                    model={items}
                    activeIndex={step}
                    readOnly={false}
                    className='py-2'
                />
              </div>


              {step === 0 &&
                  <div>
                    <div className='text-xl my-4'>
                      Wir verifizieren jede Person, bevor sie zu den Events zugelassen wird.
                    </div>

                    <div className='mt-4 mb-2'>
                      Nenne uns einen Namen oder Scenen-Nick an dem wir dich identifzieren können.
                    </div>
                    {nameValid ?
                        <InputText
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="Name / Nick"
                            className='w-full'
                        /> :
                        <InputText
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="Name / Nick"
                            className='w-full p-invalid'
                        />
                    }

                    <div className='mt-4 mb-2'>
                      Hast du einen Fetlife Aoccunt?
                    </div>
                    <InputText
                        type="text"
                        value={fetname}
                        onChange={(e) => setFetName(e.target.value)}
                        required
                        placeholder="Fetlife Name"
                        className='w-full'
                    />

                    {withQuestions ?
                        <div className='my-4 text-xl'>
                          Um dich zu verifiziern haben wir drei offne Fragen an dich. Du musst natürlich nur so viel sagen wie du dich wohl fühlst. 
                        </div> :
                        <div className='my-4 text-xl'>
                          <p>
                            Wenn du meinst das dein Name/Nick uns nicht bekannt vorkommen wird und wir dich an diesem nicht verifiziern können.
                            Beantworte diese drei offenen Fragen. Du musst natürlich nur so viel sagen wie du dich wohl fühlst. 
                          </p>
                          <label className='mr-2'>
                            Zeige die Fragen an:
                          </label>
                          <Checkbox
                              onChange={e => {
                                if (e == undefined) {
                                  setShowQuestions(false)
                                  return
                                }
                                setShowQuestions(e.checked!)
                              }}
                              checked={showQuestions}/>

                        </div>
                    }

                    {showQuestions ?
                        <div>
                          <div className='mt-4 mb-2'>
                            Wie hast du vom Rope Lab erfahren?
                          </div>
                          <InputTextarea
                              value={foundUsText}
                              onChange={(e) => setFoundUsText(e.target.value)}
                              placeholder="Ich habe euch ..."
                              rows={5}
                              className='w-full'
                          />

                          <div className='mt-4 mb-2'>
                            Wie viel Erfahrung hast du mit Seilen?
                          </div>
                          <InputTextarea
                              value={experienceText}
                              onChange={(e) => setExperinceText(e.target.value)}
                              placeholder="Ich habe ..."
                              rows={5}
                              className='w-full'
                          />

                          <div className='mt-4 mb-2'>
                            Wenn du nach dem Event nach Hause gehst, was wünschst du dir getan, geschafft oder gelernt zu haben?
                          </div>
                          <InputTextarea
                              value={goalText}
                              onChange={(e) => setGoalText(e.target.value)}
                              placeholder="Ich erhoffe mir vom Rope Lab ..."
                              rows={5}
                              className='w-full'
                          />
                        </div> : <></>
                    }

                    <div className='flex'>
                      <div className='flex-grow-1'/>
                      <Button
                          onClick={() => {
                            if (checkContent()) {
                              setStep(1)
                            }
                          }
                          }
                          className='my-4'>
                        Weiter
                      </Button>
                    </div>
                  </div>}

              {step === 1 &&
                <div>
                  <div className='my-4 text-xl'>
                    Hier kannst du ein paar Infos über dich angeben.
                  </div>

                  <div>
                    Diese Infos können optional für andere sichtbar sein,
                    aber vorallem helfen sie uns einzuschätzen welcher Verteilung und Wissensstand beim den Events sein
                    wird.
                  </div>


                  <div className='mt-6 mb-2 text-xl'>
                    Zu wie viele Prozent siehts du dich als Rope Top? (Deine Rolle)
                  </div>
                  <div className='mt-2 mb-3'>
                    Darstellung:
                    <ProgressBar
                      className="bg-indigo-300 mt-1 mb-4"
                      style={{height: '12px'}}
                      displayValueTemplate={() => ""}
                      value={roleFactor}
                    />

                    {GetRoleFromPercent(roleFactor).name}
                  </div>

                  <Slider
                    value={roleFactor}
                    onChange={(e) => setRoleFactor(e.value as number)}
                    className='mx-2'
                  />

                  <div className='mt-6 mb-2 text-xl'>
                    Wie gut kannst du fesseln?
                  </div>
                  <div className='mt-2 mb-3'>
                    Darstellung:
                    <ProgressBar
                      className="mt-1 mb-4"
                      style={{height: '12px'}}
                      displayValueTemplate={() => ""}
                      value={activeFactor}
                    />

                    {GetActiveLevelFromPercent(activeFactor).name}
                  </div>
                  <Slider
                    value={activeFactor}
                    onChange={(e) => setActiveFactor(e.value as number)}
                    className='mx-2'
                  />

                  <div className='mt-6 mb-2 text-xl'>
                    Wie viel Erfahrung hast du im gefesselt werden?
                  </div>
                  <div className='mt-2 mb-3'>
                    Darstellung:
                    <ProgressBar
                      className="bg-indigo-300 mt-1 mb-4"
                      style={{height: '12px'}}
                      color="#dee2e6"
                      displayValueTemplate={() => ""}
                      value={100 - passiveFactor}
                    />

                    {GetPassiveLevelFromPercent(passiveFactor).name}
                  </div>
                  <Slider
                    value={passiveFactor}
                    onChange={(e) => setPassiveFactor(e.value as number)}
                    className='mx-2'
                  />

                  <div className='mt-6 mb-2 text-xl'>
                    Zusammen gesetzte Darstellung:
                  </div>

                  <div className="w-full flex flex-column">
                    <label className="my-1">Rolle: {GetRoleFromPercent(roleFactor).name}</label>
                    <ProgressBar
                      className="w-full bg-indigo-300"
                      style={{height: '12px'}}
                      displayValueTemplate={() => ""}
                      value={roleFactor}
                    />
                    <div className="w-full flex mt-1">
                      <ProgressBar
                        className="flex-grow-1 mr-1"
                        style={{height: '7px'}}
                        displayValueTemplate={() => ""}
                        value={activeFactor}
                      />
                      <ProgressBar
                        className="flex-grow-1 bg-indigo-300"
                        style={{height: '7px'}}
                        color="#dee2e6"
                        displayValueTemplate={() => ""}
                        value={100 - passiveFactor}
                      />
                    </div>
                    <div className="w-full flex mt-1">
                      <Tag value={GetActiveLevelFromPercent(activeFactor).name}/>
                      <div className="flex-grow-1 mx-1"/>
                      <Tag value={GetPassiveLevelFromPercent(passiveFactor).name} className='bg-indigo-300'/>
                    </div>
                  </div>

                  <div className='mt-6 mb-2 text-xl'>
                    Hast Interesse mit neuen Personen zu fesseln?
                  </div>
                  <div>
                    <label className='mr-2 text-xl'>Ja:</label>
                    <Checkbox
                      onChange={e => {
                        setOpen(e.checked!)
                        if (!e) {
                          setShowOpen(false)
                        }
                      }}
                      checked={open}/>
                  </div>

                  <div className='flex'>
                    <Button
                      onClick={() => {
                        setStep(0)
                      }}
                      className='my-4'>
                      Zurück
                    </Button>
                    <div className='flex-grow-1'/>
                    <Button
                      onClick={() => {
                        if (checkContent()) {
                          setStep(2)
                        }
                      }
                      }
                      className='my-4'>
                      Weiter
                    </Button>
                  </div>

                </div>}

              {step === 2 &&
                <div>
                  <div className='my-4 text-xl'>
                    Hier kannst du einstellen was andere Teilnehmer sehen können.
                  </div>


                  <div className="field grid">
                    <label className="col-fixed w-10rem">Namen / Nick:</label>
                    <Checkbox
                      onChange={e => setShowName(e.checked!)}
                      checked={showName}
                      className='col'/>
                  </div>

                  <div className="field grid">
                    <label className="col-fixed w-10rem">Rolle:</label>
                    <Checkbox
                      onChange={e => setShowRole(e.checked!)}
                      checked={showRole}
                      className='col'/>
                  </div>

                  <div className="field grid">
                    <label className="col-fixed w-10rem">Erfahrung:</label>
                    <Checkbox
                      onChange={e => setShowExperience(e.checked!)}
                      checked={showExperience}
                          className='col'/>
                    </div>

                    {open ?
                        <div className="field grid">
                          <label className="col-fixed w-10rem">Mit neuen Personen zu fesseln:</label>
                          <Checkbox
                              onChange={e => setShowOpen(e.checked!)}
                              checked={showOpen}
                              className='col'/>
                        </div> : <></>}

                    <div className='flex'>
                      <Button
                          onClick={() => {setStep(1)}}
                          className='my-4'>
                        Zurück
                      </Button>
                      <div className='flex-grow-1'/>
                      <Button
                          onClick={() => {
                            if (checkContent()) {
                              setStep(3)
                            }
                          }
                          }
                          className='my-4'>
                        Weiter
                      </Button>
                    </div>
                  </div>}

              {step == 3 &&
                  <div className='flex flex-column'>
                    <div className='align-self-center my-4 text-xl'>
                      Bitte lege einen Account mit Email und Passwort an.
                    </div>

                    <div className='mt-2'>
                      Ich weiß noch ein Account und noch ein Passwort...
                    </div>
                    <div className='mb-2'>
                      Aber für diese erste Version geht es nicht anders. Wir arbeiten an Alternativen.
                    </div>

                    <div className='mt-4 mb-2'>
                      Email:
                    </div>
                    {emailValid ?
                        <InputText
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Email address"
                            className='w-full'
                        /> :
                        <InputText
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Email address"
                            className='w-full p-invalid'
                        />

                    }


                    <div className='mt-4 mb-2'>
                      Password
                    </div>
                    {passwordValid ?
                        <InputText
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Password"
                            className='w-full'
                        /> :
                        <InputText
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Password"
                            className='w-full p-invalid'
                        />}


                    <div className='flex'>
                      <Button
                          onClick={() => {setStep(2)}}
                          className='my-4'>
                        Zurück
                      </Button>
                      <div className='flex-grow-1'/>
                      <Button
                          type="submit"
                          onClick={(e) => {
                            e.preventDefault()

                            if (checkContent()) {
                              onSubmit()
                            }
                          }}
                          className='my-4'>
                        Account erstellen
                      </Button>
                    </div>

                  </div>}

            </form>

          </div>
        </div>}
    </div>
  )
}

export default Signup
