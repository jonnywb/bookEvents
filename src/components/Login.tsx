import {
  IonButton,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
  IonInput,
  useIonRouter,
} from "@ionic/react";
import { logInOutline } from "ionicons/icons";
import React, { useState } from "react";
import { getUserByEmailPw } from "../utils/getUser";

import { useUserContext } from "../context/UserContext";
import Error from "../components/Error";

import { validateEmail } from "../utils/validation";

const Login: React.FC = () => {
  const { setUser } = useUserContext();
  const router = useIonRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isErrorOpen, setIsErrorOpen] = useState<boolean>(false);

  const [emailIsValid, setEmailIsValid] = useState<boolean>();
  const [emailIsTouched, setEmailIsTouched] = useState(false);

  const doLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await getUserByEmailPw(email, password, setUser);
      router.push("/", "root");
    } catch (error: any) {
      setErrorMessage(error.message || "An unexpected error occurred. Please try again.");
      setIsErrorOpen(true);
    }
  };

  const handleEmailInput = (e: Event) => {
    const value = (e.target as HTMLInputElement).value;

    setEmailIsValid(undefined);

    if (value === "") return;

    setEmail(value);

    validateEmail(value) !== null ? setEmailIsValid(true) : setEmailIsValid(false);
  };

  const markTouched = () => {
    setEmailIsTouched(true);
  };

  return (
    <>
      {errorMessage && <Error message={errorMessage} isOpen={isErrorOpen} setIsOpen={setIsErrorOpen} />}
      <IonCardHeader>
        <IonCardTitle>Login</IonCardTitle>
        <IonCardSubtitle>
          <p>Enter your Login Details</p>
        </IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent>
        <form onSubmit={doLogin}>
          <IonInput
            className={`ion-margin-top ${emailIsValid && "ion-valid"} ${!emailIsValid && "ion-invalid"} ${
              emailIsTouched && "ion-touched"
            }`}
            mode="md"
            label="Email"
            type="email"
            placeholder="Email"
            labelPlacement="floating"
            helperText="Enter a valid email"
            errorText="Invalid Email"
            fill="outline"
            clearInput
            required
            onIonInput={(e) => handleEmailInput(e)}
            onIonBlur={() => markTouched()}
          />
          <IonInput
            className="ion-margin-top"
            mode="md"
            label="Password"
            type="password"
            placeholder="Password"
            labelPlacement="floating"
            fill="outline"
            clearInput
            required
            onIonInput={(e: any) => setPassword(e.target.value)}
          />
          <IonButton type="submit" className="ion-margin-top">
            <IonIcon slot="end" icon={logInOutline} />
            Login
          </IonButton>
        </form>
      </IonCardContent>
    </>
  );
};

export default Login;
