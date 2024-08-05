import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonRouter } from "@ionic/react";

import { db } from "../config/FirebaseConfig";
import { query, collection, getDocs, where } from "firebase/firestore";

import { useState, useEffect } from "react";

import EventsCardList from "../components/EventCardList";
import { useUserContext } from "../context/UserContext";

const MyEvents: React.FC = () => {
  const { user } = useUserContext() || {};

  const [events, setEvents] = useState([]) as any[];

  useEffect(() => {
    getMyEvents();
  }, []);

  const getMyEvents = async () => {
    if (!user) {
      console.error("User not logged in");
      return;
    }

    try {
      const q = query(collection(db, "events"), where("attendees", "array-contains", user.uid));
      const querySnapshot = await getDocs(q);

      setEvents([]);

      querySnapshot.forEach((doc) => {
        const newDoc = { ...doc.data(), id: doc.id };
        setEvents((prevEvents: any) => [...prevEvents, newDoc]);
      });

      console.log(`Events successfully fetched for user ${user.uid}`);
    } catch (error) {
      console.error("Error fetching events: ", error);
    }
  };

  const router = useIonRouter();

  return (
    <IonPage>
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonTitle>My Events</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen={true}>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">My Events</IonTitle>
          </IonToolbar>
        </IonHeader>
        <EventsCardList events={events} getEvents={getMyEvents} />
      </IonContent>
    </IonPage>
  );
};

export default MyEvents;
