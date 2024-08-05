import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonLoading } from "@ionic/react";

import { db } from "../config/FirebaseConfig";
import { query, collection, getDocs, where } from "firebase/firestore";

import { useState, useEffect } from "react";

import EventsCardList from "../components/EventCardList";
import { useUserContext } from "../context/UserContext";
import Error from "../components/Error";

const MyEvents: React.FC = () => {
  const { user } = useUserContext() || {};

  const [events, setEvents] = useState([]) as any[];
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showError, setShowError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getMyEvents();
  }, []);

  const getMyEvents = async () => {
    setLoading(true);
    if (!user) {
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
      setErrorMessage("Error fetching events");
      setShowError(true);
    }
    setLoading(false);
  };

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
        <IonLoading isOpen={loading} message={"loading..."} />
        <EventsCardList events={events} getEvents={getMyEvents} />
        <Error message={errorMessage} setIsOpen={setShowError} isOpen={showError} />
      </IonContent>
    </IonPage>
  );
};

export default MyEvents;
