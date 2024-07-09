import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonRouter } from "@ionic/react";
import React, { Dispatch, SetStateAction } from "react";

interface accountProps {
  setLoggedIn: Dispatch<SetStateAction<boolean>>;
}

const Account: React.FC<accountProps> = ({ setLoggedIn }) => {
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
              setLoggedIn(false);
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
