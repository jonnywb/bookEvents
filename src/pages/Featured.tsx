import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonLoading,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";

import { db } from "../config/FirebaseConfig";
import { query, collection, getDocs, where } from "firebase/firestore";

import { useState, useEffect } from "react";
import { add } from "ionicons/icons";

import EventsCardList from "../components/EventCardList";

import "./Featured.css";
import { useUserContext } from "../context/UserContext";
import Error from "../components/Error";

const Featured: React.FC = () => {
  const { user } = useUserContext();
  const router = useIonRouter();

  const [events, setEvents] = useState([]) as any[];
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    getEvents();
  }, []);

  const getEvents = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "events"), where("featured", "==", true));
      const querySnapshot = await getDocs(q);
      setEvents([]);
      querySnapshot.forEach((doc) => {
        const newDoc = { ...doc.data(), id: doc.id };
        setEvents((prevEvents: any) => [...prevEvents, newDoc]);
      });
    } catch (error) {
      console.error("Error fetching events: ", error);
      setErrorMessage("Error fetching events");
      setIsOpen(true);
    }
    setLoading(false);
  };

  if (user) {
    return (
      <IonPage>
        <IonHeader translucent={true}>
          <IonToolbar>
            <IonTitle>Featured Events</IonTitle>
            {user.staffMember && (
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
          <IonLoading isOpen={loading} message={"loading..."} />
          <EventsCardList events={events} getEvents={getEvents} />
          <Error message={errorMessage} setIsOpen={setIsOpen} isOpen={isOpen} />
        </IonContent>
      </IonPage>
    );
  }
};

export default Featured;
