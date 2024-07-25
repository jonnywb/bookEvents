import {
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonPage,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect, useState } from "react";

import FB from "../config/FirebaseConfig";
import { collection, query, getDocs, where, getFirestore } from "firebase/firestore";
import EventCardList from "../components/EventCardList";

const FindEvents: React.FC = () => {
  const db = getFirestore(FB);

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
