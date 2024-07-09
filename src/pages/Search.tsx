import { IonCard, IonContent, IonHeader, IonInput, IonPage, IonTitle, IonToolbar } from "@ionic/react";
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
        <IonInput
          placeholder="Type your query here..."
          type="text"
          className="ion-margin-top"
          mode="md"
          label="Search"
          labelPlacement="floating"
          fill="outline"
          clearInput
        />
      </IonContent>
    </IonPage>
  );
};

export default Search;
