import {
  IonButton,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
  IonInput,
  useIonRouter,
  InputCustomEvent,
  InputInputEventDetail,
} from "@ionic/react";
import { createOutline } from "ionicons/icons";
import React, { useState } from "react";

import { useUserContext } from "../context/UserContext";
import { getUserByEmailPw } from "../utils/getUser";

import { auth, db } from "../config/FirebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import Error from "../components/Error";

import { validateEmail } from "../utils/validation";

const Register: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [disabled, setDisabled] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isErrorOpen, setIsErrorOpen] = useState<boolean>(false);

  const [emailIsValid, setEmailIsValid] = useState<boolean>();
  const [emailIsTouched, setEmailIsTouched] = useState(false);

  const router = useIonRouter();
  const { setUser } = useUserContext();

  const doRegistration = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (email && password && username) {
      try {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);

        await setDoc(doc(db, "users", user.uid), {
          displayName: username,
          email: email,
          createdAt: new Date(),
        });

        await getUserByEmailPw(email, password, setUser);
        router.push("/", "root");
      } catch (error: any) {
        setErrorMessage(error.message || "Error creating user. Please try again.");
        setIsErrorOpen(true);
      }
    } else {
      setErrorMessage("Invalid details, please try again.");
      setIsErrorOpen(true);
    }
  };

  const confirmPassword = (pw: string) => {
    if (pw !== password) {
      setDisabled(true);
      setErrorMessage("Passwords do not match.");
      setIsErrorOpen(true);
    } else {
      setDisabled(false);
      setErrorMessage(null);
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
        <IonCardTitle>Register</IonCardTitle>
        <IonCardSubtitle>
          <p>Enter your Registration Details</p>
        </IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent>
        <form onSubmit={doRegistration}>
          <IonInput
            mode="md"
            label="Username"
            type="text"
            placeholder="Username"
            labelPlacement="floating"
            fill="outline"
            clearInput
            required
            onIonInput={(e: any) => setUsername(e.target.value)}
          />

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
          <IonInput
            className="ion-margin-top"
            mode="md"
            label="Confirm Password"
            type="password"
            placeholder="Confirm Password"
            labelPlacement="floating"
            fill="outline"
            clearInput
            required
            onIonInput={(e: any) => confirmPassword(e.target.value)}
          />

          <IonButton type="submit" color="secondary" className="ion-margin-top" disabled={disabled}>
            <IonIcon slot="end" icon={createOutline} />
            Register
          </IonButton>
        </form>
      </IonCardContent>
    </>
  );
};

export default Register;
