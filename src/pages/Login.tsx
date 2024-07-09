import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInput,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { createOutline, logInOutline } from "ionicons/icons";
import React, { Dispatch, SetStateAction } from "react";

interface homeProps {
  setLoggedIn: Dispatch<SetStateAction<boolean>>;
}

const Login: React.FC<homeProps> = ({ setLoggedIn }) => {
  const doLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoggedIn(true);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>bookEvents</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent scrollY={false}>
        <IonGrid fixed>
          <IonRow className="ion-justify-content-center">
            <IonCol size="12" sizeMd="8" sizeLg="6" sizeXl="4">
              <div className="ion-text-center ion-padding">{/* Logo to be added here */}</div>
            </IonCol>
          </IonRow>

          <IonRow className="ion-justify-content-center">
            <IonCol size="12" sizeMd="8" sizeLg="6" sizeXl="4">
              <IonCard>
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
                      mode="md"
                      label="Email"
                      type="email"
                      placeholder="email@provider.com"
                      labelPlacement="floating"
                      fill="outline"
                      clearInput
                    ></IonInput>
                    <IonInput
                      className="ion-margin-top"
                      mode="md"
                      label="Password"
                      type="password"
                      placeholder="Password"
                      labelPlacement="floating"
                      fill="outline"
                      clearInput
                    ></IonInput>

                    <IonToolbar color="none" className="ion-margin-top">
                      <IonButton type="submit">
                        <IonIcon slot="end" icon={logInOutline} />
                        Login
                      </IonButton>

                      <IonButton color="secondary">
                        <IonIcon slot="end" icon={createOutline} />
                        Register
                      </IonButton>
                    </IonToolbar>
                  </form>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Login;
