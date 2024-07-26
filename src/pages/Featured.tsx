import {
  IonButton,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";

import { getFirestore, query, collection, getDocs, where } from "firebase/firestore";
import FB from "../config/FirebaseConfig";
import { useState, useEffect, useContext } from "react";
import { add } from "ionicons/icons";

import EventsCardList from "../components/EventCardList";

import "./Featured.css";
import { UserContext } from "../context/UserContext";

const Featured: React.FC = () => {
  const db = getFirestore(FB);
  const { user } = useContext(UserContext) || {};

  const [events, setEvents] = useState([]) as any[];

  useEffect(() => {
    getEvents();
  }, []);

  const getEvents = async () => {
    const q = query(collection(db, "events"), where("featured", "==", true));
    const querySnapshot = await getDocs(q);
    setEvents([]);
    querySnapshot.forEach((doc) => {
      const newDoc = { ...doc.data(), id: doc.id };
      setEvents((prevEvents: any) => [...prevEvents, newDoc]);
    });
  };

  const router = useIonRouter();

  return (
    <IonPage>
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonTitle>Featured Events</IonTitle>
          {user?.staffMember && (
            <IonButton
              slot="end"
              className="ion-margin-end create-event-button"
              onClick={() => {
                router.push("/add-event");
              }}
              fill="clear"
            >
              <IonIcon icon={add} slot="start" />
              Add Event
            </IonButton>
          )}
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen={true}>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Featured Events</IonTitle>
          </IonToolbar>
        </IonHeader>
        <EventsCardList events={events} getEvents={getEvents} />
      </IonContent>
    </IonPage>
  );
};

export default Featured;
