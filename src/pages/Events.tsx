import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";

import { getFirestore, collection, query, getDocs } from "firebase/firestore";
import FB from "../config/FirebaseConfig";
import { useEffect, useState } from "react";
import { add } from "ionicons/icons";

import testData from "../demo/testData";

const Events: React.FC = () => {
  const db = getFirestore(FB);

  const [events, setEvents] = useState(testData) as any[];

  // const getEvents = async () => {
  //   const q = query(collection(db, "events"));
  //   const querySnapshot = await getDocs(q);
  //   setEvents([]);
  //   querySnapshot.forEach((doc) => {
  //     setEvents((prevEvents: any) => [...prevEvents, doc.data()]);
  //   });
  // };

  // useEffect(() => {
  //   getEvents();
  // }, []);

  const router = useIonRouter();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Events</IonTitle>
          <IonButton
            slot="end"
            className="ion-margin-end"
            onClick={() => {
              router.push("/create-event");
            }}
          >
            <IonIcon icon={add} slot="start" />
            Create Event
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          {events.map((event: any) => {
            return (
              <IonItem key={event.id}>
                <h2>{event.name}</h2>
                <p>{event.date}</p>
                <p>{event.location}</p>
              </IonItem>
            );
          })}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Events;
