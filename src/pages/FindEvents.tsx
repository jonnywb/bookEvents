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
} from "@ionic/react";
import React, { useContext, useEffect, useState } from "react";

import FB from "../config/FirebaseConfig";
import { collection, query, getDocs, where, getFirestore } from "firebase/firestore";
import EventCardList from "../components/EventCardList";
import { add } from "ionicons/icons";
import { UserContext } from "../context/UserContext";

const FindEvents: React.FC = () => {
  const db = getFirestore(FB);
  const router = useIonRouter();
  const { user } = useContext(UserContext) || {};

  const [events, setEvents] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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
    const q = query(collection(db, "events"), where("category", "==", selectedCategory));

    const querySnapshot = await getDocs(q);

    setEvents([]);

    querySnapshot.forEach((doc) => {
      const newDoc = { ...doc.data(), id: doc.id };

      setEvents((prevEvents) => [...prevEvents, newDoc]);
    });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
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
          <EventCardList events={events} getEvents={getEvents} />
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default FindEvents;
