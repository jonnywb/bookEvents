import { IonContent, IonHeader, IonPage, IonSearchbar, IonTitle, IonToolbar } from "@ionic/react";
import React from "react";

const Search: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Search</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonSearchbar />
      </IonContent>
    </IonPage>
  );
};

export default Search;
