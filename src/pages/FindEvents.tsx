import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonPage,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
  useIonRouter,
  IonLoading,
  IonButtons,
  IonMenuButton,
  getPlatforms,
} from "@ionic/react";
import React, { useEffect, useState } from "react";

import { db } from "../config/FirebaseConfig";
import { collection, query, getDocs, where } from "firebase/firestore";
import EventCardList from "../components/EventCardList";
import { add } from "ionicons/icons";
import { useUserContext } from "../context/UserContext";
import Error from "../components/Error";

const FindEvents: React.FC = () => {
  const router = useIonRouter();
  const { user } = useUserContext();

  const [events, setEvents] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const categories = [
    "Author Meet and Greet",
    "Book Trivia Night",
    "Book Launch",
    "Poetry Reading",
    "Literary Festival",
    "Writing Workshop",
  ];

  useEffect(() => {
    if (!selectedCategory) return;

    getEvents();
  }, [selectedCategory]);

  const getEvents = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "events"), where("category", "==", selectedCategory));

      const querySnapshot = await getDocs(q);

      setEvents([]);

      querySnapshot.forEach((doc) => {
        const newDoc = { ...doc.data(), id: doc.id };

        setEvents((prevEvents) => [...prevEvents, newDoc]);
      });
    } catch (error) {
      console.error(error);
      setErrorMessage("Error fetching events");
      setIsOpen(true);
    }
    setLoading(false);
  };

  const isDesktop = getPlatforms().includes("desktop");

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          {isDesktop && (
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
          )}
          <IonTitle>Find Events</IonTitle>
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
      <IonContent className="ion-padding">
        <IonGrid>
          <IonRow className="ion-justify-content-center">
            <IonCol size="12">
              <IonSelect
                fill="outline"
                placeholder="Pick a Category..."
                labelPlacement="floating"
                label="Category"
                interface="action-sheet"
                value={selectedCategory}
                onIonChange={(e) => {
                  setSelectedCategory(e.detail.value);
                }}
              >
                {categories.map((category, i) => (
                  <IonSelectOption key={i} value={category}>
                    {category}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonCol>
          </IonRow>
          <IonLoading isOpen={loading} message={"Fetching events..."} />
          <EventCardList events={events} getEvents={getEvents} />
        </IonGrid>
        <Error message={errorMessage} isOpen={isOpen} setIsOpen={setIsOpen} />
      </IonContent>
    </IonPage>
  );
};

export default FindEvents;
