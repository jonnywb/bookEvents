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

const Login: React.FC = () => {
  const { setUser } = useUserContext();
  const router = useIonRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const doLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await getUserByEmailPw(email, password, setUser);
    router.push("/", "root");
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
