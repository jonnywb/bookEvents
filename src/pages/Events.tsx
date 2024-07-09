import { IonCard, IonContent, IonHeader, IonList, IonPage, IonTitle, IonToolbar } from "@ionic/react";

const Events: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Events</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Events</IonTitle>
          </IonToolbar>
          <IonList>
            <IonCard>Event 1</IonCard>
            <IonCard>Event 2</IonCard>
            <IonCard>Event 3</IonCard>
            <IonCard>Event 4</IonCard>
          </IonList>
        </IonHeader>
      </IonContent>
    </IonPage>
  );
};

export default Events;
