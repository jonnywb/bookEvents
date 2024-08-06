import {
  IonContent,
  IonGrid,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonToggle,
  IonCard,
  IonCol,
  IonRow,
  IonItem,
} from "@ionic/react";
import React, { useState } from "react";

import "./Home.css";

import Login from "../components/Login";
import Register from "../components/Register";

const Home: React.FC = () => {
  const [showRegister, setShowRegister] = useState<boolean>(false);

  return (
    <IonPage>
      <IonContent>
        <IonGrid fixed>
          <IonRow className="ion-justify-content-center">
            <IonCol sizeXs="7" sizeSm="7" sizeMd="5" sizeLg="3.5" sizeXl="3">
              <img src="/icon.png" alt="bookEvents" />
            </IonCol>
          </IonRow>
          <IonRow className="ion-justify-content-center">
            <IonCol size="12" sizeMd="8" sizeLg="6" sizeXl="4">
              <IonCard>
                {!showRegister && <Login />}

                {showRegister && <Register />}
              </IonCard>
              <IonItem>
                <IonToggle
                  justify="end"
                  onIonChange={(e: any) => {
                    setShowRegister(e.target.checked);
                  }}
                >
                  Create a new account
                </IonToggle>
              </IonItem>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Home;
