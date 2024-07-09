import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonRouter } from "@ionic/react";
import React, { Dispatch, SetStateAction } from "react";

interface accountProps {
  setLoggedIn: Dispatch<SetStateAction<boolean>>;
}

const Account: React.FC<accountProps> = ({ setLoggedIn }) => {
  const history = useIonRouter();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Account</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonButton
          onClick={() => {
            setLoggedIn(false);
            history.push("/", "root");
          }}
        >
          Log Out
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Account;
