// @ts-ignore
import React, { useState, useRef } from 'react';

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Checkbox } from "primereact/checkbox";
import { Steps } from 'primereact/steps';
import { Toast } from 'primereact/toast';
import {PostSignUp} from "../api/auth";
import {PostUserData, UserData} from "../api/user_data";
import {
  UserFetlifeSetting,
  UserNameSetting, UserOpenSetting,
  UserQuestionSetting,
  UserRoleSettingDescriptive, UserShowSetting
} from "../components/UserDataSettings";

const Signup = ({OnSignUp, ShowLogIn}: {OnSignUp: (userId: number) => void, ShowLogIn: () => void}) => {
  const [step, setStep] = useState(-2)

  const [userData, setUserData] = useState<UserData>({
    user_id: 0,
    name: "",
    fetlife_name: "",
    experience_text: "",
    found_us_text: "",
    goal_text: "",
    role_factor: 50,
    open: false,
    show_name: false,
    show_role: false,
    show_open: false,
    new: false,
  });

  const [nameValid, setNameValid] = useState(false)
  const [withQuestions, setWithQuestions] = useState(true)
  const [showQuestions, setShowQuestions] = useState(true)

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

      userData.user_id = id;
      PostUserData(userData);

      OnSignUp(id);
    }, () => {
      errorPopup("Es gibt schon einen Account mit dieser Email.")
    }, () => {
      errorPopup("Daten nicht akzeptiert.")
    });

  }

  const checkContent = () => {
    if (step === 0) {
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
        <div className="flex flex-col w-full">
          <label className={"text-7xl self-center text-200 mt-4"}>Warst du schonmal beim Social Rope Lab?</label>
          <div className={"flex justify-evenly"} style={{height:"30rem"}}>
            <div className="flex flex-col justify-center">
                <Button
                    type="submit"
                    className="text-5xl"
                    onClick={() => {
                      setStep(-1)
                    }}>
                    Ja
                </Button>
            </div>
            <div className="flex flex-col justify-center">
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
          <div className="flex flex-col w-full">
              <label className={"text-7xl self-center text-200 mt-4"}>Hast du schon einen Account?</label>
              <div className={"flex justify-evenly"} style={{height: "30rem"}}>
                  <div className="flex flex-col justify-center">
                      <Button
                          type="submit"
                          className="text-5xl"
                          onClick={ShowLogIn}>
                          Ja
                      </Button>
                  </div>
                  <div className="flex flex-col justify-center">
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
        <div className='mx-2 m-10 flex flex-col items-center'>
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
                    <UserNameSetting userData={userData} setUserData={setUserData} valid={nameValid} setValid={setNameValid} />

                    <div className='mt-4 mb-2'>
                      Hast du einen Fetlife Aoccunt?
                    </div>
                    <UserFetlifeSetting userData={userData} setUserData={setUserData} />

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
                          <UserQuestionSetting userData={userData} setUserData={setUserData}/>
                        </div> : <></>
                    }

                    <div className='flex'>
                      <div className='grow'/>
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
                  <UserRoleSettingDescriptive userData={userData} setUserData={setUserData}/>

                  <UserOpenSetting userData={userData} setUserData={setUserData}/>

                  <div className='flex'>
                    <Button
                      onClick={() => {
                        setStep(0)
                      }}
                      className='my-4'>
                      Zurück
                    </Button>
                    <div className='grow'/>
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
                  <UserShowSetting userData={userData} setUserData={setUserData} />

                  <div className='flex'>
                    <Button
                        onClick={() => {setStep(1)}}
                        className='my-4'>
                      Zurück
                    </Button>
                    <div className='grow'/>
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
                  <div className='flex flex-col'>
                    <div className='align-self-center my-4 text-xl'>
                      Bitte lege einen Account mit Email und Passwort an.
                    </div>

                    <div className='mt-4 mb-2'>
                      Email:
                    </div>
                      <InputText
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          placeholder="Email address"
                          className='w-full'
                          invalid={!emailValid}
                      />


                    <div className='mt-4 mb-2'>
                      Password
                    </div>
                      <InputText
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          placeholder="Password"
                          className='w-full'
                          invalid={!passwordValid}
                      />


                    <div className='flex'>
                      <Button
                          onClick={() => {setStep(2)}}
                          className='my-4'>
                        Zurück
                      </Button>
                      <div className='grow'/>
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
