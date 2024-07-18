import {
  IonButton,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
  IonInput,
} from "@ionic/react";
import { createOutline } from "ionicons/icons";
import React, { useState, useContext } from "react";

import { UserContext } from "../context/UserContext";

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import FB from "../config/FirebaseConfig";

import { getFirestore, doc, setDoc } from "firebase/firestore";

const Register: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [disabled, setDisabled] = useState<boolean>(false);

  const userContext = useContext(UserContext);

  const auth = getAuth(FB);
  const db = getFirestore(FB);

  const doRegistration = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (email && password) {
      try {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);

        const docRef = await setDoc(doc(db, "users", user.uid), {
          displayName: username,
          email: email,
          createdAt: new Date(),
        });

        console.log(docRef);

        userContext?.setUser({
          uid: user.uid,
          displayName: username,
          email: email,
        });
      } catch (err) {
        console.log("error creating user", err);
      }
    } else {
      console.log("invalid email and or password", email, password);
    }
  };

  const confirmPassword = (pw: string) => {
    if (pw !== password) {
      setDisabled(true);
      console.log("passwords do not match");
    } else {
      setDisabled(false);
    }
  };

  return (
    <>
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
            className="ion-margin-top"
            mode="md"
            label="Email"
            type="email"
            placeholder="Email"
            labelPlacement="floating"
            fill="outline"
            clearInput
            required
            onIonInput={(e: any) => setEmail(e.target.value)}
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
