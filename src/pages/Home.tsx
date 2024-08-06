import {
  IonContent,
  IonGrid,
  IonPage,
  IonCard,
  IonCol,
  IonRow,
  IonItem,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonIcon,
} from "@ionic/react";
import React, { useState } from "react";

import "./Home.css";

import Login from "../components/Login";
import Register from "../components/Register";
import { personAddOutline, personOutline } from "ionicons/icons";

const Home: React.FC = () => {
  const [page, setPage] = useState<string>("login");

  return (
    <IonPage>
      <IonContent>
        <IonGrid fixed>
          <IonRow className="ion-justify-content-center">
            <IonCol sizeXs="7.5" sizeSm="7.5" sizeMd="5.5" sizeLg="4" sizeXl="3.5">
              <img src="/logo.png" alt="bookEvents" className="ion-margin" />
            </IonCol>
          </IonRow>
          <IonRow className="ion-justify-content-center">
            <IonCol size="12" sizeMd="8" sizeLg="6" sizeXl="4">
              <IonItem>
                <IonSegment
                  value={page}
                  onIonChange={(e) => {
                    const value = e.detail.value as string;
                    setPage(value);
                  }}
                >
                  <IonSegmentButton value="login" layout="icon-start">
                    <IonIcon icon={personOutline} />
                    <IonLabel>Login</IonLabel>
                  </IonSegmentButton>
                  <IonSegmentButton value="register" layout="icon-start">
                    <IonIcon icon={personAddOutline} />
                    <IonLabel>Register</IonLabel>
                  </IonSegmentButton>
                </IonSegment>
              </IonItem>
              <IonCard>
                {page === "login" && <Login />}

                {page === "register" && <Register />}
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Home;
