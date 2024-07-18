import {
  IonButton,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
  IonInput,
} from "@ionic/react";
import { logInOutline } from "ionicons/icons";
import React, { useState, useContext } from "react";

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, getDoc, doc } from "firebase/firestore";
import FB from "../config/FirebaseConfig";

import { UserContext } from "../context/UserContext";

const Login: React.FC = () => {
  const auth = getAuth(FB);
  const db = getFirestore(FB);

  const userContext = useContext(UserContext);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const doLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (email && password) {
      const { user } = await signInWithEmailAndPassword(auth, email, password);

      const userRef = await doc(db, "users", user.uid);

      const userSnap = await getDoc(userRef);

      const data = userSnap.data();

      if (data) {
        userContext?.setUser({
          uid: user.uid,
          email: data.email,
          displayName: data.displayName,
        });
      }
    }
  };

  return (
    <>
      <IonCardHeader>
        {/* Logo to be added here */}
        <IonCardTitle>Login</IonCardTitle>
        <IonCardSubtitle>
          <p>Enter your Login Details</p>
        </IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent>
        <form onSubmit={doLogin}>
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
