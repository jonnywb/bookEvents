import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonRouter } from "@ionic/react";
import React from "react";

const Account: React.FC = () => {
  const router = useIonRouter();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Account</IonTitle>
          <IonButton
            className="ion-margin-end"
            slot="end"
            onClick={() => {
              // setLoggedIn(false);
              router.push("/", "root");
            }}
          >
            Log Out
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding"></IonContent>
    </IonPage>
  );
};

export default Account;
