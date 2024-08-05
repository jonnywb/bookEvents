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
import { createOutline } from "ionicons/icons";
import React, { useState } from "react";

import { useUserContext } from "../context/UserContext";
import { getUserByEmailPw } from "../utils/getUser";

import { auth, db } from "../config/FirebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const Register: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [disabled, setDisabled] = useState<boolean>(false);
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
      } catch (err) {
        console.log("error creating user", err);
      }
    } else {
      console.log("Invalid details, please try again", email, password, username);
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
